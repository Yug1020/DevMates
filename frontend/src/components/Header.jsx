export default function Header({ onOpenMobileSidebar, searchQuery, setSearchQuery }) {
  return (
    <header className="h-16 border-b border-[#1e2630] bg-[#0c1015]/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        {/* Mobile Hamburger Menu Button */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-1.5 rounded-md text-[#7e8e83] hover:text-[#dde4dd] hover:bg-[#161e27] transition-colors focus:outline-none"
          title="Open Navigation"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        {/* Search Input Box */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5b6a60]">
            <span className="material-symbols-outlined text-[18px]">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search developers, skills..."
            className="w-full pl-9 pr-3 py-1.5 text-xs font-mono-code rounded border border-[#202932] bg-[#0e1318] text-[#dde4dd] placeholder-[#4e5c53] focus:border-[#4edea3] focus:ring-1 focus:ring-[#4edea3] transition-all"
          />
        </div>
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

        {/* User Profile Avatar */}
        <div className="w-8 h-8 rounded-full border border-[#2c3744] overflow-hidden bg-[#161e27] flex items-center justify-center cursor-pointer hover:border-[#4edea3] transition-colors">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
