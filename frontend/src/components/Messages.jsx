import { useCallback, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { NetworkList } from "./NetworkList.jsx";
import { ChatBox } from "./Chatbox.jsx";
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

export default function Messages() {
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(location.state?.targetId || null);
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

  const handleBackToConversations = useCallback(() => {
    setSelectedUserId(null);
  }, []);

  useEffect(() => {
    axios
      .get(API_BASE_URL + "/connections/list", { withCredentials: true })
      .then((res) => {
        const users = Array.isArray(res?.data) ? res.data : [];
        setConversations(
          users.map((user) => ({
            ...user,
            messages: Array.isArray(user.messages) ? user.messages : [],
          }))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (location.state?.targetId) {
      handleSelectUser(location.state.targetId);
    }
  }, [location.state?.targetId, handleSelectUser]);

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-[#090e11] text-[#dde4dd]">
      {/* Left Pane: NetworkList (Takes full screen on mobile when no conversation is selected; hidden on mobile when chat is open) */}
      <div
        className={`h-full ${
          selectedUserId ? "hidden md:flex" : "flex w-full"
        } md:w-80 md:shrink-0`}
      >
        <NetworkList
          users={conversations}
          selectedUserId={selectedUserId}
          onSelectUser={handleSelectUser}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Right Pane: ChatBox (Hidden on mobile when no conversation is selected; takes full screen on mobile when chat is open) */}
      <div
        className={`h-full ${
          selectedUserId ? "flex w-full" : "hidden md:flex"
        } md:flex-1 min-w-0`}
      >
        <ChatBox
          user={activeConversation}
          onMessageReceived={handleMessageReceived}
          onBack={handleBackToConversations}
        />
      </div>
    </div>
  );
}
