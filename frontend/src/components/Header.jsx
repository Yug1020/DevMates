import { useSelector } from "react-redux";
import AvatarDropdown from "./Avatar";
import SearchBar from "./Search";

export default function Header({ mobileSidebarOpen, onToggleMobileSidebar }) {
  const userInfo = useSelector((state) => state.user);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#1e2630] bg-[#0c1015]/80 px-4 backdrop-blur-md sm:px-8 md:pl-65">
      <div className="ml-0 flex min-w-0 items-center gap-2 sm:gap-4 md:ml-4">
        <button
          type="button"
          className="relative z-[60] inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#7e8e83] transition-colors hover:bg-[#161e27] hover:text-[#dde4dd] md:hidden"
          aria-label={mobileSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileSidebarOpen}
          aria-controls="app-sidebar"
          onClick={onToggleMobileSidebar}
        >
          <span className="material-symbols-outlined text-[24px]">
            {mobileSidebarOpen ? "close" : "menu"}
          </span>
        </button>
        <SearchBar />
      </div>

      <div className="ml-4 flex items-center gap-4">
        <button
          type="button"
          className="relative hidden lg:flex rounded-lg p-2 text-[#7e8e83] transition-colors hover:bg-[#161e27] hover:text-[#dde4dd]"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[20px]">
            notifications
          </span>
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#4edea3] ring-2 ring-[#0c1015]" />
        </button>

        <div className="ml-2 hidden items-center gap-2 lg:flex">
          <p className="text-sm text-white">Hello, {userInfo?.firstName}</p>
        </div>
        <AvatarDropdown name={`${userInfo?.firstName}`} photo={userInfo?.photoURL} />
      </div>
    </header>
  );
}
