import { useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ChatLayout } from '../components/chat/ChatLayout';
import { SessionListPanel } from '../components/chat/SessionListPanel';
import { ChatArea } from '../components/chat/ChatArea';
import { mockSessions } from '../api/mockData';

export const ChatPage = () => {
  const { sessionId } = useParams();
  
  // Find current session data or default to empty for new chat
  const currentSession = sessionId ? mockSessions.find(s => s.id === sessionId) : null;
  const initialMessages = currentSession ? currentSession.messages : [];

  return (
    <Layout>
      <ChatLayout sidebar={<SessionListPanel />}>
        {/* We use key={sessionId} to force re-mounting ChatArea when switching sessions */}
        <ChatArea key={sessionId || 'new'} initialMessages={initialMessages} />
      </ChatLayout>
    </Layout>
  );
};
