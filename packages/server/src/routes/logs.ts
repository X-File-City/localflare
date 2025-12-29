import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import type { LocalFlare } from 'localflare-core'

export interface LogEntry {
  id: string
  timestamp: string
  level: 'log' | 'info' | 'warn' | 'error' | 'debug'
  source: 'worker' | 'queue' | 'do' | 'system'
  message: string
  data?: unknown
}

// In-memory log buffer (circular buffer, keeps last N logs)
const MAX_LOGS = 1000
const logBuffer: LogEntry[] = []
const logListeners: Set<(log: LogEntry) => void> = new Set()

// Add a log entry
export function addLog(entry: Omit<LogEntry, 'id' | 'timestamp'>): void {
  const logEntry: LogEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  }

  logBuffer.push(logEntry)

  // Keep buffer size limited
  while (logBuffer.length > MAX_LOGS) {
    logBuffer.shift()
  }

  // Notify all listeners
  logListeners.forEach(listener => listener(logEntry))
}

// Subscribe to new logs
function subscribeToLogs(listener: (log: LogEntry) => void): () => void {
  logListeners.add(listener)
  return () => logListeners.delete(listener)
}

// Get recent logs
function getRecentLogs(limit = 100): LogEntry[] {
  return logBuffer.slice(-limit)
}

// Clear logs
function clearLogs(): void {
  logBuffer.length = 0
}

// Intercept console methods to capture worker logs
let consoleIntercepted = false

export function interceptConsole(): void {
  if (consoleIntercepted) return
  consoleIntercepted = true

  const originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
  }

  const createInterceptor = (level: LogEntry['level'], original: typeof console.log) => {
    return (...args: unknown[]) => {
      // Call original
      original.apply(console, args)

      // Skip our own logging to prevent infinite loops
      const message = args.map(arg =>
        typeof arg === 'string' ? arg : JSON.stringify(arg)
      ).join(' ')

      // Skip internal logging (dashboard server logs, etc)
      if (message.includes('📊') || message.includes('⚡') || message.includes('-->') || message.includes('<--')) {
        return
      }

      // Determine source based on message content
      let source: LogEntry['source'] = 'worker'
      if (message.toLowerCase().includes('queue') || message.toLowerCase().includes('processing')) {
        source = 'queue'
      } else if (message.toLowerCase().includes('durable') || message.toLowerCase().includes('do')) {
        source = 'do'
      }

      addLog({
        level,
        source,
        message,
        data: args.length > 1 ? args.slice(1) : undefined,
      })
    }
  }

  console.log = createInterceptor('log', originalConsole.log)
  console.info = createInterceptor('info', originalConsole.info)
  console.warn = createInterceptor('warn', originalConsole.warn)
  console.error = createInterceptor('error', originalConsole.error)
  console.debug = createInterceptor('debug', originalConsole.debug)
}

export function createLogsRoutes(localflare: LocalFlare) {
  const app = new Hono()

  // Start intercepting console on route creation
  interceptConsole()

  // Register callback with LocalFlare to capture worker logs
  localflare.setLogCallback((entry) => {
    addLog({
      level: entry.level,
      source: 'worker',
      message: entry.message,
    })
  })

  // Add initial system log
  addLog({
    level: 'info',
    source: 'system',
    message: 'Tail logs initialized',
  })

  // Get recent logs
  app.get('/', (c) => {
    const limit = parseInt(c.req.query('limit') || '100')
    return c.json({
      logs: getRecentLogs(limit),
    })
  })

  // Stream logs via SSE
  app.get('/stream', (c) => {
    return streamSSE(c, async (stream) => {
      // Send recent logs first
      const recentLogs = getRecentLogs(50)
      for (const log of recentLogs) {
        await stream.writeSSE({
          data: JSON.stringify(log),
          event: 'log',
          id: log.id,
        })
      }

      // Subscribe to new logs
      const unsubscribe = subscribeToLogs(async (log) => {
        try {
          await stream.writeSSE({
            data: JSON.stringify(log),
            event: 'log',
            id: log.id,
          })
        } catch {
          // Client disconnected
          unsubscribe()
        }
      })

      // Keep connection alive with heartbeat
      const heartbeat = setInterval(async () => {
        try {
          await stream.writeSSE({
            data: '',
            event: 'heartbeat',
          })
        } catch {
          clearInterval(heartbeat)
          unsubscribe()
        }
      }, 30000)

      // Wait for client disconnect
      await new Promise(() => {
        // This promise never resolves - we wait until the client disconnects
        // The stream will be closed when the client disconnects
      })
    })
  })

  // Clear logs
  app.delete('/', (c) => {
    clearLogs()
    addLog({
      level: 'info',
      source: 'system',
      message: 'Logs cleared',
    })
    return c.json({ success: true })
  })

  // Manual log entry (for testing or external sources)
  app.post('/', async (c) => {
    const body = await c.req.json<{
      level?: LogEntry['level']
      source?: LogEntry['source']
      message: string
      data?: unknown
    }>()

    addLog({
      level: body.level ?? 'log',
      source: body.source ?? 'worker',
      message: body.message,
      data: body.data,
    })

    return c.json({ success: true })
  })

  return app
}
