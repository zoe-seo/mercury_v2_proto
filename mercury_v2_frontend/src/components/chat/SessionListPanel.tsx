import { Plus, Search, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';
import { Link, useParams } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useState } from 'react';
import { useRichChatSessions } from '@/queries/useRichChat';

export const SessionListPanel = () => {
  const { sessionId } = useParams();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  // Use Real Data
  const { data: sessions = [], isLoading } = useRichChatSessions();

  return (
    <>
      <div className="p-4 border-b border-gray-200 bg-gray-50 z-10">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
          />
        </div>

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
            const updatedAt = new Date(session.updated_at).toLocaleDateString('en-US', {
               month: 'short', day: 'numeric'
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
                      Step: {session.current_step}
                    </p>
                    
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
                
                {openMenuId === session.id && (
                  <div 
                    className="absolute right-2 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[120px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
};
