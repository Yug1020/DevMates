import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const location = useLocation();

  const mainNavItems = [
    {
      name: 'Home',
      path: '/',
      icon: 'home',
    },
    {
      name: 'Network',
      path: '/network',
      icon: 'device_hub',
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

  useEffect(() => {
    const closeIfDesktop = () => {
      if (window.matchMedia('(min-width: 768px)').matches) {
        onCloseMobile?.();
      }
    };
    window.addEventListener('resize', closeIfDesktop);
    return () => window.removeEventListener('resize', closeIfDesktop);
  }, [onCloseMobile]);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCloseMobile?.();
    };
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen, onCloseMobile]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out md:hidden ${
          mobileOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      <aside
        id="app-sidebar"
        className={`fixed top-0 left-0 z-50 flex h-screen w-61 select-none flex-col justify-between border-r border-[#1e2630] bg-[#0c1015] transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between gap-3 border-b border-[#1a232c]/50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#263340] bg-[#141d24] text-[#4edea3] shadow-sm">
                <span className="material-symbols-outlined text-[22px]">
                  terminal
                </span>
              </div>
              <div>
                <span className="font-headline-md block text-lg leading-none font-bold tracking-tight text-[#4edea3]">
                  DevMates
                </span>
                <span className="font-mono-code mt-1 block text-[11px] tracking-wider text-[#718076]">
                  Developer Network
                </span>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#7e8e83] transition-colors hover:bg-[#161e27] hover:text-[#dde4dd] md:hidden"
              aria-label="Close navigation menu"
              onClick={onCloseMobile}
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          <nav className="space-y-1 py-4">
            {mainNavItems.map((item) => {
              const active = isItemActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => onCloseMobile && onCloseMobile()}
                  className={`font-mono-code relative flex items-center gap-3 px-5 py-2.5 text-xs transition-all duration-150 ${
                    active
                      ? 'bg-[#121c17] font-semibold text-[#4edea3]'
                      : 'text-[#7e8e83] hover:bg-[#12181f] hover:text-[#dde4dd]'
                  }`}
                >
                  {active && (
                    <span className="absolute top-0 bottom-0 left-0 w-1 bg-[#4edea3]" />
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

        <div className="space-y-4 border-t border-[#1a232c]/80 p-4">
          <div className="space-y-1">
            {bottomNavItems.map((item) => {
              const active = isItemActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => onCloseMobile && onCloseMobile()}
                  className={`font-mono-code flex items-center gap-3 rounded px-3 py-2 text-xs transition-colors ${
                    active
                      ? 'bg-[#121c17] text-[#4edea3]'
                      : 'text-[#7e8e83] hover:bg-[#12181f] hover:text-[#dde4dd]'
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

          <button
            type="button"
            className="font-mono-label flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#4edea3] px-4 py-2.5 text-xs font-bold text-[#000000] shadow-[0_2px_12px_rgba(78,222,163,0.3)] transition-all hover:bg-[#6ffbbe] active:scale-[0.98]"
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
