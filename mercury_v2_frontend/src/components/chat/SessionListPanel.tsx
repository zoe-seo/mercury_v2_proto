import { Plus, Search, MoreVertical, Trash2, Settings, X } from 'lucide-react';
import { Button } from '../common/Button';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useChatSessions, useDeleteChatSession } from '@/queries/useChat';
import { useChatBrief, useUpsertChatBrief } from '@/queries/useDesignBrief';
import { DesignBriefForm } from '../common/DesignBrief/DesignBriefForm';
import { useState, useEffect } from 'react';

export const SessionListPanel = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { data: sessionsData, isLoading } = useChatSessions();
  const { mutate: deleteSession } = useDeleteChatSession();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [briefModalSessionId, setBriefModalSessionId] = useState<string | null>(null);
  
  // 디버깅: 세션 데이터 확인
  console.log('SessionListPanel - sessionsData:', sessionsData);
  console.log('SessionListPanel - isLoading:', isLoading);
  
  // 세션 목록을 최신순으로 정렬 (updated_at 기준 내림차순)
  const sessions = (sessionsData?.items || []).sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm('이 대화를 삭제하시겠습니까?')) {
      deleteSession(id, {
        onSuccess: () => {
          setOpenMenuId(null);
          // 현재 보고 있는 세션을 삭제한 경우 홈으로 이동
          if (sessionId === id) {
            navigate('/chats');
          }
        }
      });
    }
  };

  return (
    <>
      <div className="p-4 border-b border-gray-200 bg-gray-50 z-10">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
          />
        </div>

        {/* New Chat Button */}
        <Link to="/chats">
          <Button className="w-full justify-center" size="sm">
            <Plus size={16} /> New Chat
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading ? (
          <div className="text-center text-gray-500 text-sm py-4">Loading...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-4">No chat sessions yet</div>
        ) : (
          sessions.map((session) => {
            const isActive = session.id === sessionId;
            
            // Format timestamp
            const updatedAt = new Date(session.updated_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            });
            
            return (
              <div key={session.id} className="relative">
                <Link to={`/chats/${session.id}`}>
                  <div 
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-colors group relative",
                      isActive 
                        ? "bg-white shadow-sm border border-gray-100" 
                        : "hover:bg-gray-100/50"
                    )}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={cn("text-sm font-medium truncate pr-2", isActive ? "text-primary-700" : "text-gray-700")}>
                        {session.title}
                      </h3>
                      <span className="text-[10px] text-gray-400 flex-shrink-0">{updatedAt}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate pr-6">
                      {session.title}
                    </p>
                    
                    {/* Context Menu Trigger */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === session.id ? null : session.id);
                      }}
                      className="absolute right-2 bottom-3 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity z-10"
                    >
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </Link>
                
                {/* Dropdown Menu */}
                {openMenuId === session.id && (
                  <div 
                    className="absolute right-2 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[120px]"
                    onClick={(e) => e.stopPropagation()} // Stop propagation from menu clicks
                  >
                    <button
                      onClick={(e) => handleDelete(session.id, e)}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                    <button
                      onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setBriefModalSessionId(session.id); // Open Brief Modal
                          setOpenMenuId(null); // Close Dropdown
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-t border-gray-100"
                    >
                      <Settings size={14} />
                      Brief Settings
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Brief Settings Modal */}
      {briefModalSessionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             {/* Backdrop */}
             <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setBriefModalSessionId(null)}
             />
             
             {/* Content */}
             <div 
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 border border-white/20"
                onClick={(e) => e.stopPropagation()} // Prevent close on content click
             >
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10">
                    <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary-500"/>
                        Design Brief Settings
                    </h3>
                    <button 
                        onClick={() => setBriefModalSessionId(null)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-400"/>
                    </button>
                </div>
                
                <div className="flex-1 overflow-hidden relative">
                    <BriefModalContent sessionId={briefModalSessionId} onClose={() => setBriefModalSessionId(null)} />
                </div>
             </div>
        </div>
      )}
    </>
  );
};

// Helper component to load brief data
const BriefModalContent = ({ sessionId, onClose }: { sessionId: string; onClose: () => void }) => {
    const { data: briefData, isLoading } = useChatBrief(sessionId);
    const { mutate: updateBrief } = useUpsertChatBrief(sessionId);

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading brief...</div>;
    }
    
    return (
        <DesignBriefForm 
            variant="default"
            initialData={briefData || undefined}
            onSave={(data) => {
                updateBrief(data, {
                    onSuccess: () => {
                        onClose();
                    }
                });
            }}
        />
    )
};
