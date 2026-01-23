import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home, ChatPage, CanvasPage, LoginPage, SignupPage, PageA, PageB, NotFound, UserProfilePage } from '@/pages'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat/new" element={<ChatPage />} />
        <Route path="/chat/:sessionId" element={<ChatPage />} />
        <Route path="/canvas/new" element={<CanvasPage />} />
        <Route path="/canvas/:projectId" element={<CanvasPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/page-a" element={<PageA />} />
        <Route path="/page-b" element={<PageB />} />
        <Route path="/mypage" element={<UserProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
