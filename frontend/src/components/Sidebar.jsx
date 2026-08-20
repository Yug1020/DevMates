import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const location = useLocation();

  const mainNavItems = [
    {
      name: 'Network',
      path: '/home',
      icon: 'device_hub',
    },
    {
      name: 'Home',
      path: '/feed',
      icon: 'home',
    },
    {
      name: 'Requests',
      path: '/requests',
      icon: 'person_add',
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: 'mail',
    },
  ];

  const bottomNavItems = [
    {
      name: 'Profile',
      path: '/profile',
      icon: 'account_circle',
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: 'settings',
    },
  ];

  const isItemActive = (itemPath) => {
    if (itemPath === '/home' && (location.pathname === '/home' || location.pathname === '/network' || location.pathname === '/')) {
      return true;
    }
    return location.pathname === itemPath;
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-60 bg-[#0c1015] border-r border-[#1e2630] flex flex-col justify-between select-none transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Header & Main Nav */}
        <div>
          {/* Brand Logo & Name */}
          <div className="p-5 flex items-center gap-3 border-b border-[#1a232c]/50">
            <div className="w-9 h-9 rounded-lg bg-[#141d24] border border-[#263340] flex items-center justify-center text-[#4edea3] shadow-sm">
              <span className="material-symbols-outlined text-[22px]">
                terminal
              </span>
            </div>
            <div>
              <span className="font-headline-md text-lg font-bold tracking-tight text-[#4edea3] block leading-none">
                DevMates
              </span>
              <span className="font-mono-code text-[11px] text-[#718076] tracking-wider block mt-1">
                Developer Network
              </span>
            </div>
          </div>

          {/* Main Navigation List */}
          <nav className="py-4 space-y-1">
            {mainNavItems.map((item) => {
              const active = isItemActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => onCloseMobile && onCloseMobile()}
                  className={`flex items-center gap-3 px-5 py-2.5 text-xs font-mono-code transition-all duration-150 relative ${
                    active
                      ? 'text-[#4edea3] bg-[#121c17] font-semibold'
                      : 'text-[#7e8e83] hover:text-[#dde4dd] hover:bg-[#12181f]'
                  }`}
                >
                  {/* Left Active Indicator Bar */}
                  {active && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#4edea3]" />
                  )}
                  <span
                    className={`material-symbols-outlined text-[19px] ${
                      active ? 'text-[#4edea3]' : 'text-[#7e8e83]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Profile, Settings, and Start Session Button */}
        <div className="p-4 space-y-4 border-t border-[#1a232c]/80">
          <div className="space-y-1">
            {bottomNavItems.map((item) => {
              const active = isItemActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => onCloseMobile && onCloseMobile()}
                  className={`flex items-center gap-3 px-3 py-2 text-xs font-mono-code rounded transition-colors ${
                    active
                      ? 'text-[#4edea3] bg-[#121c17]'
                      : 'text-[#7e8e83] hover:text-[#dde4dd] hover:bg-[#12181f]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[19px]">
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Start Session CTA Button */}
          <button
            type="button"
            className="w-full py-2.5 px-4 rounded-md font-mono-label font-bold text-xs text-[#000000] bg-[#4edea3] hover:bg-[#6ffbbe] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_2px_12px_rgba(78,222,163,0.3)]"
          >
            <span className="material-symbols-outlined text-sm font-bold">
              play_arrow
            </span>
            <span>Start Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}
