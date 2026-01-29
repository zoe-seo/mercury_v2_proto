import { User, Briefcase, Type } from 'lucide-react';
import { cn } from '@/utils/cn';

interface TabProfileProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  userEmail: string;
}

export function TabProfile({ formData, onChange, userEmail }: TabProfileProps) {
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div>
            <h3 className="text-xl font-bold text-gray-900 font-heading">Profile Details</h3>
            <p className="text-sm text-gray-500 mt-1">Update your personal information</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputGroup label="Nickname" icon={User}>
                <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => onChange('nickname', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium"
                    placeholder="Enter nickname"
                />
            </InputGroup>

            <InputGroup label="Job Title" icon={Briefcase}>
                <input
                    type="text"
                    value={formData.job_title}
                    onChange={(e) => onChange('job_title', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium"
                    placeholder="Job Title"
                />
            </InputGroup>

            <div className="col-span-1 md:col-span-2">
                <InputGroup label="Bio" icon={Type}>
                    <textarea
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => onChange('bio', e.target.value)}
                        maxLength={200}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all resize-none font-medium leading-relaxed"
                        placeholder="Tell us a little bit about yourself..."
                    />
                    <div className="flex justify-end mt-1.5">
                        <span className={cn("text-xs font-medium", formData.bio?.length > 180 ? "text-orange-500" : "text-gray-400")}>
                            {formData.bio?.length}/200
                        </span>
                    </div>
                </InputGroup>
            </div>
            
            <div className="col-span-1 md:col-span-2">
                <InputGroup label="Email (Read Only)">
                    <input
                        type="text"
                        value={userEmail}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-medium cursor-not-allowed"
                    />
                </InputGroup>
            </div>
        </div>
    </div>
  );
}
