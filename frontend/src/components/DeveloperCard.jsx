import { useState } from 'react';

export default function DeveloperCard({ developer, onConnect, onViewProfile }) {
  const [connected, setConnected] = useState(developer.isConnected || false);
  const [connecting, setConnecting] = useState(false);

  const handleConnectClick = (e) => {
    e.stopPropagation();
    if (connected) return;
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      if (onConnect) onConnect(developer);
    }, 600);
  };

  console.log("skill[0]", developer.skills[0])

  return (
    <div className="bg-[#12181f] border border-[#202932] hover:border-[#334250] rounded-lg p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)] group relative">
      {/* Top Section: Avatar, Name, Title, and Role Badge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <img
              src={developer.photoURL}
              alt={developer.name}
              className="w-12 h-12 rounded-lg object-cover border border-[#2c3744] shadow-sm flex-shrink-0"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';
              }}
            />
            <div>
              <h3 className="font-bold text-[#dde4dd] text-[15px] leading-snug group-hover:text-[#4edea3] transition-colors">
                {developer.firstName + " " + developer.lastName} 
              </h3>
              <p className="text-xs font-mono-code text-[#7e8e83] mt-0.5">
                {developer.skills[0]}
              </p>
            </div>
          </div>

          {/* Role Badge */}
          <span className="text-[11px] font-mono-code px-2 py-0.5 rounded bg-[#182029] border border-[#2c3744] text-[#9fb0a5] tracking-wide flex-shrink-0">
            {developer.skills[0]}
          </span>
        </div>

        {/* Bio Text */}
        <p className="text-xs font-body-sm text-[#8a9990] line-clamp-3 leading-relaxed mb-4 min-h-[50px]">
          {developer.bio}
        </p>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {developer.skills.map((skill, index) => {
            const isPrimary = index === 0;
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
      <div className="space-y-3 pt-1 border-t border-[#1a232c]/60">
        {/* Goal / Availability Box */}
        <div className="bg-[#0b1015] border border-[#1e2833] rounded-md px-3 py-2 flex items-center justify-between text-xs font-mono-code">
          <div className="flex items-center gap-2 text-[#c2d0c6] truncate mr-2">
            <span className="text-sm">{developer.goalIcon}</span>
            <span className="truncate">{developer.skills[1]}</span>
          </div>
          {developer.hasLiveDot && (
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4edea3]"></span>
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewProfile && onViewProfile(developer)}
            className="flex-1 py-1.5 px-3 text-xs font-mono-code text-[#7e8e83] hover:text-[#dde4dd] hover:bg-[#182029] rounded transition-colors text-center cursor-pointer"
          >
            View Profile
          </button>
          <button
            type="button"
            onClick={handleConnectClick}
            disabled={connected || connecting}
            className={`flex-1 py-1.5 px-3 text-xs font-mono-code font-semibold rounded border transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              connected
                ? 'bg-[#102a20] border-[#4edea3]/50 text-[#4edea3] cursor-default'
                : 'bg-[#0f241c]/70 border-[#2b5a45] text-[#4edea3] hover:bg-[#4edea3] hover:text-[#000000] hover:border-[#4edea3]'
            }`}
          >
            {connecting ? (
              <>
                <span className="material-symbols-outlined text-xs animate-spin">
                  progress_activity
                </span>
                <span>Chat</span>
              </>
            ) : connected ? (
              <>
                <span className="material-symbols-outlined text-xs">done</span>
                <span>Chat</span>
              </>
            ) : (
              <span>Chat</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
