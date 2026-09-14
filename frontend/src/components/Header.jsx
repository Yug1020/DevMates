import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import AvatarDropdown from "./Avatar";
import SearchBar from "./Search";
import { markNotifications } from "../store/notifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { API_BASE_URL } from "../util/constant.js";

const parseNotification = (item) => {
  if (!item) return { title: "Notification", message: "" };
  if (typeof item === "string") {
    if (item.toLowerCase().includes("goal")) {
      return { title: "Goal Reminder", message: item };
    }
    if (item.toLowerCase().includes("connection") || item.toLowerCase().includes("accepted")) {
      return { title: "Connection Accepted", message: item };
    }
    if (item.toLowerCase().includes("invite") || item.toLowerCase().includes("session") || item.toLowerCase().includes("pair")) {
      return { title: "Pair Programming Invite", message: item };
    }
    if (item.toLowerCase().includes("comment") || item.toLowerCase().includes("discussion") || item.toLowerCase().includes("reply")) {
      return { title: "New Discussion Comment", message: item };
    }
    return { title: "Notification", message: item };
  }
  return {
    title: item.title || item.type || item.heading || "Notification",
    message: item.message || item.text || item.description || JSON.stringify(item),
  };
};

export default function Header({ mobileSidebarOpen, onToggleMobileSidebar }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user);
  const rawNotifications = useSelector((state) => state.notifications);
  const [showAll, setShowAll] = useState(false);

  const notificationsList = useMemo(() => {
    if (!rawNotifications) return [];
    if (Array.isArray(rawNotifications)) return rawNotifications;
    if (typeof rawNotifications === "string") {
      if (rawNotifications === "No messages for you" || !rawNotifications.trim()) return [];
      return [rawNotifications];
    }
    if (typeof rawNotifications === "object") {
      if (Array.isArray(rawNotifications.items)) return rawNotifications.items;
      if (Array.isArray(rawNotifications.messages)) return rawNotifications.messages;
      if (Array.isArray(rawNotifications.notifications)) return rawNotifications.notifications;
      if (typeof rawNotifications.message === "string") return [rawNotifications.message];
      const values = Object.values(rawNotifications).filter(Boolean);
      if (values.length > 0) return values.flat();
    }
    return [];
  }, [rawNotifications]);

  const displayedNotifications = showAll ? notificationsList : notificationsList.slice(0, 3);

  const clearHandler = async(e) => {
    e.preventDefault();
    
    await axios
    .post(API_BASE_URL + "/user/clearNotification", {}, {withCredentials:true})
    .then(() => {                    
      dispatch(markNotifications());
    })
    .catch((err) => {console.log("something is wrong", err)})
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#1e2630] bg-[#0c1015]/80 px-4 backdrop-blur-md sm:px-8 md:pl-65">
      {/* Left: Hamburger + Search */}
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

      {/* Right: Notifications + User Info + Avatar */}
      <div className="ml-4 flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="relative hidden lg:flex rounded-lg p-2 text-[#7e8e83] transition-colors hover:bg-[#161e27] hover:text-[#dde4dd] cursor-pointer focus:outline-none"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">
                notifications
              </span>
              {notificationsList.length > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#4edea3] ring-2 ring-[#0c1015]" />
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-[340px] sm:w-[380px] bg-[#0c120e] border border-[#1b2b20] rounded-xl p-0 shadow-2xl z-50 text-[#dde4dd] overflow-hidden"
          >
            {/* Dropdown Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#18241c] bg-[#0e1611]">
              <div className="flex items-center gap-2">
                <span className="font-mono-code text-xs font-bold text-[#dde4dd]">
                  Notifications
                </span>
                {notificationsList.length > 0 && (
                  <span className="font-mono-code text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#122a1f] border border-[#1e4a35] text-[#4edea3]">
                    {notificationsList.length} new
                  </span>
                )}
              </div>
              {notificationsList.length > 0 && (
                <button
                  type="button"
                  onClick={clearHandler}
                  className="font-mono-code text-[11px] text-[#7e8e83] hover:text-[#dde4dd] transition-colors cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-[#18241c]/60">
              {notificationsList.length === 0 ? (
                <div className="py-8 px-4 text-center font-mono-code text-xs text-[#7e8e83]">
                  <span className="material-symbols-outlined text-2xl text-[#4edea3]/60 mb-1 block">
                    notifications_paused
                  </span>
                  No new notifications
                </div>
              ) : (
                displayedNotifications.map((item, index) => {
                  const parsed = parseNotification(item);
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3.5 hover:bg-[#121c16]/70 transition-colors cursor-default"
                    >
                      <span className="h-2 w-2 rounded-full bg-[#4edea3] shrink-0 mt-1.5 shadow-[0_0_6px_rgba(78,222,163,0.6)]" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-mono-code text-xs font-bold text-[#dde4dd] leading-snug">
                          {parsed.title}
                        </h4>
                        <p className="font-mono-code text-[11px] text-[#8a9990] mt-0.5 leading-relaxed break-words">
                          {parsed.message}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer: View All / Show Less */}
            {notificationsList.length > 3 && (
              <div className="border-t border-[#18241c] bg-[#0e1611]/80 p-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowAll((prev) => !prev);
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded text-xs font-mono-code font-semibold text-[#86948a] hover:text-[#4edea3] hover:bg-[#132018] transition-colors cursor-pointer"
                >
                  <span>{showAll ? "Show less" : "View all notifications"}</span>
                  <span className="material-symbols-outlined text-[16px]">
                    {showAll ? "expand_less" : "arrow_forward"}
                  </span>
                </button>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-2 hidden items-center gap-2 lg:flex">
          <p className="text-sm text-white">Hello, {userInfo?.firstName}</p>
        </div>
        <AvatarDropdown name={`${userInfo?.firstName}`} photo={userInfo?.photoURL} />
      </div>
    </header>
  );
}
