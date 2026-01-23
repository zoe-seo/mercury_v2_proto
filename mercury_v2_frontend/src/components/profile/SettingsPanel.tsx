import { useState, useEffect } from 'react';
import type { UserProfile, UserPreferences, NotificationSettings, StyleTag } from '@/types/api/user';
import { Save, User, Briefcase, Type, Bell, Shield, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

interface SettingsPanelProps {
  user: UserProfile;
  onSave: (updates: Partial<UserProfile>) => Promise<void>;
}

type TabId = 'profile' | 'preferences' | 'security' | 'notifications';

export function SettingsPanel({ user, onSave }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [formData, setFormData] = useState({
    nickname: user.nickname,
    job_title: user.job_title,
    bio: user.bio,
    shoe_size_system: user.preferences.shoe_size_system,
    gender_category: user.preferences.gender_category,
    style_tags: user.preferences.style_tags,
    notifications: user.notification_settings,
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData({
      nickname: user.nickname,
      job_title: user.job_title,
      bio: user.bio,
      shoe_size_system: user.preferences.shoe_size_system,
      gender_category: user.preferences.gender_category,
      style_tags: user.preferences.style_tags,
      notifications: user.notification_settings,
    });
  }, [user]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      setIsDirty(true);
      return newData;
    });
  };

  const handlePreferenceChange = (field: keyof UserPreferences, value: any) => {
    setFormData((prev) => {
      setIsDirty(true);
      return { ...prev, [field]: value };
    });
  };
  
  const toggleStyleTag = (tag: StyleTag) => {
    const currentTags = formData.style_tags;
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    handlePreferenceChange('style_tags', newTags);
  };

  const handleNotificationChange = (field: keyof NotificationSettings, value: boolean) => {
      setFormData((prev) => {
          setIsDirty(true);
          return {
              ...prev,
              notifications: { ...prev.notifications, [field]: value }
          }
      })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDirty) return; // Allow save even if not dirty? Spec says 'disabled if loading', implies dirty check usually. Keeping dirty check for UX.

    setIsSaving(true);
    try {
      const updates: Partial<UserProfile> = {
        nickname: formData.nickname,
        job_title: formData.job_title,
        bio: formData.bio,
        preferences: {
          shoe_size_system: formData.shoe_size_system,
          gender_category: formData.gender_category,
          style_tags: formData.style_tags,
          theme: user.preferences.theme // Preserve existing
        },
        notification_settings: formData.notifications
      };
      await onSave(updates);
      setIsDirty(false);
    } catch (error) {
      console.error('Failed to save profile', error);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Sliders },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const InputGroup = ({ label, icon: Icon, children }: { label: string, icon?: any, children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 ml-1">
        {Icon && <Icon size={14} className="text-gray-400" />}
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden flex flex-col min-h-[600px]">
      {/* Top Tab Bar */}
      <div className="bg-white/50 border-b border-gray-100">
        <div className="flex px-2">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                        "relative flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors",
                        activeTab === tab.id 
                            ? "text-primary-600" 
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                    )}
                >
                    <tab.icon size={18} />
                    {tab.label}
                    {activeTab === tab.id && (
                        <motion.div 
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                        />
                    )}
                </button>
            ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 p-8 relative">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
                <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InputGroup label="Nickname" icon={User}>
                            <input
                                type="text"
                                value={formData.nickname}
                                onChange={(e) => handleChange('nickname', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium"
                                placeholder="Enter nickname"
                            />
                        </InputGroup>

                        <InputGroup label="Job Title" icon={Briefcase}>
                            <input
                                type="text"
                                value={formData.job_title}
                                onChange={(e) => handleChange('job_title', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium"
                                placeholder="Job Title"
                            />
                        </InputGroup>

                         <div className="col-span-1 md:col-span-2">
                            <InputGroup label="Bio" icon={Type}>
                                <textarea
                                    rows={4}
                                    value={formData.bio}
                                    onChange={(e) => handleChange('bio', e.target.value)}
                                    maxLength={200}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all resize-none font-medium leading-relaxed"
                                    placeholder="Tell us a little bit about yourself..."
                                />
                                <div className="flex justify-end mt-1.5">
                                    <span className={cn("text-xs font-medium", formData.bio.length > 180 ? "text-orange-500" : "text-gray-400")}>
                                        {formData.bio.length}/200
                                    </span>
                                </div>
                            </InputGroup>
                        </div>
                        
                         <div className="col-span-1 md:col-span-2">
                            <InputGroup label="Email (Read Only)">
                                <input
                                    type="text"
                                    value={user.email}
                                    readOnly
                                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-medium cursor-not-allowed"
                                />
                            </InputGroup>
                        </div>
                    </div>
                </motion.div>
            )}

            {activeTab === 'preferences' && (
                <motion.div
                    key="preferences"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-8"
                >
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <InputGroup label="Default Unit">
                            <div className="relative">
                                <select
                                    value={formData.shoe_size_system}
                                    onChange={(e) => handlePreferenceChange('shoe_size_system', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all appearance-none font-medium cursor-pointer hover:bg-gray-100"
                                >
                                    <option value="US">US (United States)</option>
                                    <option value="UK">UK (United Kingdom)</option>
                                    <option value="EU">EU (Europe)</option>
                                    <option value="MM">MM (Millimeters)</option>
                                </select>
                             </div>
                         </InputGroup>

                         <InputGroup label="Default Gender">
                            <div className="relative">
                                <select
                                    value={formData.gender_category}
                                    onChange={(e) => handlePreferenceChange('gender_category', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all appearance-none font-medium cursor-pointer hover:bg-gray-100"
                                >
                                    <option value="mens">Mens</option>
                                    <option value="womens">Womens</option>
                                    <option value="unisex">Unisex</option>
                                    <option value="kids">Kids</option>
                                </select>
                             </div>
                         </InputGroup>

                         <div className="col-span-1 md:col-span-2">
                             <InputGroup label="Style Tags">
                                 <div className="flex flex-wrap gap-2 mt-2">
                                     {['minimalist', 'futuristic', 'retro', 'streetwear', 'luxury', 'performance'].map((tag) => {
                                         const isSelected = formData.style_tags.includes(tag as StyleTag);
                                         return (
                                             <button
                                                 key={tag}
                                                 type="button"
                                                 onClick={() => toggleStyleTag(tag as StyleTag)}
                                                 className={cn(
                                                     "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                                                     isSelected
                                                         ? "bg-primary-50 border-primary-500 text-primary-700"
                                                         : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                                 )}
                                             >
                                                 {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                             </button>
                                         );
                                     })}
                                 </div>
                             </InputGroup>
                         </div>
                     </div>
                </motion.div>
            )}

            {activeTab === 'security' && (
                <motion.div
                    key="security"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-8"
                >
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Change Password</h4>
                        <input type="password" placeholder="Current Password" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 mb-2" />
                        <div className="grid grid-cols-2 gap-4">
                             <input type="password" placeholder="New Password" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" />
                             <input type="password" placeholder="Confirm Password" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" />
                        </div>
                        <div className="flex justify-end">
                            <button type="button" className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                                Update Password
                            </button>
                        </div>
                    </div>

                     <hr className="border-gray-100" />

                     <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Login Activity</h4>
                         {/* Placeholder List */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                                 </div>
                                 <div>
                                     <p className="font-medium text-gray-900">Chrome on Windows</p>
                                     <p className="text-xs text-gray-500">Seoul, KR • Active now</p>
                                 </div>
                             </div>
                             <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">Current</div>
                        </div>
                     </div>
                </motion.div>
            )}

             {activeTab === 'notifications' && (
                <motion.div
                    key="notifications"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                >
                     <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Email Notifications</h4>
                        <div className="space-y-4">
                             <div className="flex items-center justify-between">
                                 <div>
                                     <p className="font-medium text-gray-900">Creation Finished</p>
                                     <p className="text-sm text-gray-500">Get notified when your design generation is complete.</p>
                                 </div>
                                 <button 
                                    type="button"
                                    onClick={() => handleNotificationChange('email_creation_finished', !formData.notifications.email_creation_finished)}
                                    className={cn("w-12 h-6 rounded-full transition-colors relative", formData.notifications.email_creation_finished ? "bg-primary-500" : "bg-gray-200")}
                                 >
                                     <span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform", formData.notifications.email_creation_finished ? "left-7" : "left-1")} />
                                 </button>
                             </div>
                             <hr className="border-gray-100" />
                              <div className="flex items-center justify-between">
                                 <div>
                                     <p className="font-medium text-gray-900">Weekly Report</p>
                                     <p className="text-sm text-gray-500">Receive a weekly summary of your design activities.</p>
                                 </div>
                                 <button 
                                    type="button"
                                    onClick={() => handleNotificationChange('email_weekly_report', !formData.notifications.email_weekly_report)}
                                    className={cn("w-12 h-6 rounded-full transition-colors relative", formData.notifications.email_weekly_report ? "bg-primary-500" : "bg-gray-200")}
                                 >
                                     <span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform", formData.notifications.email_weekly_report ? "left-7" : "left-1")} />
                                 </button>
                             </div>
                        </div>
                     </div>
                     
                     <div className="pt-4">
                        <h4 className="font-semibold text-gray-900 mb-4">App Push</h4>
                          <div className="flex items-center justify-between">
                                 <div>
                                     <p className="font-medium text-gray-900">Browser Notification</p>
                                     <p className="text-sm text-gray-500">Allow notifications in your browser.</p>
                                 </div>
                                 <button 
                                    type="button"
                                    onClick={() => handleNotificationChange('app_browser_notification', !formData.notifications.app_browser_notification)}
                                    className={cn("w-12 h-6 rounded-full transition-colors relative", formData.notifications.app_browser_notification ? "bg-primary-500" : "bg-gray-200")}
                                 >
                                     <span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform", formData.notifications.app_browser_notification ? "left-7" : "left-1")} />
                                 </button>
                             </div>
                     </div>

                </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer / Actions - Only show for Profile & Preferences tabs where we have main form data */}
        {(activeTab === 'profile' || activeTab === 'preferences') && (
            <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-end">
            <button
                type="submit"
                disabled={!isDirty || isSaving}
                className={cn(
                "flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold shadow-sm transition-all text-base",
                isDirty && !isSaving 
                    ? "bg-primary-600 text-white hover:bg-primary-700 hover:shadow-primary-lg transform hover:-translate-y-0.5" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                )}
            >
                <Save size={20} className={isSaving ? "animate-spin" : ""} />
                {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </button>
            </div>
        )}
      </form>
    </div>
  );
}
