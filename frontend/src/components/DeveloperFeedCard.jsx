import { useState } from 'react';

const fallbackAvatar =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';

const getGoalIcon = (skill = '', index = 0) => {
  const s = skill.toLowerCase();
  if (s.includes('rust') || s.includes('go') || s.includes('system') || s.includes('backend')) return '🎯';
  if (s.includes('react') || s.includes('ui') || s.includes('ux') || s.includes('frontend') || s.includes('three')) return '📚';
  if (s.includes('python') || s.includes('django') || s.includes('fullstack') || s.includes('solidity') || s.includes('node')) return '🤝';
  if (s.includes('kubernetes') || s.includes('aws') || s.includes('devops') || s.includes('docker') || s.includes('cloud')) return '🚀';
  if (s.includes('ai') || s.includes('ml') || s.includes('torch') || s.includes('data')) return '🧠';
  const fallbackIcons = ['🎯', '📚', '🤝', '🚀', '🧠', '⚡'];
  return fallbackIcons[index % fallbackIcons.length] || '🤝';
};

export default function DeveloperCard({
  developer,
  onConnect,
  onIgnore,
  onViewProfile,
  index = 0,
}) {
  const [connected, setConnected] = useState(developer?.isConnected || false);
  const [connecting, setConnecting] = useState(false);
  const [ignored, setIgnored] = useState(false);

  const displayName =
    [developer?.firstName, developer?.lastName].filter(Boolean).join(' ') ||
    developer?.name ||
    'Developer';

  const skills = developer?.skills || [];
  const profession = developer?.profession || "Engineer";
  const primarySkill = developer.goal || '---';
  const goalIcon = developer?.goalIcon || getGoalIcon(primarySkill, index);

  const handleConnectClick = (e) => {
    e.stopPropagation();
    if (connected || connecting) return;
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      if (onConnect) onConnect(developer);
    }, 500);
  };

  const handleIgnoreClick = (e) => {

    e.stopPropagation();
    setIgnored(true);
    if (onIgnore) onIgnore(developer);
  };

  if (ignored) {
    return null;
  }

  return (
    <div className="bg-[#10171e] border border-[#1f2b38] hover:border-[#324558] rounded-xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] group relative">
      {/* Top Section: Avatar, Name, Street / Role Title, and Top-Right Role Badge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={developer?.photoURL || fallbackAvatar}
              alt={displayName}
              className="w-12 h-12 rounded-lg object-cover border border-[#273646] shadow-sm flex-shrink-0"
              onError={(e) => {
                e.currentTarget.src = fallbackAvatar;
              }}
            />
            <div className="min-w-0">
              <h3 className="font-bold text-[#dde4dd] text-[15px] leading-snug group-hover:text-[#4edea3] transition-colors truncate">
                {displayName}
              </h3>
              <p className="text-xs font-mono-code text-[#0EA5E9] mt-0.5 truncate">
                {developer?.streetName || primarySkill}
              </p>
            </div>
          </div>

          {/* Role / Stack Badge in top right */}
          <span className="text-[11px] font-mono-code px-2.5 py-0.5 rounded bg-[#17212b] border border-[#273646] text-[#9fb0a5] tracking-wide flex-shrink-0">
            {profession}
          </span>
        </div>

        {/* Bio Text: Fixed height with 3-line clamping and truncation; empty space maintained for consistency */}
        <div className="h-[4.5rem] mb-4">
          <p className="text-xs font-body-sm text-[#8a9990] line-clamp-3 leading-relaxed">
            {developer?.bio || 'Open to connecting with developers in the network.'}
          </p>
        </div>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4 min-h-[30px]">
          {skills.map((skill, idx) => {
            const isPrimary = idx === 0;
            return (
              <span
                key={skill}
                className={`text-[11px] font-mono-code px-2.5 py-1 rounded border transition-colors ${
                  isPrimary
                    ? 'bg-[#102a20] border-[#4edea3]/40 text-[#4edea3]'
                    : 'bg-[#161e27] border-[#263340] text-[#9fb0a5]'
                }`}
              >
                {skill}
              </span>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Goal Container & Actions */}
      <div className="space-y-3 pt-2 border-t border-[#1a2531]/80">
        {/* Goal / Availability Box using skill's first element */}
        <div className="bg-[#0b1015] border border-[#1d2732] rounded-md px-3 py-2 flex items-center justify-between text-xs font-mono-code">
          <div className="flex items-center gap-2 text-[#c2d0c6] truncate mr-2">
            <span className="text-sm">{goalIcon}</span>
            <span className="truncate">{primarySkill}</span>
          </div>
          {/* Glowing live status indicator dot only if user is online */}
          {developer?.isOnline && (
            <span className="relative flex h-2 w-2 flex-shrink-0" title="Online now">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4edea3]"></span>
            </span>
          )}
        </div>

        {/* Action Buttons: View Profile, Ignore (#FC7C78), Connect */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewProfile && onViewProfile(developer)}
            className="flex-1 py-1.5 px-2 text-xs font-mono-code text-[#7e8e83] hover:text-[#dde4dd] hover:bg-[#182029] rounded transition-colors text-center cursor-pointer truncate"
          >
            View Profile
          </button>

          <button
            type="button"
            onClick={handleIgnoreClick}
            className="py-1.5 px-3 text-xs font-mono-code text-[#FC7C78] border border-[#FC7C78]/30 hover:border-[#FC7C78] hover:bg-[#FC7C78]/10 rounded transition-colors text-center cursor-pointer flex items-center justify-center gap-1"
            title="Ignore Developer"
          >
            Ignore
          </button>

          <button
            type="button"
            onClick={handleConnectClick}
            disabled={connected || connecting}
            className={`flex-1 py-1.5 px-3 text-xs font-mono-code font-semibold rounded border transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              connected
                ? 'bg-[#161b22] border-[#0EA5E9]/50 text-[#0EA5E9] cursor-default'
                : 'bg-[#0f241c]/80 border-[#2b5a45] text-[#4edea3] hover:bg-[#4edea3] hover:text-[#000000] hover:border-[#4edea3]'
            }`}
          >
            {connecting ? (
              <>
                <span className="material-symbols-outlined text-xs animate-spin">
                  progress_activity
                </span>
                <span>Connecting</span>
              </>
            ) : connected ? (
              <>
                {/* <span className="material-symbols-outlined text-xs">done</span> */}
                <span>Request Sent</span>
              </>
            ) : (
              <span>Connect</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
