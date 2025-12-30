import { cn } from '@/lib/utils';

// Minimal reusable components
function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6">
      {children}
    </section>
  );
}

function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="mb-6 text-2xl font-semibold tracking-tight text-zinc-900">{children}</h1>;
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 mt-10 text-lg font-medium text-zinc-800 first:mt-0">{children}</h2>;
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2 mt-6 text-sm font-medium text-zinc-700">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-sm leading-relaxed text-zinc-700">{children}</p>;
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-white/80 border border-zinc-200 px-1.5 py-0.5 font-mono text-xs text-zinc-800">
      {children}
    </code>
  );
}

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="mb-6">
      {title && (
        <div className="mb-1 text-[10px] uppercase tracking-wider text-zinc-500">{title}</div>
      )}
      <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-xs leading-relaxed text-zinc-300">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="mb-6 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="pb-2 pr-6 text-left text-xs font-medium text-zinc-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-zinc-700">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="py-1.5 pr-6 text-xs">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function List({ items }: { items: (string | React.ReactNode)[] }) {
  return (
    <ul className="mb-4 space-y-1 text-sm text-zinc-700">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-zinc-500">-</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Callout({ type = 'info', children }: { type?: 'info' | 'warning' | 'tip'; children: React.ReactNode }) {
  return (
    <div className={cn(
      'mb-6 rounded-lg border px-4 py-3 text-sm',
      type === 'info' && 'bg-white/60 border-zinc-200 text-zinc-700',
      type === 'warning' && 'bg-amber-50 border-amber-200 text-amber-800',
      type === 'tip' && 'bg-orange-50 border-orange-200 text-orange-800'
    )}>
      {children}
    </div>
  );
}

function Steps({ items }: { items: { title: string; content: React.ReactNode }[] }) {
  return (
    <div className="mb-6 space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-3">
          <span className="text-xs font-semibold text-zinc-600">{i + 1}.</span>
          <div className="flex-1">
            <div className="text-sm font-medium text-zinc-800">{item.title}</div>
            <div className="mt-0.5 text-xs text-zinc-600">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Content sections
export function WikiContent({ activeSection }: { activeSection: string }) {
  const sections: Record<string, React.ReactNode> = {
    // Getting Started
    'getting-started': <GettingStartedSection />,
    'installation': <InstallationSection />,
    'quick-start': <QuickStartSection />,
    'configuration': <ConfigurationSection />,

    // D1 Database
    'd1': <D1Section />,
    'd1-overview': <D1OverviewSection />,
    'd1-sql-editor': <D1SqlEditorSection />,
    'd1-table-browser': <D1TableBrowserSection />,
    'd1-data-editing': <D1DataEditingSection />,

    // KV Storage
    'kv': <KVSection />,
    'kv-overview': <KVOverviewSection />,
    'kv-browser': <KVBrowserSection />,
    'kv-operations': <KVOperationsSection />,

    // R2 Buckets
    'r2': <R2Section />,
    'r2-overview': <R2OverviewSection />,
    'r2-file-manager': <R2FileManagerSection />,
    'r2-uploads': <R2UploadsSection />,

    // Durable Objects
    'durable-objects': <DurableObjectsSection />,
    'do-overview': <DOOverviewSection />,
    'do-instances': <DOInstancesSection />,
    'do-state': <DOStateSection />,

    // Queues
    'queues': <QueuesSection />,
    'queues-overview': <QueuesOverviewSection />,
    'queues-messages': <QueuesMessagesSection />,
    'queues-testing': <QueuesTestingSection />,

    // CLI Reference
    'cli': <CLISection />,
    'cli-commands': <CLICommandsSection />,
    'cli-options': <CLIOptionsSection />,
    'cli-examples': <CLIExamplesSection />,

    // Advanced
    'advanced': <AdvancedSection />,
    'architecture': <ArchitectureSection />,
    'bindings': <BindingsSection />,
    'persistence': <PersistenceSection />,

    // Troubleshooting
    'troubleshooting': <TroubleshootingSection />,
    'common-issues': <CommonIssuesSection />,
    'faq': <FAQSection />,
  };

  return (
    <article className="prose prose-sm prose-invert max-w-none">
      {sections[activeSection] || <GettingStartedSection />}
    </article>
  );
}

// ============================================
// Getting Started Sections
// ============================================

function GettingStartedSection() {
  return (
    <Section id="getting-started">
      <H1>Getting Started with Localflare</H1>
      <P>
        Localflare is a local development dashboard for Cloudflare Workers. Visualize and interact
        with your D1 databases, KV namespaces, R2 buckets, Durable Objects, and Queues—all locally.
      </P>
      <H3>What you can do</H3>
      <List items={[
        'Browse and edit D1 database tables with a full SQL editor',
        'View, edit, and delete KV key-value pairs',
        'Upload, download, and manage R2 objects',
        'Inspect Durable Object instances and their state',
        'Send test messages to Queues and monitor processing',
        'Zero configuration—reads your wrangler.toml automatically',
      ]} />
      <Callout type="tip">
        Localflare uses Miniflare under the hood, ensuring 100% compatibility with the Cloudflare runtime.
      </Callout>
    </Section>
  );
}

function InstallationSection() {
  return (
    <Section id="installation">
      <H1>Installation</H1>
      <P>You can install Localflare globally or use npx to run it directly.</P>

      <H2>Global Installation</H2>
      <CodeBlock title="Terminal">{`# Using npm
npm install -g localflare

# Using pnpm
pnpm add -g localflare

# Using yarn
yarn global add localflare`}</CodeBlock>

      <H2>Using npx (No Installation)</H2>
      <CodeBlock title="Terminal">{`npx localflare`}</CodeBlock>

      <Callout type="info">
        Using <Code>npx</Code> is recommended for one-off usage or to always use the latest version.
      </Callout>

      <H2>Requirements</H2>
      <Table
        headers={['Requirement', 'Version']}
        rows={[
          ['Node.js', '18.0.0 or higher'],
          ['npm/pnpm/yarn', 'Latest version recommended'],
        ]}
      />
    </Section>
  );
}

function QuickStartSection() {
  return (
    <Section id="quick-start">
      <H1>Quick Start</H1>
      <P>Get up and running in seconds with these simple steps.</P>

      <Steps items={[
        {
          title: 'Navigate to your Worker project',
          content: 'Go to the directory containing your wrangler.toml file'
        },
        {
          title: 'Run Localflare',
          content: <Code>npx localflare</Code>
        },
        {
          title: 'Open the dashboard',
          content: 'Visit http://localhost:8788 in your browser'
        },
      ]} />

      <CodeBlock title="Terminal">{`cd my-worker-project
npx localflare

# Output:
# ● Reading wrangler.toml...
# ✓ Found 2 D1 databases, 3 KV namespaces, 1 R2 bucket
# ✓ Worker running at http://localhost:8787
# ✓ Dashboard at http://localhost:8788`}</CodeBlock>

      <Callout type="tip">
        Localflare automatically detects all bindings from your <Code>wrangler.toml</Code> file.
      </Callout>

      <H2>Existing Projects</H2>
      <P>
        If you have an existing project with data from <Code>wrangler dev</Code>, use the <Code>--persist</Code> flag
        to preserve your data:
      </P>
      <CodeBlock title="Terminal">{`npx localflare --persist .wrangler/state/v3`}</CodeBlock>
    </Section>
  );
}

function ConfigurationSection() {
  return (
    <Section id="configuration">
      <H1>Configuration</H1>
      <P>
        Localflare reads your <Code>wrangler.toml</Code> automatically. No additional configuration
        is required in most cases.
      </P>

      <H2>Custom Config Path</H2>
      <P>If your config file is in a different location:</P>
      <CodeBlock title="Terminal">{`localflare ./path/to/wrangler.toml`}</CodeBlock>

      <H2>Port Configuration</H2>
      <P>Change the default ports using CLI options:</P>
      <CodeBlock title="Terminal">{`# Custom worker port
localflare -p 3000

# Custom dashboard port
localflare -d 3001

# Both custom ports
localflare -p 3000 -d 3001`}</CodeBlock>

      <H2>Data Persistence</H2>
      <P>By default, Localflare persists data to <Code>.localflare/</Code> in your project directory.</P>
      <CodeBlock title="Terminal">{`# Custom persistence directory
localflare --persist ./my-data`}</CodeBlock>

      <H3>Existing Projects</H3>
      <P>
        If you have an existing project using <Code>wrangler dev</Code>, use the <Code>--persist</Code> flag
        to point to your existing Wrangler data:
      </P>
      <CodeBlock title="Terminal">{`# Use existing Wrangler data
localflare --persist .wrangler/state/v3`}</CodeBlock>
      <Callout type="info">
        Both Localflare and Wrangler use Miniflare under the hood, so storage formats are compatible.
        Your existing KV, D1, R2, and Durable Object data will work seamlessly.
      </Callout>
    </Section>
  );
}

// ============================================
// D1 Database Sections
// ============================================

function D1Section() {
  return (
    <Section id="d1">
      <H1>D1 Database</H1>
      <P>
        Localflare provides a full-featured interface for working with D1 databases locally.
        Browse tables, run SQL queries, and edit data with ease.
      </P>
      <List items={[
        'SQL editor with syntax highlighting',
        'Table browser with column information',
        'Inline data editing and CRUD operations',
        'Query history and saved queries',
      ]} />
    </Section>
  );
}

function D1OverviewSection() {
  return (
    <Section id="d1-overview">
      <H1>D1 Overview</H1>
      <P>
        D1 is Cloudflare's native serverless SQL database. Localflare provides a visual interface
        to interact with your D1 databases during local development.
      </P>

      <H2>Features</H2>
      <Table
        headers={['Feature', 'Description']}
        rows={[
          ['SQL Editor', 'Write and execute SQL queries with syntax highlighting'],
          ['Table Browser', 'View all tables, columns, and row counts'],
          ['Data Editing', 'Insert, update, and delete rows inline'],
          ['Schema Viewer', 'Inspect table schemas and indexes'],
          ['Export', 'Export query results as CSV or JSON'],
        ]}
      />

      <H2>Binding Configuration</H2>
      <P>Your D1 databases are configured in <Code>wrangler.toml</Code>:</P>
      <CodeBlock title="wrangler.toml">{`[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "xxxx-xxxx-xxxx-xxxx"`}</CodeBlock>
    </Section>
  );
}

function D1SqlEditorSection() {
  return (
    <Section id="d1-sql-editor">
      <H1>SQL Editor</H1>
      <P>
        The SQL editor provides a powerful interface for writing and executing queries against
        your D1 databases.
      </P>

      <H2>Features</H2>
      <List items={[
        'Syntax highlighting for SQL',
        'Auto-completion for table and column names',
        'Query history with quick access to previous queries',
        'Multiple result tabs for comparison',
        'Export results to CSV or JSON',
      ]} />

      <H2>Keyboard Shortcuts</H2>
      <Table
        headers={['Shortcut', 'Action']}
        rows={[
          ['Cmd/Ctrl + Enter', 'Execute query'],
          ['Cmd/Ctrl + S', 'Save query'],
          ['Cmd/Ctrl + /','Toggle comment'],
        ]}
      />

      <H2>Example Queries</H2>
      <CodeBlock title="SQL">{`-- List all tables
SELECT name FROM sqlite_master WHERE type='table';

-- Query with pagination
SELECT * FROM users LIMIT 10 OFFSET 0;

-- Join example
SELECT u.name, o.total
FROM users u
JOIN orders o ON u.id = o.user_id;`}</CodeBlock>
    </Section>
  );
}

function D1TableBrowserSection() {
  return (
    <Section id="d1-table-browser">
      <H1>Table Browser</H1>
      <P>
        The table browser provides a visual overview of your database structure and data.
      </P>

      <H2>Table List</H2>
      <P>View all tables in your database with:</P>
      <List items={[
        'Table name and row count',
        'Column names and types',
        'Primary key indicators',
        'Quick actions (view data, edit schema)',
      ]} />

      <H2>Column Information</H2>
      <Table
        headers={['Property', 'Description']}
        rows={[
          ['Name', 'Column identifier'],
          ['Type', 'SQLite data type (TEXT, INTEGER, REAL, BLOB)'],
          ['Nullable', 'Whether NULL values are allowed'],
          ['Default', 'Default value if any'],
          ['Primary Key', 'Part of primary key'],
        ]}
      />
    </Section>
  );
}

function D1DataEditingSection() {
  return (
    <Section id="d1-data-editing">
      <H1>Data Editing</H1>
      <P>
        Edit your D1 data directly in the dashboard without writing SQL queries.
      </P>

      <H2>Inline Editing</H2>
      <Steps items={[
        { title: 'Click on a cell', content: 'The cell becomes editable' },
        { title: 'Make your changes', content: 'Edit the value directly' },
        { title: 'Press Enter or click away', content: 'Changes are saved automatically' },
      ]} />

      <H2>Adding Rows</H2>
      <P>Click the "Add Row" button to insert a new record. Fill in the values and save.</P>

      <H2>Deleting Rows</H2>
      <P>Select rows using the checkbox and click "Delete Selected" to remove them.</P>

      <Callout type="warning">
        Deletions are permanent. Make sure you have backups of important data.
      </Callout>
    </Section>
  );
}

// ============================================
// KV Storage Sections
// ============================================

function KVSection() {
  return (
    <Section id="kv">
      <H1>KV Storage</H1>
      <P>
        Browse, edit, and manage your KV namespaces with Localflare's KV browser.
      </P>
    </Section>
  );
}

function KVOverviewSection() {
  return (
    <Section id="kv-overview">
      <H1>KV Overview</H1>
      <P>
        Workers KV is a global, low-latency key-value data store. Localflare provides a visual
        interface for managing your KV data during development.
      </P>

      <H2>Features</H2>
      <List items={[
        'Browse all keys in a namespace',
        'View and edit values (text, JSON, binary)',
        'Set expiration (TTL) on keys',
        'Bulk delete operations',
        'Search and filter keys',
      ]} />

      <H2>Binding Configuration</H2>
      <CodeBlock title="wrangler.toml">{`[[kv_namespaces]]
binding = "MY_KV"
id = "xxxx-xxxx-xxxx-xxxx"`}</CodeBlock>
    </Section>
  );
}

function KVBrowserSection() {
  return (
    <Section id="kv-browser">
      <H1>Key Browser</H1>
      <P>
        The key browser shows all keys in your KV namespace with their values and metadata.
      </P>

      <H2>Key List</H2>
      <Table
        headers={['Column', 'Description']}
        rows={[
          ['Key', 'The unique identifier for the value'],
          ['Value Preview', 'First 100 characters of the value'],
          ['Expiration', 'TTL if set, or "Never"'],
          ['Metadata', 'Custom metadata attached to the key'],
        ]}
      />

      <H2>Searching Keys</H2>
      <P>Use the search box to filter keys by prefix. KV uses prefix matching, so searching for
      "user:" will find "user:123", "user:456", etc.</P>
    </Section>
  );
}

function KVOperationsSection() {
  return (
    <Section id="kv-operations">
      <H1>KV Operations</H1>

      <H2>Create Key</H2>
      <Steps items={[
        { title: 'Click "Add Key"', content: 'Opens the create dialog' },
        { title: 'Enter key name', content: 'Must be unique in the namespace' },
        { title: 'Enter value', content: 'Text, JSON, or upload a file' },
        { title: 'Set expiration (optional)', content: 'TTL in seconds' },
        { title: 'Click Save', content: 'Key is created' },
      ]} />

      <H2>Edit Key</H2>
      <P>Click on a key to open the editor. Make changes and save.</P>

      <H2>Delete Keys</H2>
      <P>Select keys with checkboxes and click "Delete Selected", or click the delete icon on individual keys.</P>

      <Callout type="tip">
        You can store JSON objects as values. The editor will format and validate JSON automatically.
      </Callout>
    </Section>
  );
}

// ============================================
// R2 Buckets Sections
// ============================================

function R2Section() {
  return (
    <Section id="r2">
      <H1>R2 Buckets</H1>
      <P>
        Manage your R2 object storage with Localflare's file manager interface.
      </P>
    </Section>
  );
}

function R2OverviewSection() {
  return (
    <Section id="r2-overview">
      <H1>R2 Overview</H1>
      <P>
        R2 is Cloudflare's object storage service, compatible with the S3 API. Localflare provides
        a visual file manager for working with R2 buckets locally.
      </P>

      <H2>Features</H2>
      <List items={[
        'File browser with folder navigation',
        'Upload files with drag-and-drop',
        'Download files directly',
        'Preview images and text files',
        'View and edit object metadata',
      ]} />

      <H2>Binding Configuration</H2>
      <CodeBlock title="wrangler.toml">{`[[r2_buckets]]
binding = "MY_BUCKET"
bucket_name = "my-bucket"`}</CodeBlock>
    </Section>
  );
}

function R2FileManagerSection() {
  return (
    <Section id="r2-file-manager">
      <H1>File Manager</H1>
      <P>
        Navigate your R2 bucket like a file system with the visual file manager.
      </P>

      <H2>Navigation</H2>
      <List items={[
        'Click folders to navigate into them',
        'Use breadcrumbs to go back',
        'Search for files by name',
        'Sort by name, size, or modified date',
      ]} />

      <H2>File Preview</H2>
      <P>Click on a file to preview its contents:</P>
      <List items={[
        'Images: Visual preview',
        'Text/JSON/Code: Syntax-highlighted view',
        'Other: Download option',
      ]} />
    </Section>
  );
}

function R2UploadsSection() {
  return (
    <Section id="r2-uploads">
      <H1>Uploads & Downloads</H1>

      <H2>Uploading Files</H2>
      <List items={[
        'Drag and drop files onto the file manager',
        'Click "Upload" button to select files',
        'Upload multiple files at once',
        'Create folders to organize files',
      ]} />

      <H2>Downloading Files</H2>
      <P>Click the download icon on any file to download it to your computer.</P>

      <H2>Bulk Operations</H2>
      <P>Select multiple files with checkboxes to:</P>
      <List items={[
        'Download as ZIP',
        'Delete multiple files',
        'Move to another folder',
      ]} />
    </Section>
  );
}

// ============================================
// Durable Objects Sections
// ============================================

function DurableObjectsSection() {
  return (
    <Section id="durable-objects">
      <H1>Durable Objects</H1>
      <P>
        Inspect and interact with your Durable Object instances in Localflare.
      </P>
    </Section>
  );
}

function DOOverviewSection() {
  return (
    <Section id="do-overview">
      <H1>Durable Objects Overview</H1>
      <P>
        Durable Objects provide strongly consistent storage and coordination for your Workers.
        Localflare lets you inspect active instances and their state.
      </P>

      <H2>Features</H2>
      <List items={[
        'List all active DO instances',
        'View instance IDs and names',
        'Inspect stored state',
        'Send test messages to instances',
      ]} />

      <H2>Binding Configuration</H2>
      <CodeBlock title="wrangler.toml">{`[durable_objects]
bindings = [
  { name = "MY_DO", class_name = "MyDurableObject" }
]

[[migrations]]
tag = "v1"
new_classes = ["MyDurableObject"]`}</CodeBlock>
    </Section>
  );
}

function DOInstancesSection() {
  return (
    <Section id="do-instances">
      <H1>Instance Listing</H1>
      <P>
        View all active Durable Object instances for each binding.
      </P>

      <H2>Instance Information</H2>
      <Table
        headers={['Property', 'Description']}
        rows={[
          ['ID', 'Unique identifier (hex string)'],
          ['Name', 'Optional name if created with idFromName()'],
          ['Class', 'The DO class name'],
          ['Status', 'Active or hibernating'],
        ]}
      />
    </Section>
  );
}

function DOStateSection() {
  return (
    <Section id="do-state">
      <H1>State Inspection</H1>
      <P>
        Click on a Durable Object instance to inspect its stored state.
      </P>

      <H2>State Viewer</H2>
      <List items={[
        'View all stored key-value pairs',
        'Values are displayed as JSON when possible',
        'See storage size and key count',
        'Edit values directly (use with caution)',
      ]} />

      <Callout type="warning">
        Editing DO state directly can cause inconsistencies. Use this feature carefully.
      </Callout>
    </Section>
  );
}

// ============================================
// Queues Sections
// ============================================

function QueuesSection() {
  return (
    <Section id="queues">
      <H1>Queues</H1>
      <P>
        Monitor and test your Cloudflare Queues with Localflare's queue inspector.
      </P>
    </Section>
  );
}

function QueuesOverviewSection() {
  return (
    <Section id="queues-overview">
      <H1>Queues Overview</H1>
      <P>
        Cloudflare Queues enable asynchronous message processing. Localflare provides tools
        to monitor queue activity and send test messages.
      </P>

      <H2>Features</H2>
      <List items={[
        'View queue depth and message count',
        'Send test messages',
        'Monitor processing in real-time',
        'View message contents',
      ]} />

      <H2>Binding Configuration</H2>
      <CodeBlock title="wrangler.toml">{`[[queues.producers]]
queue = "my-queue"
binding = "MY_QUEUE"

[[queues.consumers]]
queue = "my-queue"
max_batch_size = 10
max_batch_timeout = 30`}</CodeBlock>
    </Section>
  );
}

function QueuesMessagesSection() {
  return (
    <Section id="queues-messages">
      <H1>Message Viewer</H1>
      <P>
        View messages in your queues and monitor processing.
      </P>

      <H2>Message Information</H2>
      <Table
        headers={['Property', 'Description']}
        rows={[
          ['ID', 'Unique message identifier'],
          ['Body', 'Message content (JSON or text)'],
          ['Timestamp', 'When the message was sent'],
          ['Attempts', 'Number of delivery attempts'],
        ]}
      />
    </Section>
  );
}

function QueuesTestingSection() {
  return (
    <Section id="queues-testing">
      <H1>Testing Messages</H1>
      <P>
        Send test messages to your queues to verify your consumer logic.
      </P>

      <Steps items={[
        { title: 'Select a queue', content: 'Choose from your configured queues' },
        { title: 'Enter message body', content: 'JSON or plain text' },
        { title: 'Click Send', content: 'Message is added to the queue' },
        { title: 'Monitor processing', content: 'Watch your consumer handle the message' },
      ]} />

      <CodeBlock title="Example Message">{`{
  "type": "order.created",
  "orderId": "12345",
  "items": ["item1", "item2"]
}`}</CodeBlock>
    </Section>
  );
}

// ============================================
// CLI Reference Sections
// ============================================

function CLISection() {
  return (
    <Section id="cli">
      <H1>CLI Reference</H1>
      <P>
        Complete reference for the Localflare command-line interface.
      </P>
    </Section>
  );
}

function CLICommandsSection() {
  return (
    <Section id="cli-commands">
      <H1>Commands</H1>

      <H2>localflare</H2>
      <P>Start the Localflare development server.</P>
      <CodeBlock title="Terminal">{`localflare [configPath] [options]`}</CodeBlock>

      <H3>Arguments</H3>
      <Table
        headers={['Argument', 'Description']}
        rows={[
          ['configPath', 'Path to wrangler.toml (optional, defaults to ./wrangler.toml)'],
        ]}
      />
    </Section>
  );
}

function CLIOptionsSection() {
  return (
    <Section id="cli-options">
      <H1>CLI Options</H1>

      <Table
        headers={['Option', 'Alias', 'Description', 'Default']}
        rows={[
          ['-p, --port', '-p', 'Worker port', '8787'],
          ['-d, --dashboard-port', '-d', 'Dashboard port', '8788'],
          ['--persist', '', 'Persistence directory', '.localflare'],
          ['-v, --verbose', '-v', 'Verbose output', 'false'],
          ['-h, --help', '-h', 'Display help', ''],
          ['--version', '', 'Display version', ''],
        ]}
      />
    </Section>
  );
}

function CLIExamplesSection() {
  return (
    <Section id="cli-examples">
      <H1>CLI Examples</H1>

      <CodeBlock title="Basic usage">{`# Start with defaults
localflare

# Custom config path
localflare ./config/wrangler.toml

# Custom ports
localflare -p 3000 -d 3001

# Verbose output
localflare -v

# Custom persistence
localflare --persist ./data`}</CodeBlock>
    </Section>
  );
}

// ============================================
// Advanced Sections
// ============================================

function AdvancedSection() {
  return (
    <Section id="advanced">
      <H1>Advanced Topics</H1>
      <P>
        Deep dive into Localflare's architecture and advanced features.
      </P>
    </Section>
  );
}

function ArchitectureSection() {
  return (
    <Section id="architecture">
      <H1>Architecture</H1>
      <P>
        Localflare runs as a single process that manages both your Worker and the dashboard.
      </P>

      <CodeBlock title="Architecture Diagram">{`┌─────────────────────────────────────────┐
│         Localflare (single process)      │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │         Miniflare Runtime          │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐        │  │
│  │  │  D1  │ │  KV  │ │  R2  │  ...   │  │
│  │  └──────┘ └──────┘ └──────┘        │  │
│  └────────────────────────────────────┘  │
│                    │                     │
│         ┌─────────┴─────────┐            │
│         │  Shared Bindings  │            │
│         └─────────┬─────────┘            │
│                   │                      │
│  ┌────────────────┴────────────────┐     │
│  │  ┌──────────┐    ┌──────────┐   │     │
│  │  │  Worker  │    │Dashboard │   │     │
│  │  │  :8787   │    │  :8788   │   │     │
│  │  └──────────┘    └──────────┘   │     │
│  └─────────────────────────────────┘     │
└──────────────────────────────────────────┘`}</CodeBlock>

      <H2>Key Components</H2>
      <List items={[
        'Miniflare Runtime: Provides the Cloudflare Workers runtime locally',
        'Shared Bindings: D1, KV, R2, DO, Queues are shared between Worker and Dashboard',
        'Worker Server: Your application running on port 8787',
        'Dashboard Server: The Localflare UI on port 8788',
      ]} />
    </Section>
  );
}

function BindingsSection() {
  return (
    <Section id="bindings">
      <H1>Supported Bindings</H1>
      <P>
        Localflare supports all major Cloudflare bindings through Miniflare.
      </P>

      <Table
        headers={['Binding', 'Support', 'Dashboard Features']}
        rows={[
          ['D1', 'Full', 'SQL editor, table browser, data CRUD'],
          ['KV', 'Full', 'Key browser, value editor, bulk operations'],
          ['R2', 'Full', 'File browser, upload/download, metadata'],
          ['Durable Objects', 'Full', 'Instance listing, state inspection'],
          ['Queues', 'Full', 'Message viewer, send test messages'],
          ['Service Bindings', 'Full', 'Inter-worker communication'],
          ['Cache API', 'Full', 'Cache viewer'],
          ['Hyperdrive', 'Full', 'Connection status'],
          ['Vectorize', 'Limited', 'Basic operations'],
          ['Workers AI', 'Mock', 'Mock responses'],
        ]}
      />
    </Section>
  );
}

function PersistenceSection() {
  return (
    <Section id="persistence">
      <H1>Data Persistence</H1>
      <P>
        Localflare persists your local data between sessions.
      </P>

      <H2>Default Location</H2>
      <P>Data is stored in <Code>.localflare/</Code> in your project directory:</P>
      <CodeBlock>{`.localflare/
├── d1/           # D1 database files
├── kv/           # KV namespace data
├── r2/           # R2 bucket objects
├── do/           # Durable Object state
└── cache/        # Cache API data`}</CodeBlock>

      <H2>Custom Location</H2>
      <CodeBlock title="Terminal">{`localflare --persist /path/to/data`}</CodeBlock>

      <H2>Clearing Data</H2>
      <P>To start fresh, simply delete the persistence directory:</P>
      <CodeBlock title="Terminal">{`rm -rf .localflare`}</CodeBlock>

      <Callout type="tip">
        Add <Code>.localflare/</Code> to your <Code>.gitignore</Code> to avoid committing local data.
      </Callout>
    </Section>
  );
}

// ============================================
// Troubleshooting Sections
// ============================================

function TroubleshootingSection() {
  return (
    <Section id="troubleshooting">
      <H1>Troubleshooting</H1>
      <P>
        Solutions to common issues when using Localflare.
      </P>
    </Section>
  );
}

function CommonIssuesSection() {
  return (
    <Section id="common-issues">
      <H1>Common Issues</H1>

      <H3>"Cannot find wrangler.toml"</H3>
      <List items={[
        'Make sure you\'re in the correct directory',
        'Specify the path explicitly: localflare ./path/to/wrangler.toml',
        'Check that wrangler.toml exists and is readable',
      ]} />

      <H3>"Port already in use"</H3>
      <List items={[
        'Another process is using port 8787 or 8788',
        'Use custom ports: localflare -p 3000 -d 3001',
        'Kill the process using the port: lsof -i :8787',
      ]} />

      <H3>"Binding not found"</H3>
      <List items={[
        'Check your wrangler.toml configuration',
        'Ensure bindings are properly defined',
        'Restart Localflare after config changes',
      ]} />

      <H3>"D1 query fails"</H3>
      <List items={[
        'Check SQL syntax',
        'Verify table exists',
        'Check column names match your schema',
      ]} />
    </Section>
  );
}

function FAQSection() {
  return (
    <Section id="faq">
      <H1>Frequently Asked Questions</H1>

      <H3>Can I use Localflare in production?</H3>
      <P>
        No. Localflare is designed for local development only. It uses Miniflare to simulate
        the Cloudflare runtime and should not be used in production environments.
      </P>

      <H3>Does Localflare support all Cloudflare features?</H3>
      <P>
        Localflare supports most Cloudflare Workers bindings through Miniflare. Some features
        like Workers AI are mocked. See the Supported Bindings page for details.
      </P>

      <H3>How do I update Localflare?</H3>
      <CodeBlock title="Terminal">{`# If installed globally
npm update -g localflare

# Or just use npx for the latest version
npx localflare`}</CodeBlock>

      <H3>Where can I report issues?</H3>
      <P>
        Report issues on GitHub: github.com/rohanprasadofficial/localflare/issues
      </P>
    </Section>
  );
}
