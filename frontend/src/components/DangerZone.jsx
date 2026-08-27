import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetUser } from '../store/userSlice';
import { API_BASE_URL } from '../util/constant';
import axios from 'axios';

export default function DangerZone({ onToast }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1 = Confirmation, 2 = Password Entry
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleOpenModal = () => {
    setModalStep(1);
    setPassword('');
    setErrorMsg('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalStep(1);
    setPassword('');
    setErrorMsg('');
  };

  const handleProceedToPassword = () => {
    setModalStep(2);
    setErrorMsg('');
  };

  const handleConfirmDelete = async(e) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg('Please enter your password to confirm account deletion.');
      return;
    }

    setDeleting(true);

    try {
      await axios.delete(`${API_BASE_URL}/user/profile/delete`, {
        data: { password },
        withCredentials: true,
      });

      setShowModal(false);
      dispatch(resetUser());
      if (onToast) onToast('Your account has been deleted.');
      navigate('/login');
    } catch (error) {
      setErrorMsg(error.response?.data || 'Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-[#0e141a] border border-[#3b1d22] rounded-xl p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-2.5 pb-4 mb-2 border-b border-[#2d1a1e]">
          <span className="material-symbols-outlined text-[#FC7C78] text-xl">
            warning
          </span>
          <h2 className="text-base sm:text-lg font-bold text-[#FC7C78]">Danger Zone</h2>
        </div>

        <p className="text-xs font-mono-code text-[#a3a3a3] mt-2 mb-5">
          Once you delete your account, there is no going back. Please be certain.
        </p>

        {/* Delete Account Button (Only option in Danger Zone as requested) */}
        <button
          type="button"
          onClick={handleOpenModal}
          className="w-full py-3 px-4 rounded-lg bg-[#271418] hover:bg-[#381a20] border border-[#5e272e] hover:border-[#FC7C78]/60 text-[#FC7C78] font-mono-code text-xs font-semibold flex items-center justify-between transition-all cursor-pointer group shadow-sm"
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#FC7C78]">
              delete_forever
            </span>
            <span>Delete Account Permanently</span>
          </span>
          <span className="material-symbols-outlined text-sm opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
            arrow_forward
          </span>
        </button>
      </div>

      {/* Confirmation & Password Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150"
          onClick={handleCloseModal}
        >
          <div
            className="w-full max-w-3/12 bg-[#12181f] border border-[#3b2428] rounded-xl p-6 shadow-2xl animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#281b20]">
              <div className="flex items-center gap-2 text-[#FC7C78]">
                <span className="material-symbols-outlined text-lg">
                  {modalStep === 1 ? 'warning' : 'lock'}
                </span>
                <h3 className="font-bold text-sm font-mono-code text-[#dde4dd]">
                  {modalStep === 1 ? 'Delete Account Permanently?' : 'Confirm With Password'}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-[#86948a] hover:text-[#dde4dd] text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Step 1: Confirmation prompt */}
            {modalStep === 1 && (
              <div className="space-y-4">
                <p className="text-xs font-mono-code text-[#aebdb2] leading-relaxed">
                  Are you absolutely sure you want to permanently delete your DevMates account?
                  This action <strong className="text-[#FC7C78]">cannot be undone</strong> and will
                  permanently remove your profile, skills, connections, and chat history.
                </p>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#231a20]">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-xs font-mono-code text-[#86948a] hover:text-[#dde4dd] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToPassword}
                    className="px-4 py-2 text-xs font-mono-code font-bold bg-[#FC7C78] hover:bg-[#ff9692] text-[#000000] rounded transition-all cursor-pointer"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Password entry prompt */}
            {modalStep === 2 && (
              <form onSubmit={handleConfirmDelete} className="space-y-4">
                <p className="text-xs font-mono-code text-[#aebdb2] leading-relaxed">
                  Please enter your password to authenticate and permanently delete your account.
                </p>

                {errorMsg && (
                  <div className="p-2.5 rounded bg-[#ffdad6]/10 border border-[#ffb4ab]/30 text-[#ffb4ab] text-xs font-mono-code flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">error</span>
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono-code text-[#8a9990] mb-1.5">
                    Your Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoFocus
                    className="w-full px-3 py-2 text-xs font-mono-code bg-[#080d11] border border-[#3b2428] focus:border-[#FC7C78] rounded text-[#dde4dd] outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#231a20]">
                  <button
                    type="button"
                    onClick={() => setModalStep(1)}
                    className="px-4 py-2 text-xs font-mono-code text-[#86948a] hover:text-[#dde4dd] transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={deleting}
                    className="px-4 py-2 text-xs font-mono-code font-bold bg-[#FC7C78] hover:bg-[#ff9692] text-[#000000] rounded transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {deleting ? (
                      <>
                        <span className="material-symbols-outlined text-xs animate-spin">
                          progress_activity
                        </span>
                        <span>Deleting Account...</span>
                      </>
                    ) : (
                      <span>Delete Account</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
