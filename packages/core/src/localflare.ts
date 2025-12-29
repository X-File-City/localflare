import { Miniflare } from 'miniflare'
import { resolve, dirname } from 'node:path'
import * as esbuild from 'esbuild'
import { Readable } from 'node:stream'
import * as readline from 'node:readline'
import { parseWranglerConfig, discoverBindings, getBindingSummary, findWranglerConfig } from './config.js'
import type { LocalFlareOptions, DiscoveredBindings, WranglerConfig, WorkerLogCallback } from './types.js'

export class LocalFlare {
  private mf: Miniflare | null = null
  private config: WranglerConfig | null = null
  private bindings: DiscoveredBindings | null = null
  private options: Required<LocalFlareOptions>

  constructor(options: LocalFlareOptions = {}) {
    // Auto-detect config if not provided
    let configPath = options.configPath
    if (!configPath) {
      const detected = findWranglerConfig(process.cwd())
      configPath = detected ?? './wrangler.toml' // Fallback for error messaging
    }

    this.options = {
      configPath,
      port: options.port ?? 8787,
      dashboardPort: options.dashboardPort ?? 8788,
      persistPath: options.persistPath ?? '.localflare',
      verbose: options.verbose ?? false,
      onWorkerLog: options.onWorkerLog ?? (() => {}),
    }
  }

  async start(): Promise<void> {
    const configPath = resolve(this.options.configPath)
    const rootDir = dirname(configPath)

    // Parse wrangler.toml
    this.config = parseWranglerConfig(configPath)
    this.bindings = discoverBindings(this.config)

    // Log discovered bindings
    if (this.options.verbose) {
      console.log('\n📦 Discovered bindings:')
      getBindingSummary(this.bindings).forEach(line => {
        console.log(`   ${line}`)
      })
      console.log('')
    }

    // Build Miniflare options
    const persistRoot = resolve(rootDir, this.options.persistPath)

    // Compile the worker entry point with esbuild
    const entryPoint = resolve(rootDir, this.config.main || 'src/index.ts')
    const buildResult = await esbuild.build({
      entryPoints: [entryPoint],
      bundle: true,
      format: 'esm',
      target: 'es2022',
      write: false,
      minify: false,
      sourcemap: false,
      conditions: ['workerd', 'worker', 'browser'],
      external: ['cloudflare:*', 'node:*'],
    })

    const scriptContent = buildResult.outputFiles?.[0]?.text
    if (!scriptContent) {
      throw new Error('Failed to compile worker script')
    }

    // Build explicit binding configurations from parsed config
    // Miniflare v3 expects bindings as objects keyed by binding name
    const d1Databases = Object.fromEntries(
      this.bindings.d1.map(d => [d.binding, d.database_id])
    )

    const kvNamespaces = Object.fromEntries(
      this.bindings.kv.map(k => [k.binding, k.id])
    )

    const r2Buckets = Object.fromEntries(
      this.bindings.r2.map(r => [r.binding, r.bucket_name])
    )

    const queueProducers = Object.fromEntries(
      this.bindings.queues.producers.map(q => [q.binding, q.queue])
    )

    // Queue consumers configuration for Miniflare
    // Maps queue name to consumer options
    const queueConsumers = Object.fromEntries(
      this.bindings.queues.consumers.map(c => [
        c.queue,
        {
          maxBatchSize: c.max_batch_size ?? 10,
          maxBatchTimeout: c.max_batch_timeout ?? 5,
          maxRetries: c.max_retries ?? 3,
          deadLetterQueue: c.dead_letter_queue,
        },
      ])
    )

    const durableObjects = Object.fromEntries(
      this.bindings.durableObjects.map(d => [d.name, d.class_name])
    )

    // Create a handler for worker stdout/stderr to capture logs
    // Use arrow function to capture 'this' and access current callback
    const handleRuntimeStdio = (stdout: Readable, stderr: Readable) => {
      if (this.options.verbose) {
        console.log('[LocalFlare] Runtime stdio handler connected')
      }

      const processStream = (stream: Readable, level: 'log' | 'error') => {
        const rl = readline.createInterface({ input: stream })
        rl.on('line', (line) => {
          // Skip empty lines
          if (!line.trim()) return

          // Determine log level from content
          let logLevel: 'log' | 'info' | 'warn' | 'error' | 'debug' = level === 'error' ? 'error' : 'log'
          if (line.includes('[warn]') || line.includes('WARNING')) {
            logLevel = 'warn'
          } else if (line.includes('[info]') || line.includes('INFO')) {
            logLevel = 'info'
          } else if (line.includes('[debug]') || line.includes('DEBUG')) {
            logLevel = 'debug'
          } else if (line.includes('[error]') || line.includes('ERROR')) {
            logLevel = 'error'
          }

          // Access callback via this.options to allow setting it after start()
          this.options.onWorkerLog({ level: logLevel, message: line })
        })
      }

      processStream(stdout, 'log')
      processStream(stderr, 'error')
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const miniflareOptions: any = {
      modules: [
        {
          type: 'ESModule',
          path: entryPoint,
          contents: scriptContent,
        },
      ],
      port: this.options.port,
      verbose: this.options.verbose,
      kvPersist: `${persistRoot}/kv`,
      d1Persist: `${persistRoot}/d1`,
      r2Persist: `${persistRoot}/r2`,
      durableObjectsPersist: `${persistRoot}/do`,
      cachePersist: `${persistRoot}/cache`,
      // Explicit binding configurations
      bindings: this.bindings.vars,
      // Capture worker stdout/stderr for logging
      handleRuntimeStdio,
      // Use plain text logs instead of structured JSON for easier parsing
      structuredWorkerdLogs: false,
    }

    // Only add bindings if they exist
    if (Object.keys(d1Databases).length > 0) {
      miniflareOptions.d1Databases = d1Databases
    }
    if (Object.keys(kvNamespaces).length > 0) {
      miniflareOptions.kvNamespaces = kvNamespaces
    }
    if (Object.keys(r2Buckets).length > 0) {
      miniflareOptions.r2Buckets = r2Buckets
    }
    if (Object.keys(queueProducers).length > 0) {
      miniflareOptions.queueProducers = queueProducers
    }
    if (Object.keys(queueConsumers).length > 0) {
      miniflareOptions.queueConsumers = queueConsumers
    }
    if (Object.keys(durableObjects).length > 0) {
      miniflareOptions.durableObjects = durableObjects
    }

    this.mf = new Miniflare(miniflareOptions)

    // Wait for Miniflare to be ready
    const url = await this.mf.ready
    console.log(`⚡ Worker running at ${url}`)
  }

  async stop(): Promise<void> {
    if (this.mf) {
      await this.mf.dispose()
      this.mf = null
    }
  }

  // Binding accessors - use generic types for portability
  // Consumers can cast to @cloudflare/workers-types if needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getD1Database(bindingName: string): Promise<any> {
    this.ensureRunning()
    return this.mf!.getD1Database(bindingName)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getKVNamespace(bindingName: string): Promise<any> {
    this.ensureRunning()
    return this.mf!.getKVNamespace(bindingName)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getR2Bucket(bindingName: string): Promise<any> {
    this.ensureRunning()
    return this.mf!.getR2Bucket(bindingName)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getDurableObjectNamespace(bindingName: string): Promise<any> {
    this.ensureRunning()
    return this.mf!.getDurableObjectNamespace(bindingName)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getQueueProducer<T = unknown>(bindingName: string): Promise<any> {
    this.ensureRunning()
    return this.mf!.getQueueProducer<T>(bindingName)
  }

  async getAllBindings<T = Record<string, unknown>>(): Promise<T> {
    this.ensureRunning()
    return this.mf!.getBindings() as Promise<T>
  }

  // Getters
  getDiscoveredBindings(): DiscoveredBindings | null {
    return this.bindings
  }

  getConfig(): WranglerConfig | null {
    return this.config
  }

  getOptions(): Required<LocalFlareOptions> {
    return this.options
  }

  getMiniflare(): Miniflare | null {
    return this.mf
  }

  isRunning(): boolean {
    return this.mf !== null
  }

  // Set the worker log callback (must be called before start())
  setLogCallback(callback: WorkerLogCallback): void {
    this.options.onWorkerLog = callback
  }

  private ensureRunning(): void {
    if (!this.mf) {
      throw new Error('LocalFlare is not running. Call start() first.')
    }
  }
}
