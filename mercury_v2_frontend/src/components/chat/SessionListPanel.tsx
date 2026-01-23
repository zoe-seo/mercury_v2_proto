import { Plus, Search, MoreVertical } from 'lucide-react';
import { Button } from '../common/Button';
import { mockSessions } from '@/mocks/data/home';
import { Link, useParams } from 'react-router-dom';
import { cn } from '../../utils/cn';

export const SessionListPanel = () => {
  const { sessionId } = useParams();

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
        <Link to="/chat/new">
          <Button className="w-full justify-center" size="sm">
            <Plus size={16} /> New Chat
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {mockSessions.map((session) => {
           const isActive = session.id === sessionId;
           return (
            <Link to={`/chat/${session.id}`} key={session.id}>
              <div 
                className={cn(
                  "p-3 rounded-lg cursor-pointer transition-colors group relative",
                  isActive 
                    ? "bg-white shadow-sm border border-gray-100" 
                    : "hover:bg-gray-100/50"
                  // Note: The border-l-3 accent style from spec is replaced by a cleaner card style here for better fit
                )}
              >
                <div className="flex justify-between items-start mb-1">
                   <h3 className={cn("text-sm font-medium truncate pr-2", isActive ? "text-primary-700" : "text-gray-700")}>
                     {session.title}
                   </h3>
                   <span className="text-[10px] text-gray-400 flex-shrink-0">{session.updatedAt}</span>
                </div>
                <p className="text-xs text-gray-500 truncate pr-6">
                  {session.lastMessage}
                </p>
                
                {/* Context Menu Trigger (Visible on Hover) */}
                <button className="absolute right-2 bottom-3 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity">
                  <MoreVertical size={14} />
                </button>
              </div>
            </Link>
           );
        })}
      </div>
    </>
  );
};
