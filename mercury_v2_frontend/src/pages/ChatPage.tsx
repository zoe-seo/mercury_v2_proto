import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ChatLayout } from '../components/chat/ChatLayout';
import { SessionListPanel } from '../components/chat/SessionListPanel';
import { ChatArea } from '../components/chat/ChatArea';
import { useChatMessages, useCreateChatSession } from '@/queries/useChat';

export const ChatPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  // 세션 데이터 조회 (sessionId가 있을 때만)
  const { data: messages } = useChatMessages(sessionId);
  
  // 세션 생성 mutation
  const { mutate: createSession, isPending: isCreatingSession } = useCreateChatSession();
  
  // 첫 메시지 전송 핸들러
  const handleFirstMessage = (content: string) => {
    if (!sessionId) {
      // 세션이 없으면 생성
      createSession(
        { 
          title: content.substring(0, 50), // 첫 메시지를 제목으로 (최대 50자)
        },
        {
          onSuccess: (newSession) => {
            // 새 세션으로 리다이렉트
            navigate(`/chats/${newSession.id}`, { replace: true });
          },
          onError: (error) => {
            console.error('Failed to create session:', error);
          }
        }
      );
    }
  };

  return (
    <Layout>
      <ChatLayout sidebar={<SessionListPanel />}>
        <ChatArea 
          sessionId={sessionId}
          messages={messages || []}
          isCreatingSession={isCreatingSession}
          onFirstMessage={handleFirstMessage}
        />
      </ChatLayout>
    </Layout>
  );
};
