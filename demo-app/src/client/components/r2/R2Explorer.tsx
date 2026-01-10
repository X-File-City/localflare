import { useState, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Folder01Icon,
  Delete02Icon,
  File01Icon,
  Download01Icon,
  Upload01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PageHeader } from "@/components/ui/page-header"
import { StatsCard, StatsCardGroup } from "@/components/ui/stats-card"
import { SearchInput } from "@/components/ui/search-input"
import { DataTable, DataTableLoading, type Column } from "@/components/ui/data-table"
import { EmptyState } from "@/components/ui/empty-state"
import { r2Api, R2_BUCKETS, type R2Object, type R2BucketName } from "@/lib/api"
import { formatBytes, formatDate } from "@/lib/utils"

export default function R2Explorer() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedBucket, setSelectedBucket] = useState<R2BucketName>('files')
  const [prefix, setPrefix] = useState("")
  const [selectedFile, setSelectedFile] = useState<R2Object | null>(null)

  const currentBucket = R2_BUCKETS.find(b => b.id === selectedBucket)!

  const { data: files, isLoading } = useQuery({
    queryKey: ["files", selectedBucket, prefix],
    queryFn: () => r2Api.listFiles(selectedBucket, prefix || undefined),
  })

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      return r2Api.uploadFile(selectedBucket, file.name, file)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", selectedBucket] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (key: string) => r2Api.deleteFile(selectedBucket, key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", selectedBucket] })
      setSelectedFile(null)
    },
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadMutation.mutate(file)
    }
  }

  const handleDownload = (key: string) => {
    window.open(r2Api.downloadFile(selectedBucket, key), "_blank")
  }

  const handleBucketChange = (bucket: R2BucketName) => {
    setSelectedBucket(bucket)
    setSelectedFile(null)
    setPrefix("")
  }

  const fileColumns: Column<R2Object>[] = [
    {
      key: "key",
      header: "Key",
      render: (value) => (
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={File01Icon} className="size-4 text-r2" strokeWidth={2} />
          <span className="font-mono text-xs truncate">{String(value)}</span>
        </div>
      ),
    },
    {
      key: "size",
      header: "Size",
      width: "100px",
      render: (value) => (
        <span className="text-xs text-muted-foreground">{formatBytes(Number(value))}</span>
      ),
    },
    {
      key: "uploaded",
      header: "Uploaded",
      width: "150px",
      render: (value) => (
        <span className="text-xs text-muted-foreground">{formatDate(String(value))}</span>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="p-6">
        <DataTableLoading />
      </div>
    )
  }

  const totalSize = files?.objects?.reduce((acc, f) => acc + f.size, 0) ?? 0

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <PageHeader
          icon={Folder01Icon}
          iconColor="text-r2"
          title="R2 Storage"
          description="Object storage for files and assets"
          actions={
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMutation.isPending}
              >
                <HugeiconsIcon icon={Upload01Icon} className="size-4 mr-1.5" strokeWidth={2} />
                {uploadMutation.isPending ? "Uploading..." : "Upload File"}
              </Button>
            </>
          }
        />

        {/* Bucket Selector */}
        <div className="mt-4">
          <label className="text-xs font-medium text-muted-foreground uppercase mb-2 block">
            Select Bucket
          </label>
          <div className="flex gap-2">
            {R2_BUCKETS.map((bucket) => (
              <button
                key={bucket.id}
                onClick={() => handleBucketChange(bucket.id)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  selectedBucket === bucket.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:bg-muted text-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Folder01Icon} className="size-4" strokeWidth={2} />
                  {bucket.name}
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {currentBucket.description}
          </p>
        </div>

        {/* Stats */}
        <StatsCardGroup className="mt-6">
          <StatsCard
            icon={File01Icon}
            iconColor="text-r2"
            label="Objects"
            value={files?.objects?.length ?? 0}
            description={`in ${currentBucket.name}`}
          />
          <StatsCard
            icon={Folder01Icon}
            iconColor="text-muted-foreground"
            label="Total Size"
            value={formatBytes(totalSize)}
          />
        </StatsCardGroup>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* File List */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Search */}
          <div className="p-4 border-b border-border">
            <SearchInput
              value={prefix}
              onChange={setPrefix}
              placeholder="Filter by prefix..."
              className="max-w-sm"
            />
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto p-4">
            {files?.objects?.length ? (
              <DataTable
                columns={fileColumns}
                data={files.objects as unknown as Record<string, unknown>[]}
                onRowClick={(row) => setSelectedFile(row as unknown as R2Object)}
                emptyIcon={File01Icon}
                emptyTitle="No files found"
                emptyDescription="Upload a file to get started"
                actions={(row) => (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => handleDownload((row as unknown as R2Object).key)}
                    >
                      <HugeiconsIcon icon={Download01Icon} className="size-4" strokeWidth={2} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => deleteMutation.mutate((row as unknown as R2Object).key)}
                      disabled={deleteMutation.isPending}
                    >
                      <HugeiconsIcon
                        icon={Delete02Icon}
                        className="size-4 text-destructive"
                        strokeWidth={2}
                      />
                    </Button>
                  </div>
                )}
              />
            ) : (
              <EmptyState
                icon={File01Icon}
                title="No files found"
                description={prefix ? "No files match your filter" : `Upload a file to ${currentBucket.name}`}
                action={{
                  label: "Upload File",
                  onClick: () => fileInputRef.current?.click(),
                }}
              />
            )}
          </div>
        </div>

        {/* File Details Sidebar */}
        {selectedFile && (
          <div className="w-80 border-l border-border flex flex-col bg-muted/30">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold">File Details</h3>
              <p className="text-xs text-muted-foreground mt-0.5">in {currentBucket.name}</p>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Key</p>
                  <p className="text-sm font-mono break-all">{selectedFile.key}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Size</p>
                  <p className="text-sm">{formatBytes(selectedFile.size)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Uploaded</p>
                  <p className="text-sm">{formatDate(selectedFile.uploaded)}</p>
                </div>
                <div className="pt-4 flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(selectedFile.key)}
                  >
                    <HugeiconsIcon icon={Download01Icon} className="size-4 mr-1.5" strokeWidth={2} />
                    Download
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(selectedFile.key)}
                    disabled={deleteMutation.isPending}
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="size-4 mr-1.5" strokeWidth={2} />
                    Delete
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  )
}
