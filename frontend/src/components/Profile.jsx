import { useState } from 'react';
import EditProfileAndLivePreview from './EditProfileAndLivePreview';
import AccountSecurity from './AccountSecurity';
import DangerZone from './DangerZone';

export default function Profile() {
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#0a0e13] text-[#dde4dd] flex flex-col font-body selection:bg-[#4edea3]/20 selection:text-[#4edea3]">
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-8">
        {/* Page Title Header matching screen_main.png */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#dde4dd]">
            Profile & Settings
          </h1>
          <p className="text-xs sm:text-sm font-mono-code text-[#7e8e83] mt-1.5">
            Configure your identity and preferences.
          </p>
        </div>

        {/* Top Section: Edit Profile (Left) & Live Preview (Right) in One Component */}
        <EditProfileAndLivePreview onToast={showToast} />

        {/* Bottom Section: Account & Security (Left) and Danger Zone (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <AccountSecurity onToast={showToast} />
          </div>
          <div className="lg:col-span-5">
            <DangerZone onToast={showToast} />
          </div>
        </div>
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121c17] border border-[#4edea3]/40 text-[#4edea3] px-4 py-3 rounded-lg shadow-xl text-xs font-mono-code flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}