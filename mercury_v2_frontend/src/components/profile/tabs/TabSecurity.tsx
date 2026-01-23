import { Shield } from 'lucide-react';

export function TabSecurity() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div>
            <h3 className="text-xl font-bold text-gray-900 font-heading">Security</h3>
            <p className="text-sm text-gray-500 mt-1">Manage your account security</p>
        </div>

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
                            <Shield width="20" height="20" className="text-gray-500" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Chrome on Windows</p>
                            <p className="text-xs text-gray-500">Seoul, KR • Active now</p>
                        </div>
                    </div>
                    <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">Current</div>
            </div>
            </div>
    </div>
  );
}
