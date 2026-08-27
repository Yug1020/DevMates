import { useState } from 'react';
import { API_BASE_URL } from '../util/constant';
import axios from 'axios';

export default function AccountSecurity({ onToast }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);



  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentPassword) {
      setErrorMsg('Please enter your current password.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    try {
      axios
      .patch(API_BASE_URL + "/user/profile/edit_password", {"old_password":currentPassword, "password":newPassword}, {withCredentials:true})
      .then(
        setLoading(true),
        setTimeout(() => {
          setLoading(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          if (onToast) onToast('Password updated successfully!');
        }, 600)       
      )
      .catch((error) =>{
        setLoading(false);
        setErrorMsg(error.response.data.message);
      })      
    } catch (error) {
      setLoading(false);
      console.log("Internal server error " + error.message)
    }
  };

  return (
    <div className="bg-[#0e141a] border border-[#1f2b38] rounded-xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#1b2633]">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[#4edea3] text-xl">
            lock
          </span>
          <h2 className="text-base sm:text-lg font-bold text-[#dde4dd]">
            Account & Security
          </h2>
        </div>
        <span className="font-mono-code text-[11px] text-[#718076] border border-[#26372d] bg-[#121d17] px-2.5 py-1 rounded">
          security.auth
        </span>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded bg-[#ffdad6]/10 border border-[#ffb4ab]/30 text-[#ffb4ab] text-xs font-mono-code flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleUpdatePassword} className="space-y-4">
        {/* Current Password */}
        <div>
          <label className="block text-xs font-mono-code text-[#8a9990] mb-1.5">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-3 pr-10 py-2 text-xs font-mono-code bg-[#080d11] border border-[#202932] rounded text-[#dde4dd] focus:border-[#4edea3] outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7e8e83] hover:text-[#dde4dd] text-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">
                {showCurrent ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        {/* New Password & Confirm New Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono-code text-[#8a9990] mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-3 pr-10 py-2 text-xs font-mono-code bg-[#080d11] border border-[#202932] rounded text-[#dde4dd] focus:border-[#4edea3] outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7e8e83] hover:text-[#dde4dd] text-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">
                  {showNew ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-code text-[#8a9990] mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-3 pr-10 py-2 text-xs font-mono-code bg-[#080d11] border border-[#202932] rounded text-[#dde4dd] focus:border-[#4edea3] outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7e8e83] hover:text-[#dde4dd] text-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">
                  {showConfirm ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Update Password Action Button */}
        <div className="flex justify-end pt-3">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-xs font-mono-code border border-[#295c73] hover:border-[#38bdf8] text-[#7dd3fc] hover:bg-[#0c2231] rounded transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-xs animate-spin">
                  progress_activity
                </span>
                <span>Updating Password...</span>
              </>
            ) : (
              <span>Update Password</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
