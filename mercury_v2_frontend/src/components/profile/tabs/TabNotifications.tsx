import { type NotificationSettings } from '@/types/api/user';
import { cn } from '@/utils/cn';

interface TabNotificationsProps {
  notifications: NotificationSettings;
  onChange: (field: keyof NotificationSettings, value: boolean) => void;
}

export function TabNotifications({ notifications, onChange }: TabNotificationsProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div>
            <h3 className="text-xl font-bold text-gray-900 font-heading">Notifications</h3>
            <p className="text-sm text-gray-500 mt-1">Manage what emails and alerts you receive</p>
        </div>

        <div className="space-y-6">
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
                        onClick={() => onChange('email_creation_finished', !notifications.email_creation_finished)}
                        className={cn("w-12 h-6 rounded-full transition-colors relative", notifications.email_creation_finished ? "bg-primary-600" : "bg-gray-300")}
                        >
                            <span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm", notifications.email_creation_finished ? "left-7" : "left-1")} />
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
                        onClick={() => onChange('email_weekly_report', !notifications.email_weekly_report)}
                        className={cn("w-12 h-6 rounded-full transition-colors relative", notifications.email_weekly_report ? "bg-primary-600" : "bg-gray-300")}
                        >
                            <span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm", notifications.email_weekly_report ? "left-7" : "left-1")} />
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
                        onClick={() => onChange('app_browser_notification', !notifications.app_browser_notification)}
                        className={cn("w-12 h-6 rounded-full transition-colors relative", notifications.app_browser_notification ? "bg-primary-600" : "bg-gray-300")}
                        >
                            <span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm", notifications.app_browser_notification ? "left-7" : "left-1")} />
                        </button>
                    </div>
            </div>
        </div>
    </div>
  );
}
