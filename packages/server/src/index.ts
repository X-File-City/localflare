import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serve } from '@hono/node-server'
import type { LocalFlare } from 'localflare-core'

import { createD1Routes } from './routes/d1.js'
import { createKVRoutes } from './routes/kv.js'
import { createR2Routes } from './routes/r2.js'
import { createQueueRoutes } from './routes/queues.js'
import { createDurableObjectRoutes } from './routes/do.js'
import { createBindingsRoutes } from './routes/bindings.js'
import { createLogsRoutes } from './routes/logs.js'

export interface DashboardServerOptions {
  localflare: LocalFlare
  port?: number
  staticPath?: string
}

export function createDashboardApp(localflare: LocalFlare) {
  const app = new Hono()

  // Middleware
  app.use('*', cors())
  app.use('*', logger())

  // Health check
  app.get('/api/health', (c) => {
    return c.json({
      status: 'ok',
      running: localflare.isRunning(),
    })
  })

  // Mount API routes
  app.route('/api/bindings', createBindingsRoutes(localflare))
  app.route('/api/d1', createD1Routes(localflare))
  app.route('/api/kv', createKVRoutes(localflare))
  app.route('/api/r2', createR2Routes(localflare))
  app.route('/api/queues', createQueueRoutes(localflare))
  app.route('/api/do', createDurableObjectRoutes(localflare))
  app.route('/api/logs', createLogsRoutes(localflare))

  return app
}

export async function startDashboardServer(options: DashboardServerOptions): Promise<void> {
  const { localflare, port = 8788 } = options

  const app = createDashboardApp(localflare)

  // Serve static files for dashboard UI (if path provided)
  if (options.staticPath) {
    const { serveStatic } = await import('@hono/node-server/serve-static')
    app.use('/*', serveStatic({ root: options.staticPath }))
  }

  serve(
    {
      fetch: app.fetch,
      port,
    },
    (info) => {
      console.log(`📊 Dashboard running at http://localhost:${info.port}`)
    }
  )
}

export { createD1Routes } from './routes/d1.js'
export { createKVRoutes } from './routes/kv.js'
export { createR2Routes } from './routes/r2.js'
export { createQueueRoutes } from './routes/queues.js'
export { createDurableObjectRoutes } from './routes/do.js'
export { createBindingsRoutes } from './routes/bindings.js'
export { createLogsRoutes, addLog, type LogEntry } from './routes/logs.js'
