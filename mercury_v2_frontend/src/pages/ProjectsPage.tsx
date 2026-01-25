import React, { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SideNavigation } from '@/components/layout/SideNavigation';
import { ProjectsToolbar } from '@/components/projects/ProjectsToolbar';
import { DesignCard } from '@/components/projects/DesignCard';
import { ProjectFolderCard } from '@/components/projects/ProjectFolderCard';
import type { DesignItem, Project } from '@/types/api/projects';
import { Clock, LayoutGrid, MessageSquare, Folder, Loader2 } from 'lucide-react';
import type { NavItem } from '@/components/layout/SideNavigation';
import { useProjects, useRecentDesigns } from '@/queries/useProjects';
import { useCanvasProjects } from '@/queries/useCanvas';
import { useChatSessions } from '@/queries/useChat';

const PROJECT_NAV_ITEMS: NavItem[] = [
  { name: 'Recent Designs', path: '/projects', icon: Clock, end: true },
  { name: 'My Canvases', path: '/projects/canvases', icon: LayoutGrid },
  { name: 'My Chats', path: '/projects/chats', icon: MessageSquare },
  { name: 'My Projects', path: '/projects/folders', icon: Folder },
];


// Define view types prop to reuse this page for different routes
type ViewType = 'recent' | 'canvases' | 'chats' | 'folders';

interface ProjectsPageProps {
  view?: ViewType;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ view = 'recent' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // API Queries
  const { data: projectsData, isLoading: projectsLoading } = useProjects({ page: 1, page_size: 50 });
  const { data: recentDesigns, isLoading: recentLoading } = useRecentDesigns(50);
  const { data: canvasesData, isLoading: canvasesLoading } = useCanvasProjects({ page: 1, page_size: 50 });
  const { data: chatSessionsData, isLoading: chatSessionsLoading } = useChatSessions({ page: 1, page_size: 50 });

  // Data Filtering
  const filteredItems = useMemo(() => {
    let items: (DesignItem | Project)[] = [];
    let isLoading = false;
    
    if (view === 'folders') {
      items = projectsData?.items || [];
      isLoading = projectsLoading;
    } else if (view === 'canvases') {
      // Map canvas projects to DesignItem format
      items = (canvasesData?.items || []).map(canvas => ({
        id: canvas.id,
        type: 'canvas' as const,
        title: canvas.name,
        description: undefined,
        thumbnail_url: canvas.thumbnail_url,
        updated_at: canvas.updated_at,
        project_id: canvas.project_id,
        project_name: undefined,
      }));
      isLoading = canvasesLoading;
    } else if (view === 'chats') {
      // Map chat sessions to DesignItem format
      items = (chatSessionsData?.items || []).map(session => ({
        id: session.id,
        type: 'chat' as const,
        title: session.title,
        description: `${session.message_count || 0} messages`,
        thumbnail_url: undefined,
        updated_at: session.updated_at,
        project_id: session.project_id,
        project_name: undefined,
      }));
      isLoading = chatSessionsLoading;
    } else {
      // Recent Designs
      items = recentDesigns || [];
      isLoading = recentLoading;
      
      // Filter by interactive filter (Toolbar)
      if (activeFilter !== 'all') {
        items = items.filter(d => (d as DesignItem).type === activeFilter);
      }
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item => {
        if ('title' in item) return item.title.toLowerCase().includes(q);
        if ('name' in item) return item.name.toLowerCase().includes(q);
        return false;
      });
    }

    return { items, isLoading };
  }, [view, searchQuery, activeFilter, projectsData, recentDesigns, canvasesData, chatSessionsData, projectsLoading, recentLoading, canvasesLoading, chatSessionsLoading]);

  const handleCreateNew = () => {
    console.log('Create new item based on view:', view);
    // Open modal logic here
  };

  const getPageTitle = () => {
    switch(view) {
      case 'canvases': return 'My Canvases';
      case 'chats': return 'My Chats';
      case 'folders': return 'My Projects';
      default: return 'Recent Designs';
    }
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        <SideNavigation title="Project" items={PROJECT_NAV_ITEMS} className="hidden md:flex" />
        
        <main className="flex-1 flex flex-col min-w-0 bg-white">
          <ProjectsToolbar 
            onSearch={setSearchQuery}
            onFilterChange={view === 'recent' ? setActiveFilter : undefined}
            activeFilter={activeFilter}
            showFilter={view === 'recent'}
            onCreateClick={handleCreateNew}
            createButtonLabel={view === 'folders' ? 'New Project' : 'New Design'}
          />

          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Page Title for Context (Optional if SideNav is obvious, but good for Mobile) */}
              <h1 className="text-2xl font-bold text-gray-900 mb-6 md:hidden">
                {getPageTitle()}
              </h1>
              
              {filteredItems.isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 size={32} className="animate-spin text-emerald-500" />
                </div>
              ) : filteredItems.items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredItems.items.map(item => (
                    view === 'folders' ? (
                      <ProjectFolderCard 
                        key={item.id} 
                        project={item as Project}
                        onClick={() => console.log('Navigate to project', item.id)}
                      />
                    ) : (
                      <DesignCard 
                        key={item.id} 
                        item={item as DesignItem}
                        onClick={() => console.log('Navigate to design', item.id)}
                      />
                    )
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                   <p className="text-lg">No items found.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

