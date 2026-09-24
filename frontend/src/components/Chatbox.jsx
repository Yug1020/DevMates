import { useState, useRef, useEffect } from "react";
import {
  Paperclip,
  Send,
  MoreVertical,
  Check,
  Copy,
  CodeIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { connectionSocketIo } from "../util/socket.js";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../util/constant.js";

function CodeBlock({ filename, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Basic syntax highlighter for Rust / code snippets
  const renderHighlightedCode = (text) => {
    return text.split("\n").map((line, idx) => {
      // Comment line
      if (line.trim().startsWith("//") || line.trim().startsWith("#")) {
        return (
          <div key={idx} className="text-[#64748b] italic">
            {line}
          </div>
        );
      }

      // Tokenization for keywords, types, methods
      const tokens = line.split(
        /(\bpub\b|\bfn\b|\blet\b|\bmut\b|\bunsafe\b|\bOk\b|\bResult\b|\bBuffer\b|\bError\b|\busize\b|\bVec\b|\bwith_capacity\b|\bset_len\b|\bdata\b|\bsize\b|\buse\b|->|[{}(),;:])/g
      );

      return (
        <div key={idx} className="leading-relaxed">
          {tokens.map((token, tIdx) => {
            if (["pub", "fn", "let", "mut", "unsafe", "Ok", "use"].includes(token)) {
              return (
                <span key={tIdx} className="text-[#38bdf8] font-semibold">
                  {token}
                </span>
              );
            }
            if (["Result", "Buffer", "Error", "usize", "Vec"].includes(token)) {
              return (
                <span key={tIdx} className="text-[#4edea3] font-semibold">
                  {token}
                </span>
              );
            }
            if (["with_capacity", "set_len"].includes(token)) {
              return (
                <span key={tIdx} className="text-[#34d399]">
                  {token}
                </span>
              );
            }
            if (["size", "data"].includes(token)) {
              return (
                <span key={tIdx} className="text-[#fde047]">
                  {token}
                </span>
              );
            }
            if (["{", "}", "(", ")", "->", ",", ";", ":"].includes(token)) {
              return (
                <span key={tIdx} className="text-[#cbd5e1]">
                  {token}
                </span>
              );
            }
            return <span key={tIdx} className="text-[#dde4dd]">{token}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="w-full max-w-2xl rounded-lg border border-[#1a262c] bg-[#0c1317] overflow-hidden my-1 shadow-lg font-mono-code text-xs">
      {/* Code Header */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#182329] bg-[#0a1014]">
        <div className="flex items-center gap-2">
          <CodeIcon className="w-3.5 h-3.5 text-[#4edea3]" />
          <span className="text-[11px] font-semibold text-[#a6b5aa]">
            {filename || "code_snippet"}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-[#7e8e83] hover:text-[#4edea3] hover:bg-[#121c20] transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#4edea3]" />
              <span className="text-[#4edea3]">copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-3.5 overflow-x-auto text-[12px] font-mono-code leading-5 selection:bg-[#4edea3]/20 selection:text-[#4edea3]">
        {renderHighlightedCode(code)}
      </div>
    </div>
  );
}

export function ChatBox({ user, onMessageReceived }) {
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const targetId = user?._id;
  const userId = useSelector((state) => state?.user?.userId);
  const firstName = useSelector((state) => state?.user?.firstName);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [user?.messages?.length]);

  useEffect(() => {
    if (!userId || !targetId) return undefined;

    const socket = connectionSocketIo();
    socketRef.current = socket;

    const handleMessageReceived = (message) => {
      // The sender adds the saved API response locally. Ignore its echoed socket event.
      if (String(message?.senderId) === String(userId)) return;
      onMessageReceived(targetId, message);
    };

    socket.on("messageReceived", handleMessageReceived);
    socket.emit("joinchat", { userId, targetId, senderName: firstName });

    return () => {
      socket.off("messageReceived", handleMessageReceived);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, targetId, firstName, onMessageReceived]);

  const handleSend = async (e) => {
    e?.preventDefault();
    const messageText = inputMessage.trim();
    const socket = socketRef.current;

    if (!messageText || !userId || !targetId || isSending) return;

    setIsSending(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/chat/sendTxt`,
        { receiverId: targetId, message: messageText },
        { withCredentials: true }
      );

      // Render the database record immediately, then notify the other user in real time.
      onMessageReceived(targetId, response.data.message);
      socket?.emit("sendmsg", {
        senderName: firstName,
        newMessage: messageText,
        userId,
        targetId,
      });
      setInputMessage("");
    } catch (error) {
      console.error("Unable to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#090e11] text-[#52645c] font-mono-code text-xs">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090e11] min-w-0">
      {/* Header */}
      <div className="h-14 px-4 sm:px-6 border-b border-[#1a2328] bg-[#070b0e]/90 backdrop-blur flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-8 w-8 rounded-md border border-[#1a252b] bg-[#0d1418]">
              {user.photoURL ? (
                <AvatarImage src={user.photoURL} alt={user.username} className="object-cover" />
              ) : null}
              <AvatarFallback className="bg-[#121c21] text-[#a6b5aa] font-mono-code text-xs font-semibold rounded-md">
                {user.photoURL || user.firstName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {user.status === "online" && (
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#4edea3] ring-2 ring-[#070b0e]" />
            )}
          </div>

          <div>
            <h2 className="text-xs font-mono-code font-bold text-[#dde4dd]">
              {user.firstName + " " + user.lastName}
            </h2>
            <div className="flex items-center gap-1.5 text-[10px] font-mono-code text-[#4edea3]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4edea3]" />
              <span>online</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="p-1.5 rounded text-[#7e8e83] hover:text-[#dde4dd] hover:bg-[#121a1f] transition-colors cursor-pointer"
          title="Conversation options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Message History Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {/* Date Divider: Today */}
        <div className="flex items-center justify-center my-3 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#1a2328]" />
          </div>
          <span className="relative px-3 py-0.5 rounded border border-[#1e292f] bg-[#0f161a] text-[11px] font-mono-code text-[#7e8e83]">
            Today
          </span>
        </div>

        {/* Message Items */}
        {user.messages?.map((msg) => {
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isOutgoing ? "items-end" : "items-start"}`}
            >
              {/* Message Header (Sender & Timestamp) */}
              <div
                className={`text-[11px] font-mono-code text-[#7e8e83] mb-1.5 flex items-center gap-2 ${
                  msg.isOutgoing ? "justify-end" : "justify-start"
                }`}
              >
                {!msg.isOutgoing && (
                  <span className="font-semibold text-[#a6b5aa]">{msg.senderName}</span>
                )}
                <span>{msg.time}</span>
                {msg.isOutgoing && (
                  <span className="font-semibold text-[#4edea3]">{msg.senderName}</span>
                )}
              </div>

              {/* Code Block or Text Bubble */}
              {msg.isCode ? (
                <CodeBlock filename={msg.filename} code={msg.code} />
              ) : (
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-xl px-4 py-3 text-xs sm:text-[13px] font-mono-code leading-relaxed shadow-sm ${
                    msg.isOutgoing
                      ? "bg-[#1c272c] border border-[#27373f] text-[#dde4dd]"
                      : "bg-[#131c20] border border-[#1f2c33] text-[#dde4dd]"
                  }`}
                >
                  {msg.content}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (Bottom) */}
      <div className="p-3 sm:p-4 border-t border-[#1a2328] bg-[#070b0e] shrink-0">
        <form
          onSubmit={handleSend}
          className="rounded-lg border border-[#1f2c33] bg-[#0c1418] p-1.5 flex items-center gap-2 shadow-inner focus-within:border-[#4edea3]/50 focus-within:ring-1 focus-within:ring-[#4edea3]/30 transition-all"
        >
          {/* Attachment button */}
          <button
            type="button"
            className="p-1.5 sm:p-2 rounded text-[#7e8e83] hover:text-[#dde4dd] hover:bg-[#152026] transition-colors cursor-pointer shrink-0"
            title="Attach file or code snippet"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Terminal prompt symbol */}
          <span className="font-mono-code text-xs sm:text-sm text-[#4edea3] pl-0.5 select-none font-bold">
            &gt;
          </span>

          {/* Text Input */}
          <input
            type="text"
            className="w-full flex flex-row items-center justify-between border-none text-xs sm:text-[13px] font-mono- text-[#dde4dd] placeholder:text-[#4b5b54] focus:outline-none px-1 py-1"
            placeholder="Type a message or paste code..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="h-8 w-8 rounded bg-[#4edea3] hover:bg-[#3cd092] disabled:opacity-40 disabled:hover:bg-[#4edea3] text-[#081b12] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            title="Send message"
          >
            <Send className="w-3.5 h-3.5 fill-current" />
          </button>
        </form>

        {/* Helper subtext below input */}
        <div className="mt-2 flex items-center justify-between gap-2 text-[10px] font-mono-code text-[#52645c] px-1">
          <span className="flex items-center gap-1">
            <span className="text-[#4edea3]">&lt;&gt;</span> Markdown supported
          </span>
          <span className="flex items-center gap-1">
            <span className="text-[#4edea3] font-bold">↵</span> Enter to send, Shift+Enter for new line
          </span>
        </div>
      </div>
    </div>
  );
}
