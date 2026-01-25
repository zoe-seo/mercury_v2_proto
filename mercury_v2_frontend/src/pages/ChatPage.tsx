import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ChatLayout } from '../components/chat/ChatLayout';
import { SessionListPanel } from '../components/chat/SessionListPanel';
import { ChatArea } from '../components/chat/ChatArea';
import { useChatMessages, useCreateChatSession } from '@/queries/useChat';
import { useRef } from 'react';

export const ChatPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  // 첫 메시지를 임시 저장
  const firstMessageRef = useRef<string | null>(null);
  
  // 세션 데이터 조회 (sessionId가 있을 때만)
  const { data: messages } = useChatMessages(sessionId);
  
  // 디버깅: 메시지 데이터 확인
  console.log('ChatPage - sessionId:', sessionId);
  console.log('ChatPage - messages:', messages);
  
  // 세션 생성 mutation
  const { mutate: createSession, isPending: isCreatingSession } = useCreateChatSession();
  
  // 첫 메시지 전송 핸들러
  const handleFirstMessage = (content: string) => {
    if (!sessionId) {
      // 첫 메시지를 임시 저장
      firstMessageRef.current = content;
      
      // 세션 생성
      createSession(
        { 
          title: content.substring(0, 50), // 첫 메시지를 제목으로 (최대 50자)
        },
        {
          onSuccess: (newSession) => {
            // 새 세션으로 리다이렉트 (state로 첫 메시지 전달)
            navigate(`/chats/${newSession.id}`, { 
              replace: true,
              state: { firstMessage: content }
            });
          },
          onError: (error) => {
            console.error('Failed to create session:', error);
            firstMessageRef.current = null;
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
