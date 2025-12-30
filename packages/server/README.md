# localflare-server

Dashboard API server for [Localflare](https://www.npmjs.com/package/localflare). Provides a Hono-based REST API for interacting with Cloudflare Worker bindings.

[![npm version](https://img.shields.io/npm/v/localflare-server.svg)](https://www.npmjs.com/package/localflare-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

This package provides the API server that powers the Localflare dashboard:

- **REST API** - Full CRUD operations for all Cloudflare bindings
- **Hono Framework** - Fast, lightweight HTTP server
- **Real-time Updates** - WebSocket support for live data streaming

## Installation

```bash
npm install localflare-server
# or
pnpm add localflare-server
```

## Usage

```typescript
import { createDashboardServer } from 'localflare-server';
import { LocalFlareCore } from 'localflare-core';

const core = new LocalFlareCore({ configPath: './wrangler.toml' });
await core.start();

const server = createDashboardServer({
  core,
  port: 8788
});

await server.start();
```

## API Endpoints

### D1 Database
- `GET /api/d1` - List all D1 databases
- `GET /api/d1/:name/tables` - List tables in a database
- `POST /api/d1/:name/query` - Execute SQL query

### KV Namespace
- `GET /api/kv` - List all KV namespaces
- `GET /api/kv/:name/keys` - List keys in a namespace
- `GET /api/kv/:name/:key` - Get a value
- `PUT /api/kv/:name/:key` - Set a value
- `DELETE /api/kv/:name/:key` - Delete a key

### R2 Bucket
- `GET /api/r2` - List all R2 buckets
- `GET /api/r2/:name/objects` - List objects in a bucket
- `GET /api/r2/:name/:key` - Get an object
- `PUT /api/r2/:name/:key` - Upload an object
- `DELETE /api/r2/:name/:key` - Delete an object

### Queues
- `GET /api/queues` - List all queues
- `POST /api/queues/:name/send` - Send a message to a queue

### Durable Objects
- `GET /api/do` - List Durable Object namespaces
- `GET /api/do/:namespace/instances` - List instances

## Related Packages

| Package | Description |
|---------|-------------|
| [`localflare`](https://www.npmjs.com/package/localflare) | CLI tool (main package) |
| [`localflare-core`](https://www.npmjs.com/package/localflare-core) | Miniflare wrapper and config parser |
| [`localflare-dashboard`](https://www.npmjs.com/package/localflare-dashboard) | React dashboard UI |

## License

MIT
