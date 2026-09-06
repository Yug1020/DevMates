import { Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPopover({ open, onClose }) {
  const navigate = useNavigate();

  if (!open) return null;

  const handleProceed = () => {
    onClose?.();
    navigate('/profile', { state: { focusGoal: true } });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020806]/80 px-4 backdrop-blur-sm"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="goal-required-title"
        aria-describedby="goal-required-description"
        className="w-full max-w-10/12 lg:max-w-4/12 overflow-hidden rounded-lg border border-[#2a3930] bg-[#18211d] shadow-2xl shadow-black/60"
      >
        <div className="p-5">
          <div className="flex items-start gap-3">
            <span className=" mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[#1d3b30] text-lg text-[#4edea3]">
              <Flag />
            </span>
            <div>
              <h2
                id="goal-required-title"
                className="font-mono-code text-sm font-semibold text-[#dde4dd]"
              >
                Set Your Current Goal
              </h2>
              <p
                id="goal-required-description"
                className="mt-1.5 text-xs leading-relaxed text-[#9aa89f]"
              >
                Your goal field is empty. Please add your current goal and target
                deadline in your profile so developers with similar goals can
                discover and connect with you to build and stay accountable.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded border border-[#304137] bg-[#1b2921] px-3 py-2.5">
            <span className="material-symbols-outlined mt-0.5 text-sm text-[#4edea3]">
              tips_and_updates
            </span>
            <p className="text-[11px] leading-relaxed text-[#aab7ae]">
              <span className="font-semibold text-[#c6d2ca]">Pro Tip:</span>{' '}
              A realistic deadline gives you a clear target, eliminating
              procrastination and keeping your momentum steady.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-[#2a3930] bg-[#142019] px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-[#3a4940] px-3 py-1.5 font-mono-code text-[11px] font-semibold text-[#aab7ae] transition-colors hover:border-[#738279] hover:text-[#dde4dd]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleProceed}
            className="flex items-center gap-1 rounded bg-[#4edea3] px-3 py-1.5 font-mono-code text-[11px] font-semibold text-[#07120c] transition-colors hover:bg-[#79efbd]"
          >
            Proceed
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </section>
    </div>
  );
}
