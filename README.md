# Localflare

Local development dashboard for Cloudflare Workers. Visualize and interact with your D1 databases, KV namespaces, R2 buckets, Durable Objects, and Queues - all locally.

## Features

- **D1 Database Explorer** - Browse tables, run SQL queries, edit data
- **KV Browser** - View, edit, and delete key-value pairs
- **R2 File Manager** - Upload, download, and manage objects
- **Queue Inspector** - Send test messages to queues
- **Durable Objects** - View and interact with DO instances
- **Zero Config** - Reads your `wrangler.toml` automatically

## Installation

```bash
npm install -g localflare
# or
pnpm add -g localflare
# or
npx localflare
```

## Usage

Navigate to your Cloudflare Worker project directory and run:

```bash
localflare
```

This will:
1. Read your `wrangler.toml` configuration
2. Start your Worker on `http://localhost:8787`
3. Start the dashboard on `http://localhost:8788`

### Options

```bash
localflare [configPath] [options]

Options:
  -p, --port <port>           Worker port (default: 8787)
  -d, --dashboard-port <port> Dashboard port (default: 8788)
  --persist <path>            Persistence directory (default: .localflare)
  -v, --verbose               Verbose output
  -h, --help                  Display help
  --version                   Display version
```

### Example

```bash
# Use default settings
localflare

# Custom ports
localflare -p 3000 -d 3001

# With custom config path
localflare ./custom/wrangler.toml
```

## Architecture

Localflare uses [Miniflare](https://miniflare.dev) under the hood to run your Worker locally. This ensures 100% compatibility with the Cloudflare runtime.

```
┌────────────────────────────────────────────────────┐
│              Localflare (single process)           │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │              Miniflare Runtime                │  │
│  │  ┌────────┐  ┌────────┐  ┌────────┐          │  │
│  │  │   D1   │  │   KV   │  │   R2   │  ...     │  │
│  │  └────────┘  └────────┘  └────────┘          │  │
│  └──────────────────────────────────────────────┘  │
│                        │                           │
│         ┌──────────────┴──────────────┐            │
│         │       Shared Bindings       │            │
│         └──────────────┬──────────────┘            │
│                        │                           │
│  ┌─────────────────────┴─────────────────────┐     │
│  │                                           │     │
│  │  ┌─────────────────┐  ┌─────────────┐     │     │
│  │  │   Your Worker   │  │  Dashboard  │     │     │
│  │  │     :8787       │  │    :8788    │     │     │
│  │  └─────────────────┘  └─────────────┘     │     │
│  │                                           │     │
│  └───────────────────────────────────────────┘     │
└────────────────────────────────────────────────────┘
```

## Packages

| Package | Description |
|---------|-------------|
| `localflare` | CLI tool |
| `localflare-core` | Miniflare wrapper and config parser |
| `localflare-server` | Dashboard API server |
| `localflare-dashboard` | React dashboard UI |

## Development

```bash
# Clone the repo
git clone https://github.com/rohanprasadofficial/localflare
cd localflare

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run the playground
cd playground
pnpm dev
```

## Supported Bindings

| Binding | Support | Dashboard Features |
|---------|---------|-------------------|
| D1 | ✅ Full | SQL editor, table browser, data CRUD |
| KV | ✅ Full | Key browser, value editor, bulk operations |
| R2 | ✅ Full | File browser, upload/download, metadata |
| Durable Objects | ✅ Full | Instance listing, state inspection |
| Queues | ✅ Full | Message viewer, send test messages |
| Service Bindings | ✅ Full | - |
| Cache API | ✅ Full | Cache viewer |
| Hyperdrive | ✅ Full | Connection status |
| Vectorize | ⚠️ Limited | Basic operations |
| Workers AI | ⚠️ Mock | Mock responses |

## Sponsorship

If you find Localflare useful, please consider supporting its development:

[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-pink)](https://github.com/sponsors/rohanprasadofficial)

Your sponsorship helps with:
- Continued development and maintenance
- New features and binding support
- Documentation improvements
- Community support

**[Become a Sponsor](https://github.com/sponsors/rohanprasadofficial)**

## Links

- [Documentation](https://localflare.dev/docs)
- [GitHub](https://github.com/rohanprasadofficial/localflare)
- [npm](https://www.npmjs.com/package/localflare)
- [Twitter](https://x.com/rohanpdofficial)

## License

MIT
