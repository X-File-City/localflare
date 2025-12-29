import { cac } from 'cac'
import pc from 'picocolors'
import { LocalFlare, findWranglerConfig, WRANGLER_CONFIG_FILES } from 'localflare-core'
import { startDashboardServer } from 'localflare-server'
import { existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { createRequire } from 'node:module'

// Find the dashboard dist folder
function getDashboardPath(): string | undefined {
  try {
    const require = createRequire(import.meta.url)
    const dashboardPkg = require.resolve('localflare-dashboard/package.json')
    return join(dirname(dashboardPkg), 'dist')
  } catch {
    return undefined
  }
}

const cli = cac('localflare')

cli
  .command('[configPath]', 'Start LocalFlare development server')
  .option('-p, --port <port>', 'Worker port', { default: 8787 })
  .option('-d, --dashboard-port <port>', 'Dashboard port', { default: 8788 })
  .option('--persist <path>', 'Persistence directory', { default: '.localflare' })
  .option('-v, --verbose', 'Verbose output')
  .action(async (configPath: string | undefined, options) => {
    console.log('')
    console.log(pc.bold(pc.cyan('  ⚡ LocalFlare')))
    console.log(pc.dim('  Local Cloudflare Development Dashboard'))
    console.log('')

    let resolvedConfig: string

    if (configPath) {
      // User specified a config path
      resolvedConfig = resolve(configPath)
      if (!existsSync(resolvedConfig)) {
        console.log(pc.red(`  ✗ Could not find ${configPath}`))
        console.log(pc.dim(`    Make sure the file exists.`))
        console.log('')
        process.exit(1)
      }
    } else {
      // Auto-detect wrangler config file
      const detectedConfig = findWranglerConfig(process.cwd())
      if (!detectedConfig) {
        console.log(pc.red(`  ✗ Could not find wrangler config file`))
        console.log(pc.dim(`    Looking for: ${WRANGLER_CONFIG_FILES.join(', ')}`))
        console.log(pc.dim(`    Make sure you're in a Cloudflare Worker project directory.`))
        console.log('')
        process.exit(1)
      }
      resolvedConfig = detectedConfig
    }

    console.log(pc.dim(`  Config: ${resolvedConfig}`))
    console.log('')

    try {
      // Initialize LocalFlare
      const localflare = new LocalFlare({
        configPath: resolvedConfig,
        port: Number(options.port),
        dashboardPort: Number(options.dashboardPort),
        persistPath: options.persist,
        verbose: options.verbose,
      })

      // Start the worker
      await localflare.start()

      // Start the dashboard server
      const dashboardPath = getDashboardPath()
      await startDashboardServer({
        localflare,
        port: Number(options.dashboardPort),
        staticPath: dashboardPath,
      })

      console.log('')
      console.log(pc.green('  ✓ LocalFlare is running!'))
      console.log('')
      console.log(`  ${pc.dim('Worker:')}     ${pc.cyan(`http://localhost:${options.port}`)}`)
      console.log(`  ${pc.dim('Dashboard:')}  ${pc.cyan(`http://localhost:${options.dashboardPort}`)}`)
      console.log('')
      console.log(pc.dim('  Press Ctrl+C to stop'))
      console.log('')

      // Handle shutdown
      const shutdown = async () => {
        console.log('')
        console.log(pc.dim('  Shutting down...'))
        await localflare.stop()
        process.exit(0)
      }

      process.on('SIGINT', shutdown)
      process.on('SIGTERM', shutdown)

    } catch (error) {
      console.log(pc.red(`  ✗ Failed to start LocalFlare`))
      console.log(pc.dim(`    ${error}`))
      console.log('')
      process.exit(1)
    }
  })

cli.help()
cli.version('0.0.1')

cli.parse()
