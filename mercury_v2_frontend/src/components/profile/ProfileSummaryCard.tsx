import { User, Layers, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import type { UserProfile } from '@/types/api/user';

interface ProfileSummaryCardProps {
  user: UserProfile;
  onEdit: () => void;
}

export function ProfileSummaryCard({ user, onEdit }: ProfileSummaryCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 flex flex-col items-center relative overflow-hidden"
    >
      {/* Decorative gradient blob */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

      {/* Avatar with Hover Edit Overlay */}
      <div className="relative mb-6 z-10 group cursor-pointer" onClick={onEdit}>
        <div className="w-32 h-32 rounded-full overflow-hidden shadow-2xl ring-4 ring-white transition-all duration-300 group-hover:ring-primary-200">
          <img
            src={user.avatar_url}
            alt={user.name}
            className="w-full h-full object-cover"
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
             <Camera className="text-white drop-shadow-md" size={32} />
          </div>
        </div>
        <div className="absolute bottom-1 right-1 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-gray-600 opacity-100 group-hover:opacity-0 transition-opacity">
           <User size={14} />
        </div>
      </div>

      {/* Name & Job */}
      <div className="text-center mb-8 z-10">
        <h2 className="text-2xl font-bold text-gray-900 font-heading mb-1">
          {user.name}
        </h2>
        <p className="text-base text-gray-500 font-medium">{user.job_title}</p>
      </div>

      {/* Stats - Only Projects now */}
      <div className="w-full z-10">
        <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-center gap-3 border border-gray-100">
          <Layers className="text-primary-500" size={20} />
          <div className="text-center">
            <span className="text-lg font-bold text-gray-900 mr-2">{user.stats.projects_count}</span>
            <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">Projects</span>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
