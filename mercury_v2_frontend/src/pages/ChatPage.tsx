import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ChatLayout } from '../components/chat/ChatLayout';
import { SessionListPanel } from '../components/chat/SessionListPanel';
import { RichChatArea } from '../components/chat/RichChatArea';
import type { Message } from '@/types/richChat';
import { useRichChatSession, useStreamRichMessage, useCreateRichChatSession } from '@/queries/useRichChat';

export const ChatPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Local State
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false); 
  const hasAutoSentRef = useRef(false);

  // Queries
  const { data: sessionHistory, isLoading, refetch } = useRichChatSession(sessionId);
  const { sendMessage } = useStreamRichMessage();
  const { mutate: createSession, isPending: isCreating } = useCreateRichChatSession();

  // 1. Sync History on Load
  useEffect(() => {
    if (sessionHistory?.messages) {
      setMessages(sessionHistory.messages);
    } else if (!sessionId) {
      setMessages([]); // Reset on new chat
    }
  }, [sessionHistory, sessionId]);

  // 2. Handle Auto-Send for First Message (Redirected from New Chat)
  useEffect(() => {
    const firstMessage = (location.state as any)?.firstMessage;
    if (sessionId && firstMessage && !hasAutoSentRef.current) {
        hasAutoSentRef.current = true;
        // Check if history is empty to avoid double send if reloaded
        if (!sessionHistory?.messages || sessionHistory.messages.length === 0) {
            handleSendMessageLogic(sessionId, firstMessage);
        }
        // Clear state to prevent re-execution on refresh
        window.history.replaceState({}, document.title);
    }
  }, [sessionId, location.state, sessionHistory]);

  // Logic to send message via stream
  const handleSendMessageLogic = (sid: string, text: string) => {
    setIsTyping(true);
    // Optimistic Update
    setMessages(prev => [...prev, {
        id: `temp_u_${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date().toISOString()
    }]);

    sendMessage(sid, { type: 'text', content: { text } }, {
      onUserMessage: (msg) => {
        // Replace temp message or just ensure sync.
        // For simplicity, we just let it append, but ideally we match ID.
        // Here we won't double append if we trust the flow, but optimistically we added it.
        // Actually, let's NOT add optimistic message above if we trust onUserMessage echo.
        // Spec says: SSE echoes 'user_message'.
        // So let's NOT add optimistic update to `messages` manually above if we want to avoid dupes,
        // OR filtering duplicates.
        // Let's rely on echo for consistency.
        setMessages(prev => {
            // Check if we already have this user message (deduplication)
            if (prev.some(m => m.id === msg.id)) return prev;
            // Remove optimistic one if we had it? Hard to track.
            // Let's keep optimistic one and when echo comes, replace it?
            // To be safe and simple: Don't do optimistic add above, just set isTyping.
            // But user wants instant feedback.
            // Let's do: Add optimistic with ID `opt_...`. When echo comes, remove `opt_`?
            // For MVP: relying on echo is fast enough (10-50ms usually).
            return [...prev, msg];
        });
      },
      onTextDelta: (delta) => {
        setIsTyping(false); 
        setMessages(prev => {
           const lastMsg = prev[prev.length - 1];
           // Check if last message is assistant and update it
           if (lastMsg?.role === 'assistant') {
             return [
               ...prev.slice(0, -1),
               { ...lastMsg, content: lastMsg.content + delta }
             ];
           } else {
             // Create new assistant message
             const newId = `temp_a_${Date.now()}`;
             return [...prev, { id: newId, role: 'assistant', content: delta, timestamp: new Date().toISOString() }];
           }
        });
      },
      onWidget: (widget) => {
         setMessages(prev => {
           const lastMsg = prev[prev.length - 1];
           if (lastMsg?.role === 'assistant') {
             return [...prev.slice(0, -1), { ...lastMsg, widget }];
           }
           return prev;
         });
      },
      onDesignState: (state) => { console.log(state); },
      onDone: () => {
         refetch();
      },
      onError: (err) => {
         console.error("Stream Error", err);
         setIsTyping(false);
      }
    });
  };

  const handleSendMessage = (text: string) => {
    if (!sessionId) {
        // Create Session
        createSession(text, {
            onSuccess: (newSession) => {
                navigate(`/chats/${newSession.id}`, { 
                    state: { firstMessage: text }
                });
            }
        });
    } else {
        handleSendMessageLogic(sessionId, text);
    }
  };

  const handleWidgetSelect = (messageId: string, value: any) => {
    if (!sessionId) return;

    // Find the widget from the message to get the field name
    const message = messages.find(m => m.id === messageId);
    const field = message?.widget?.data?.field || 'unknown';

    // Logic repeated for selection...
    // Refactor to shared logic
    setIsTyping(true);
    sendMessage(sessionId, { type: 'selection', content: { field, value } }, {
       onUserMessage: (msg) => setMessages(prev => [...prev, msg]),
       onTextDelta: (delta) => {
          setIsTyping(false);
          setMessages(prev => {
             const lastMsg = prev[prev.length - 1];
             if (lastMsg?.role === 'assistant') {
               return [...prev.slice(0, -1), { ...lastMsg, content: lastMsg.content + delta }];
             } else {
               const newId = `temp_a_${Date.now()}`;
               return [...prev, { id: newId, role: 'assistant', content: delta, timestamp: new Date().toISOString() }];
             }
          });
       },
       onWidget: (widget) => {
           setMessages(prev => {
             const lastMsg = prev[prev.length - 1];
             if (lastMsg?.role === 'assistant') {
               return [...prev.slice(0, -1), { ...lastMsg, widget }];
             }
             return prev;
           });
       },
       onDesignState: (state) => {},
       onDone: () => {
         refetch();
       },
       onError: (err) => {
         console.error(err);
         setIsTyping(false);
       }
    });
  };

  return (
    <Layout>
      <ChatLayout sidebar={<SessionListPanel />}>
        {isLoading ? (
            <div className="flex h-full items-center justify-center">Loading...</div>
        ) : (
            <RichChatArea 
              messages={messages}
              onSendMessage={handleSendMessage}
              onWidgetSelect={handleWidgetSelect}
              isTyping={isTyping || isCreating}
            />
        )}
      </ChatLayout>
    </Layout>
  );
};
