import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function NetworkList({ users, selectedUserId, onSelectUser, searchQuery, onSearchChange }) {
  const filteredUsers = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      // u.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full sm:w-80 md:w-80 lg:w-80 shrink-0 border-r border-[#1a2328] bg-[#070b0e] flex flex-col h-full select-none">
      {/* Search Header */}
      <div className="p-3 border-b border-[#1a2328]">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-[#52645c] pointer-events-none" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 h-9 bg-[#0f1519] border-[#1d272e] text-[#dde4dd] placeholder:text-[#52645c] text-xs font-mono-code rounded-md focus-visible:ring-1 focus-visible:ring-[#4edea3]/50 focus-visible:border-[#4edea3]/50"
          />
        </div>
      </div>

      {/* Scrollable User List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#131b20]">
        {filteredUsers.length === 0 ? (
          <div className="p-6 text-center text-xs font-mono-code text-[#52645c]">
            No conversations found
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isSelected = user?._id === selectedUserId;

            return (
              <button
                key={user._id}
                type="button"
                onClick={() => onSelectUser(user?._id)}
                className={`w-full text-left p-3 flex items-start gap-3 transition-colors cursor-pointer
                    ${
                        isSelected
                          ? "bg-[#10171c] border-l-2 border-surface-tint"
                          : "hover:bg-[#0c1216] border-l-2 border-transparent"
                    }                    
                `}
              >
                {/* Avatar with Online Dot */}
                <div className="relative shrink-0 mt-0.5">
                  <Avatar className="h-9 w-9 rounded-md border border-[#1a252b] bg-[#0d1418]">
                    {user.photoURL ? (
                      <AvatarImage src={user.photoURL} alt={user.username} className="object-cover" />
                    ) : null}
                    <AvatarFallback className="bg-[#121c21] text-[#a6b5aa] font-mono-code text-xs font-semibold rounded-md">
                      {user.firstName.slice(0, 2).toUpperCase()} 
                      {/* user.photoURL ||  */}
                    </AvatarFallback>
                  </Avatar>
                  {user.status === "online" && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#surface-tint] ring-2 ring-[#070b0e]" />
                  )}
                </div>

                {/* User Info & Message Snippet */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span
                      className={`text-xs font-mono-code font-semibold truncate ${
                        isSelected ? "text-[#4edea3]" : "text-[#dde4dd]"
                      }`}
                    >
                      {user.firstName + " " + user.lastName}
                    </span>
                    <span className="text-[10px] font-mono-code text-[#5e7067] shrink-0">
                      {user.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono-code text-[#7e8e83] truncate leading-tight">
                    {user.lastMessage}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}