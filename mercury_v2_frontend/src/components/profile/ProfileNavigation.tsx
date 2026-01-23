import { User, Sliders, Shield, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export type TabId = 'profile' | 'preferences' | 'security' | 'notifications';

interface ProfileNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function ProfileNavigation({ activeTab, onTabChange }: ProfileNavigationProps) {
  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Sliders },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <nav className="space-y-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all relative group",
              isActive 
                ? "text-primary-700 bg-primary-50 font-semibold" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <tab.icon size={18} className={cn(isActive ? "text-primary-600" : "text-gray-400 group-hover:text-gray-600")} />
            {tab.label}
            
            {isActive && (
              <motion.div
                layoutId="activeNav"
                className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-l-lg"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
