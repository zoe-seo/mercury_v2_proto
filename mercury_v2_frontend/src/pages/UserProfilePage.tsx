import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { ProfileSummaryCard } from '../components/profile/ProfileSummaryCard';
import { ProfileNavigation, type TabId } from '../components/profile/ProfileNavigation';
import { ProfileSkeleton } from '../components/profile/ProfileSkeleton';
import { useProfile, useUpdateProfile } from '../hooks/useProfile';
import { TabProfile } from '../components/profile/tabs/TabProfile';
import { TabPreferences } from '../components/profile/tabs/TabPreferences';
import { TabSecurity } from '../components/profile/tabs/TabSecurity';
import { TabNotifications } from '../components/profile/tabs/TabNotifications';
import { Save } from 'lucide-react';
import { cn } from '@/utils/cn';


export function UserProfilePage() {
  const { data: user, isLoading, isError } = useProfile();
  const updateMutation = useUpdateProfile();
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  
  // Form State
  const [formData, setFormData] = useState<any>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nickname: user.nickname,
        job_title: user.job_title,
        bio: user.bio,
        shoe_size_system: user.preferences.shoe_size_system,
        gender_category: user.preferences.gender_category,
        style_tags: user.preferences.style_tags,
        notifications: user.notification_settings,
      });
    }
  }, [user]);

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev: any) => {
      setIsDirty(true);
      return { ...prev, [field]: value };
    });
  };



  // Helper to update specific nested parts of state
  const updateState = (updater: (prev: any) => any) => {
      setFormData((prev: any) => {
          setIsDirty(true);
          return updater(prev);
      });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDirty || !user) return;

    try {
      const updates: any = {
        nickname: formData.nickname,
        job_title: formData.job_title,
        bio: formData.bio,
        preferences: {
          shoe_size_system: formData.shoe_size_system,
          gender_category: formData.gender_category,
          style_tags: formData.style_tags,
        },
        notification_settings: formData.notifications
      };
      
      await updateMutation.mutateAsync(updates);
      setIsDirty(false);
    } catch (error) {
      console.error('Failed to save', error);
    }
  };

  if (isLoading || !formData) {
    return (
      <Layout>
        <div className="container max-w-[1400px] mx-auto px-4 py-8">
          <ProfileSkeleton />
        </div>
      </Layout>
    );
  }

  if (isError || !user) {
    return <Layout><div>Error loading profile</div></Layout>;
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="container max-w-[1400px] mx-auto px-4 py-8"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-heading">My Profile</h1>
          <p className="text-gray-500 mt-1">Manage your account settings and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
          {/* Left Column: Summary + Navigation */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            <ProfileSummaryCard user={user} onEdit={() => window.alert('Avatar Upload')} />
            
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <ProfileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </aside>

          {/* Right Column: Active Tab Content */}
          <main>
            <form onSubmit={handleSave} className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
                <div className="flex-1 p-8">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <TabProfile 
                                key="profile"
                                formData={formData} 
                                onChange={handleFieldChange} 
                                userEmail={user.email} 
                            />
                        )}
                        {activeTab === 'preferences' && (
                            <TabPreferences 
                                key="preferences"
                                formData={formData} 
                                onChange={(field, value) => updateState(prev => ({ ...prev, [field]: value }))}
                                onTagToggle={(tag) => {
                                    const currentTags = formData.style_tags;
                                    const newTags = currentTags.includes(tag)
                                        ? currentTags.filter((t: any) => t !== tag)
                                        : [...currentTags, tag];
                                    updateState(prev => ({ ...prev, style_tags: newTags }));
                                }}
                            />
                        )}
                        {activeTab === 'security' && <TabSecurity key="security" />}
                        {activeTab === 'notifications' && (
                            <TabNotifications 
                                key="notifications" 
                                notifications={formData.notifications}
                                onChange={(field, value) => updateState(prev => ({
                                    ...prev,
                                    notifications: { ...prev.notifications, [field]: value }
                                }))}
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer only for tabs with saveable data */}
                {(['profile', 'preferences', 'notifications'].includes(activeTab)) && (
                    <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={!isDirty || updateMutation.isPending}
                            className={cn(
                                "flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold shadow-sm transition-all text-base",
                                isDirty && !updateMutation.isPending
                                    ? "bg-primary-600 text-white hover:bg-primary-700 hover:shadow-primary-lg transform hover:-translate-y-0.5" 
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            )}
                        >
                            <Save size={20} className={updateMutation.isPending ? "animate-spin" : ""} />
                            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </form>
          </main>
        </div>
      </motion.div>
    </Layout>
  );
}
