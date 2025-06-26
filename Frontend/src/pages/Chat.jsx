import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import Nav from "../components/Nav";
import Channel from "../components/Channel";
import { FaPlusCircle } from "react-icons/fa";

function ServerInfoView({ serverName, serverIcon }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
      <div className="max-w-md mx-auto">
        {serverIcon && (
          <img
            src={serverIcon}
            alt="Server Icon"
            className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}
        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome to {serverName || "the server"}!
        </h2>
        <p className="mb-6">
          Select a channel from the sidebar to start chatting.
        </p>
        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-white mb-2">Server Rules</h3>
            <ul className="text-sm space-y-1">
              <li>• Be respectful to others</li>
              <li>• No spamming</li>
              <li>• Keep conversations appropriate</li>
            </ul>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-white mb-2">Quick Actions</h3>
            <ul className="text-sm space-y-1">
              <li>• Create new channels</li>
              <li>• Invite friends</li>
              <li>• Customize server</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chat() {
  const location = useLocation();
  const { serverName, serverIcon, activeChannel } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [fileInput, setFileInput] = useState('')
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const currentUser = "User";
  const fileInputRef = useRef(null);
  const handleFileUploadClick = () => {
    fileInputRef.current.click();
    setFileInput(fileInputRef.current)
  };
  // Initialize socket connection 
  useEffect(() => {
    if (activeChannel === "Chat") {
      const newSocket = io("http://localhost:5000");
      setSocket(newSocket);

      newSocket.on("receive_message", (message) => {
        setMessages((prev) => [
          ...prev,
          {
            sender: message.name,
            text: message.message,
            // file:message.file,
            timestamp: new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isCurrentUser: message.name === currentUser,
          },
        ]);
      });

      return () => newSocket.disconnect();
    }
  }, [activeChannel]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !socket) return;

    const messageData = {
      message: messageInput,
      name: currentUser,
      file:fileInput,
      timestamp: new Date(),
      
    };

    socket.emit("send_message", messageData);
    setMessageInput("");
  };

  return (
    <div className="flex flex-col bg-gray-900 min-h-screen min-w-12">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gray-800 text-white h-14  border-b border-gray-700  shadow-md">
        <div className="flex items-center justify-center h-full px-4">
          <h1 className="flex items-center gap-3 text-md font-semibold">
            {serverIcon && (
              <img
                src={serverIcon}
                alt="Server Icon"
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
            <span className="truncate max-w-xs">{serverName || "Server"}</span>
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 pt-14">
        <Nav />
        <Channel />

        {/* Chat Area - Conditionally rendered */}
        <div className="flex-1 flex flex-col">
          {activeChannel === "Chat" ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length > 0 ? (
                  messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        msg.isCurrentUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex flex-col max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${
                          msg.isCurrentUser ? "items-end" : "items-start"
                        }`}
                      >
                        {!msg.isCurrentUser && (
                          <span className="text-xs font-medium text-gray-400 mb-1">
                            {msg.sender}
                          </span>
                        )}
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            msg.isCurrentUser
                              ? "bg-blue-600 rounded-br-none"
                              : "bg-gray-700 rounded-bl-none"
                          }`}
                        >
                          <p className="text-white">{msg.text}</p>
                        </div>
                        <span className="text-xs text-gray-400 mt-1">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <svg
                      className="w-12 h-12 mb-3 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p className="text-sm">Start chatting in this channel</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="sticky bottom-0 bg-gray-800 px-4 py-3 border-t border-gray-700">
                <form
                  onSubmit={handleSubmit}
                  className="flex gap-2 w-full max-w-4xl mx-auto"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                      // Handle file selection here
                      console.log("Files selected:", e.target.files);
                    }}
                  />

                  {/* Custom styled plus button */}
                  <button
                    type="button" 
                    onClick={handleFileUploadClick}
                    className="w-6 h-6 mt-2 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                  >
                    <FaPlusCircle className="text-lg" />
                  </button>

                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1  p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-sm"
                  />
                  {/* <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
                    disabled={!messageInput.trim()}
                  >
                    Send
                  </button> */}
                </form>
              </div>
            </>
          ) : (
            <ServerInfoView serverName={serverName} serverIcon={serverIcon} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
