import { useSelector } from "react-redux";
import AvatarDropdown from "./Avatar";
import SearchBar from "./Search";

export default function Header() {

  const userInfo = useSelector((state)=> state.user);

  return (
    <header className="sticky h-16 border-b border-[#1e2630] bg-[#0c1015]/80 backdrop-blur-md px-4 sm:px-8 lg:pl-65 flex justify-between top-0 z-30">
      {/* Left: Search and Filter */}
      <div className="flex items-center gap-4 ml-4">
        <SearchBar></SearchBar>
      </div>

      {/* Right: Notifications Bell & User Avatar */}
      <div className="flex items-center gap-4 ml-4">
        {/* Notification Bell with Green Indicator */}
        <button
          type="button"
          className="relative p-2 rounded-lg text-[#7e8e83] hover:text-[#dde4dd] hover:bg-[#161e27] transition-colors"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[20px]">
            notifications
          </span>
          {/* Active notification green badge */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#4edea3] ring-2 ring-[#0c1015]" />
        </button>

        <div className="flex items-center gap-2 ml-2">
          <p className="text-white text-sm">Hello, {userInfo?.firstName}</p>
        </div>        
        {/* Profile picture */}
        <AvatarDropdown name={`${userInfo?.firstName}`} photo={userInfo?.photoURL} />
      </div>
    </header>
  );
}
