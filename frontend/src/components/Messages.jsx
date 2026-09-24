import { useCallback, useState } from "react";
import { NetworkList } from "./NetworkList.jsx";
import { ChatBox } from "./Chatbox.jsx";
import { useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../util/constant.js";
import { useSelector } from "react-redux";

const formatMessageTime = (value) => {
  if (!value) {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const normalizeMessage = (message, currentUserId, currentUserName, otherUser) => {
  const senderId = String(message.senderId ?? "");
  const isOutgoing = senderId === String(currentUserId);
  const otherUserName = [otherUser?.firstName, otherUser?.lastName]
    .filter(Boolean)
    .join(" ") || "Unknown";

  return {
    id: message._id ?? message.id ?? `msg_${Date.now()}`,
    senderId,
    senderName: message.senderName || (isOutgoing ? currentUserName : otherUserName),
    time: message.time || formatMessageTime(message.createdAt),
    isOutgoing,
    content: message.text ?? message.content ?? message.newMessage ?? "",
  };
};

// Initial mock conversations dataset matching reference design
// const INITIAL_CONVERSATIONS = [
//   {
//     id: "1",
//     username: "sarah_chen",
//     name: "Sarah Chen",
//     avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
//     fallback: "SC",
//     status: "online",
//     lastMessage: "Looks good. Merge it.",
//     timestamp: "Just now",
//     messages: [
//       {
//         id: "m1",
//         sender: "sarah_chen",
//         senderName: "sarah_chen",
//         time: "10:42 AM",
//         isOutgoing: false,
//         content:
//           "Hey, did you check the optimization pass on the rendering engine? I was getting some weird artifacts when scaling.",
//       },
//       {
//         id: "m2",
//         sender: "me",
//         senderName: "me",
//         time: "10:45 AM",
//         isOutgoing: true,
//         content:
//           "Yeah, I saw that. I think it's a memory leak in the buffer allocation. Let me show you what I found.",
//       },
//       {
//         id: "m3",
//         sender: "me",
//         senderName: "me",
//         time: "10:46 AM",
//         isOutgoing: true,
//         isCode: true,
//         filename: "buffer_alloc.rs",
//         code: `pub fn allocate_buffer(size: usize) -> Result<Buffer, Error> {
//     // The issue was here, we weren't clearing the old struct
//     let mut buffer = Vec::with_capacity(size);

//     unsafe {
//         buffer.set_len(size);
//     }

//     Ok(Buffer { data: buffer })
// }`,
//       },
//       {
//         id: "m4",
//         sender: "sarah_chen",
//         senderName: "sarah_chen",
//         time: "10:48 AM",
//         isOutgoing: false,
//         content:
//           "Ah, good catch. The unsafe block without zeroing it out first. Looks good. Merge it.",
//       },
//     ],
//   },
//   {
//     id: "2",
//     username: "j_doe_dev",
//     name: "John Doe",
//     avatar: "",
//     fallback: "JD",
//     status: "online",
//     lastMessage: "Can you review PR #402?",
//     timestamp: "2h ago",
//     messages: [
//       {
//         id: "m201",
//         sender: "j_doe_dev",
//         senderName: "j_doe_dev",
//         time: "08:15 AM",
//         isOutgoing: false,
//         content: "Hey there! Can you review PR #402 when you get a chance?",
//       },
//       {
//         id: "m202",
//         sender: "me",
//         senderName: "me",
//         time: "08:20 AM",
//         isOutgoing: true,
//         content: "Sure, checking it out now!",
//       },
//     ],
//   },
//   {
//     id: "3",
//     username: "DevBot",
//     name: "DevBot",
//     avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=DevBot",
//     fallback: "DB",
//     status: "online",
//     lastMessage: "Build failed in staging environment.",
//     timestamp: "Yesterday",
//     messages: [
//       {
//         id: "m301",
//         sender: "DevBot",
//         senderName: "DevBot",
//         time: "Yesterday 04:30 PM",
//         isOutgoing: false,
//         content: "Build failed in staging environment.",
//       },
//       {
//         id: "m302",
//         sender: "DevBot",
//         senderName: "DevBot",
//         time: "Yesterday 04:31 PM",
//         isOutgoing: false,
//         isCode: true,
//         filename: "build_error.log",
//         code: `[ERROR] 16:30:22 - Rust compiler error: failed to resolve: use of undeclared crate or module 'tokio_util'
// --> src/server.rs:14:5
//  |
// 14 | use tokio_util::codec::Framed;
//  |     ^^^^^^^^^^ use of undeclared crate or module`,
//       },
//     ],
//   },
// ];


// Parent Messages Component
export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const currentUser = useSelector((state) => state?.user);
  const currentUserId = currentUser?.userId;
  const currentUserName = currentUser?.firstName || "You";

  const activeConversation = conversations.find((c) => c._id === selectedUserId);

  const handleMessageReceived = useCallback((targetId, message) => {
    const content = message?.text ?? message?.content ?? message?.newMessage;
    if (!content) return;

    setConversations((prev) =>
      prev.map((conversation) => {
        if (conversation._id === targetId) {
          const normalizedMessage = normalizeMessage(
            message,
            currentUserId,
            currentUserName,
            conversation
          );

          if (conversation.messages?.some((item) => item.id === normalizedMessage.id)) {
            return conversation;
          }

          return {
            ...conversation,
            lastMessage: content,
            timestamp: "Just now",
            messages: [
              ...(Array.isArray(conversation.messages) ? conversation.messages : []),
              normalizedMessage,
            ],
          };
        }
        return conversation;
      })
    );
  }, [currentUserId, currentUserName]);

  const handleSelectUser = useCallback(async (targetId) => {
    setSelectedUserId(targetId);

    try {
      const response = await axios.get(`${API_BASE_URL}/chat/prevChats`, {
        params: { targetId },
        withCredentials: true,
      });
      const savedMessages = Array.isArray(response.data?.messages)
        ? response.data.messages
        : [];

      setConversations((previousConversations) =>
        previousConversations.map((conversation) =>
          conversation._id === targetId
            ? {
                ...conversation,
                messages: savedMessages.map((message) =>
                  normalizeMessage(message, currentUserId, currentUserName, conversation)
                ),
              }
            : conversation
        )
      );
    } catch (error) {
      console.error("Unable to load this conversation:", error);
    }
  }, [currentUserId, currentUserName]);

  useEffect(() => {
    axios
    .get(API_BASE_URL + "/connections/list", { withCredentials: true })
    .then((res) => {
      const users = Array.isArray(res?.data) ? res.data : [];
      setConversations(users.map((user) => ({
        ...user,
        messages: Array.isArray(user.messages) ? user.messages : [],
      })));
    })
    .catch((err) => {console.log(err)})
  }, [])

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-[#090e11] text-[#dde4dd]">
      {/* Left Pane: NetworkList */}
      <NetworkList
        users={conversations}
        selectedUserId={selectedUserId}
        onSelectUser={handleSelectUser}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Right Pane: ChatBox */}
      <ChatBox user={activeConversation} onMessageReceived={handleMessageReceived} />
    </div>
  );
}
