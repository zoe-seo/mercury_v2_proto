import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/common'
import { Home, PageA, PageB, NotFound } from '@/pages'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/page-a" element={<PageA />} />
          <Route path="/page-b" element={<PageB />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
