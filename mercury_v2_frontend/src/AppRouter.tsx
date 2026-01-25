import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home, ChatPage, CanvasPage, CanvasListPage, LoginPage, SignupPage, PageA, PageB, NotFound, UserProfilePage, ProjectsPage } from '@/pages'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<ChatPage />} />
        <Route path="/chats/:sessionId" element={<ChatPage />} />
        <Route path="/canvas" element={<CanvasListPage />} />
        <Route path="/canvas/:canvasId" element={<CanvasPage />} />

        {/* Projects Routes */}
        <Route path="/projects" element={<ProjectsPage view="recent" />} />
        <Route path="/projects/canvases" element={<ProjectsPage view="canvases" />} />
        <Route path="/projects/chats" element={<ProjectsPage view="chats" />} />
        <Route path="/projects/folders" element={<ProjectsPage view="folders" />} />
        <Route path="/projects/folders/:projectId" element={<ProjectsPage view="folders" />} />
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
