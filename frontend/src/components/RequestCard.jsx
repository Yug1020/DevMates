import axios from "axios";
import { API_BASE_URL } from '../util/constant';

const fallbackAvatar =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';

function SkillTags({ skills }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {skills.map((skill) => (
        <span
          key={skill}
          className="rounded border border-[#334039] bg-[#131b17] px-2 py-0.5 font-mono-code text-[10px] text-[#b9c9be]"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}
const relativeUnits = [
  ['yr', 365 * 24 * 60 * 60 * 1000],
  ['m', 30 * 24 * 60 * 60 * 1000],
  ['w', 7 * 24 * 60 * 60 * 1000],
  ['d', 24 * 60 * 60 * 1000],
  ['hr', 60 * 60 * 1000],
  ['min', 60 * 1000],
];

function formatRelativeTime(dateValue) {
  const createdAtMs = new Date(dateValue).getTime();

  if (!Number.isFinite(createdAtMs)) return 'Unknown time';
  const istOffset = 5.5 * 60 * 60 * 1000; 
  const differenceMs = (Date.now() + istOffset) - createdAtMs;
  if (differenceMs < 0) return 'in the future';

  for (const [unit, unitMs] of relativeUnits) {
    const value = Math.floor(differenceMs / unitMs);
    if (value >= 1) {
      return `${value}${unit}${value === 1 ? '' : 's'} ago`;
    }
  }

  return 'just now';
}

function RequestIdentity({ request, compact = false }) {
  const displayName = [request.firstName, request.lastName].filter(Boolean).join(' ') || request.name || 'Developer';
  const avatar = request.photoURL;

  return (
    <div className={`flex min-w-0 items-start ${compact ? 'gap-3' : 'gap-4'}`}>
      <img
        src={avatar}
        alt={`${displayName}'s avatar`}
        className={`${compact ? 'h-11 w-11' : 'h-20 w-20'} shrink-0 rounded border border-[#334039] object-cover`}
        onError={(event) => {
          event.currentTarget.src = fallbackAvatar;
        }}
      />
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h2 className={`${compact ? 'text-base' : 'text-xl'} font-bold tracking-tight text-[#e0e8e1]`}>
            {displayName}
          </h2>
          <span className="font-mono-code text-xs text-[#72c8ee]">{request.streetName}</span>
        </div>
        {/* {compact ? (
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-mono-code text-[11px] text-[#8fa398]">Sent {formatRelativeTime(request.createdAt)}</span>
            <SkillTags skills={request.skills} />
          </div>
        ) : (
          <>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#afbeb3]">&quot;{request.message}&quot;</p>
            <div className="mt-3">
              <SkillTags skills={request.skills} />
            </div>
          </>
        )} */}
        <div>
          <span className="font-mono-code text-xs]">
            {request.bio || "Open to connecting with developers in the network."}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ReceivedRequestCard({ request, onAccept, onReject }) {
  // const received = (id) => {
    // axios
    // .post(API_BASE_URL + "/connections/received/accept/" + id, {}, {withCredentials: true})
  // }
  return (
    <article className="rounded-md border border-[#354139] bg-[#0d1410] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
      <div className="flex gap-3">
        <RequestIdentity request={request} />
        <span className="ml-auto h-6 shrink-0 rounded-sm border border-[#36423a] bg-[#172019] px-1 font-mono-code text-[11px] text-[#b7c6bb]">
          {formatRelativeTime(request.createdAt)}
        </span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#27332c] pt-5">
        <button
          type="button"
          onClick={() => {onAccept(request._id)} } //, received(request.id)
          className="flex items-center justify-center gap-2 rounded-sm bg-[#4edea3] px-4 py-3 font-mono-code text-sm font-semibold text-[#06120d] transition-colors hover:bg-[#73f7bb]"
        >
          <span className="material-symbols-outlined text-base">check</span>
          Accept
        </button>
        <button
          type="button"
          onClick={() => onReject(request._id)}
          className="flex items-center justify-center gap-2 rounded-sm border border-[#3a4740] px-4 py-3 font-mono-code text-sm font-semibold text-[#bdc9c0] transition-colors hover:border-[#64736a] hover:bg-[#162019]"
        >
          <span className="material-symbols-outlined text-base">close</span>
          Reject
        </button>
      </div>
    </article>
  );
}

export function SentRequestCard({ request, onViewProfile, onCancel }) {
  const accepted = request.status === 'accept';

  return (
    <article className="flex flex-col gap-4 border-b border-[#26342c] px-5 py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <RequestIdentity request={request} compact />
      <div className="flex shrink-0 items-center gap-3 self-end sm:self-auto">
        <button
          type="button"
          onClick={() => onViewProfile(request)}
          className="inline-flex items-center gap-1.5 rounded border border-[#3a4b40] px-3 py-1.5 font-mono-code text-[11px] text-[#b9c9be] transition-colors hover:border-[#4edea3] hover:text-[#4edea3]"
        >
          <span className="material-symbols-outlined text-sm">visibility</span>
          View profile
        </button>
        <span
          className={`inline-flex items-center gap-1.5 rounded border px-3 py-1.5 font-mono-code text-xs ${
            accepted
              ? 'border-[#2c7154] bg-[#103323] text-[#4edea3]'
              : 'border-[#33536a] bg-[#152832] text-[#FC7C78]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">{accepted ? 'check' : 'circle'}</span>
          {request.status}
        </span>
        {accepted ? (
          <button
            type="button"
            aria-label={`Open chat with ${request.name}`}
            className="text-[#9fb0a5] transition-colors hover:text-[#4edea3]"
          >
            <span className="material-symbols-outlined text-lg">open_in_new</span>
          </button>
        ) : (
          <button
            type="button"
            aria-label={`Cancel request to ${request.name}`}
            onClick={() => onCancel(request._id)}
            className="text-[#839189] transition-colors hover:text-[#ffb4ab]"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}
      </div>
    </article>
  );
}

export function ProfilePopover({ request, onClose }) {
  if (!request) return null;
  const displayName = [request.firstName, request.lastName].filter(Boolean).join(' ') || request.name || 'Developer';
  const avatar = request.photoURL;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <section
        aria-modal="true"
        role="dialog"
        aria-label={`${request.name}'s profile`}
        className="relative w-full max-w-9/12 md:max-w-4/12 rounded-lg border border-[#3a4a40] bg-[#101813] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close profile"
          onClick={onClose}
          className="absolute right-4 top-4 text-[#809087] hover:text-[#e0e8e1]"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="flex items-center gap-4">
          <img src={avatar} alt="" className="h-16 w-16 rounded-md border border-[#3a4a40] object-cover" />
          <div>
            <h2 className="text-xl font-bold text-[#e0e8e1]">{displayName}</h2>
            <p className="mt-0.5 font-mono-code text-xs text-[#72c8ee]">{request.streetName}</p>
          </div>
        </div>
        <p className="mt-5 text-sm leading-6 text-[#aebdb2]">{request.bio || "Open to connecting with developers in the network."}</p>
        <div className="mt-5">
          <p className="mb-2 font-mono-code text-[11px] uppercase tracking-wider text-[#7e9184]">Tech stack</p>
          <SkillTags skills={request.skills} />
        </div>
      </section>
    </div>
  );
}
