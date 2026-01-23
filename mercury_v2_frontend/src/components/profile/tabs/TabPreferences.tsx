import { type UserPreferences, type StyleTag } from '@/types/api/user';
import { cn } from '@/utils/cn';

interface TabPreferencesProps {
  formData: any;
  onChange: (field: keyof UserPreferences, value: any) => void;
  onTagToggle: (tag: StyleTag) => void;
}

export function TabPreferences({ formData, onChange, onTagToggle }: TabPreferencesProps) {
  const InputGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
         <div>
            <h3 className="text-xl font-bold text-gray-900 font-heading">Preferences</h3>
            <p className="text-sm text-gray-500 mt-1">Customize your design environment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputGroup label="Default Unit">
            <div className="relative">
                <select
                    value={formData.shoe_size_system}
                    onChange={(e) => onChange('shoe_size_system', e.target.value)}
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
                    onChange={(e) => onChange('gender_category', e.target.value)}
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
                                    onClick={() => onTagToggle(tag as StyleTag)}
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
    </div>
  );
}
