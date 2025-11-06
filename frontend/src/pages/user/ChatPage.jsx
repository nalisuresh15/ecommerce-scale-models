import React, { useState, useEffect, useRef } from "react";

// --- STYLES ---
const style = {
  pageContainer: {
    minHeight: "calc(100vh - 62px)", // Full height minus navbar
    backgroundColor: "#1f2937",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  chatWindow: {
    width: "100%",
    maxWidth: "700px",
    height: "70vh", 
    backgroundColor: "#374151",
    borderRadius: "16px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden", 
  },
  chatHeader: {
    padding: "16px 20px",
    backgroundColor: "#4b5563",
    borderBottom: "1px solid #6b7280",
  },
  headerText: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#f3f4f6",
    margin: 0,
  },
  headerSubtext: {
    fontSize: "14px",
    color: "#10b981", // Green dot for "Online"
    margin: "4px 0 0 0",
  },
  messageArea: {
    flex: 1,
    padding: "20px",
    overflowY: "auto", 
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  // Styles for individual messages
  messageBubble: {
    padding: "10px 14px",
    borderRadius: "18px",
    maxWidth: "75%",
    fontSize: "16px",
    lineHeight: "1.5",
  },
  userMessage: {
    backgroundColor: "#3b82f6", // Blue
    color: "#ffffff",
    alignSelf: "flex-end", // Align to the right
    borderBottomRightRadius: "4px",
  },
  supportMessage: {
    backgroundColor: "#6b7280", // Gray
    color: "#f3f4f6",
    alignSelf: "flex-start", // Align to the left
    borderBottomLeftRadius: "4px",
  },
  // Styles for the input area
  inputArea: {
    display: "flex",
    gap: "10px",
    padding: "16px 20px",
    borderTop: "1px solid #4b5563",
    backgroundColor: "#374151",
  },
  chatInput: {
    flex: 1,
    border: "1px solid #6b7280",
    borderRadius: "20px",
    padding: "10px 16px",
    color: "#f3f4f6",
    backgroundColor: "#4b5563",
    outline: "none",
    fontSize: "16px",
  },
  sendButton: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    padding: "10px 16px",
    borderRadius: "20px",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
};
// --- END STYLES ---

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "support",
      text: "Hello! Welcome to E-commerce Support. How can I assist you with your order today?",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messageAreaRef = useRef(null); 

  // Function to automatically scroll to the bottom when new messages arrive
  const scrollToBottom = () => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim() === "") return;

    // 1. Add the user's message
    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: newMessage,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setNewMessage("");

    // 2. Simulate a support reply after a short delay
    setTimeout(() => {
      const supportReply = {
        id: Date.now() + 1,
        sender: "support",
        text: "Thank you for reaching out. We are now processing your request and a specialist will join the chat in a moment.",
      };
      setMessages((prevMessages) => [...prevMessages, supportReply]);
    }, 1500);
  };

  return (
    <div style={style.pageContainer}>
      <div style={style.chatWindow}>
        {/* Header */}
        <div style={style.chatHeader}>
          <p style={style.headerText}>Support Chat</p>
          <p style={style.headerSubtext}>● Support Agent Online</p>
        </div>

        {/* Messages */}
        <div style={style.messageArea} ref={messageAreaRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={
                msg.sender === "user"
                  ? { ...style.messageBubble, ...style.userMessage }
                  : { ...style.messageBubble, ...style.supportMessage }
              }
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={style.inputArea}>
          <input
            type="text"
            style={style.chatInput}
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <button style={style.sendButton} onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;