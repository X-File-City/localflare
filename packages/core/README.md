# localflare-core

Core Miniflare wrapper and configuration parser for [Localflare](https://www.npmjs.com/package/localflare).

[![npm version](https://img.shields.io/npm/v/localflare-core.svg)](https://www.npmjs.com/package/localflare-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

This package provides the core functionality for Localflare:

- **Miniflare Integration** - Wraps Miniflare to provide a consistent API for running Cloudflare Workers locally
- **Config Parser** - Reads and parses `wrangler.toml` configuration files
- **Bindings Support** - Full support for D1, KV, R2, Durable Objects, Queues, and more

## Installation

```bash
npm install localflare-core
# or
pnpm add localflare-core
```

## Usage

```typescript
import { LocalFlareCore } from 'localflare-core';

const core = new LocalFlareCore({
  configPath: './wrangler.toml',
  port: 8787,
  persist: '.localflare'
});

// Start the worker
await core.start();

// Access bindings programmatically
const bindings = core.getBindings();

// Get D1 databases
const d1Databases = bindings.d1;

// Get KV namespaces
const kvNamespaces = bindings.kv;

// Stop when done
await core.stop();
```

## Supported Bindings

| Binding | Support |
|---------|---------|
| D1 | ✅ Full |
| KV | ✅ Full |
| R2 | ✅ Full |
| Durable Objects | ✅ Full |
| Queues | ✅ Full |
| Service Bindings | ✅ Full |
| Cache API | ✅ Full |
| Hyperdrive | ✅ Full |
| Vectorize | ⚠️ Limited |
| Workers AI | ⚠️ Mock |

## Related Packages

| Package | Description |
|---------|-------------|
| [`localflare`](https://www.npmjs.com/package/localflare) | CLI tool (main package) |
| [`localflare-server`](https://www.npmjs.com/package/localflare-server) | Dashboard API server |
| [`localflare-dashboard`](https://www.npmjs.com/package/localflare-dashboard) | React dashboard UI |

## License

MIT
