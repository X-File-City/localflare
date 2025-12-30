# localflare-dashboard

React dashboard UI for [Localflare](https://www.npmjs.com/package/localflare). A modern, feature-rich interface for managing Cloudflare Worker bindings locally.

[![npm version](https://img.shields.io/npm/v/localflare-dashboard.svg)](https://www.npmjs.com/package/localflare-dashboard)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

This package provides the web-based dashboard UI for Localflare:

- **Modern React** - Built with React 19 and TypeScript
- **Beautiful UI** - Tailwind CSS 4 with Radix UI components
- **Feature Rich** - Full management interface for all Cloudflare bindings

## Features

### D1 Database Explorer
- Browse tables and schemas
- Run SQL queries with syntax highlighting
- Edit, insert, and delete rows
- Export query results

### KV Browser
- View all key-value pairs
- Edit values with JSON support
- Bulk delete operations
- Search and filter keys

### R2 File Manager
- Browse objects in buckets
- Upload and download files
- View object metadata
- Delete objects

### Queue Inspector
- View queue messages
- Send test messages
- Monitor queue activity

### Durable Objects
- List all DO namespaces
- View active instances
- Inspect instance state

## Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety
- **Tailwind CSS 4** - Modern utility-first CSS
- **Radix UI** - Accessible component primitives
- **TanStack Query** - Powerful data fetching
- **TanStack Table** - Flexible table component
- **Vite** - Fast build tooling

## Related Packages

| Package | Description |
|---------|-------------|
| [`localflare`](https://www.npmjs.com/package/localflare) | CLI tool (main package) |
| [`localflare-core`](https://www.npmjs.com/package/localflare-core) | Miniflare wrapper and config parser |
| [`localflare-server`](https://www.npmjs.com/package/localflare-server) | Dashboard API server |

## License

MIT
