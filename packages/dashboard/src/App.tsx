import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { D1Explorer } from '@/components/d1/D1Explorer'
import { KVExplorer } from '@/components/kv/KVExplorer'
import { R2Explorer } from '@/components/r2/R2Explorer'
import { DOExplorer } from '@/components/do/DOExplorer'
import { QueuesExplorer } from '@/components/queues/QueuesExplorer'
import { TailLogs } from '@/components/logs/TailLogs'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 1,
      staleTime: 5000,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="d1" element={<D1Explorer />} />
            <Route path="kv" element={<KVExplorer />} />
            <Route path="r2" element={<R2Explorer />} />
            <Route path="do" element={<DOExplorer />} />
            <Route path="queues" element={<QueuesExplorer />} />
            <Route path="logs" element={<TailLogs />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
