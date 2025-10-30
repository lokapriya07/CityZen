// import React, { useState, useEffect, useRef } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "../citizen/ui/card";
// import { Button } from "../citizen/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "../citizen/ui/avatar";
// import { Input } from "../citizen/ui/input";
// import { Send, MapPin, X } from "lucide-react";
// import { useWebSocket } from "../citizen/hooks/useWebSocket";

// const API_BASE_URL = "http://localhost:8001/api";

// export function CitizenMessaging({ worker, reportId, onClose }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSending, setIsSending] = useState(false);
//   const [typingUsers, setTypingUsers] = useState([]);
//   const messagesEndRef = useRef(null);
//   const typingTimeoutRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // WebSocket message handler
//   const handleWebSocketMessage = (data) => {
//     console.log("Citizen received:", data);
    
//     switch (data.type) {
//       case "new_message":
//         setMessages(prev => [...prev, data]);
//         break;
//       case "user_typing":
//         setTypingUsers(prev => {
//           const filtered = prev.filter(u => u.userId !== data.userId);
//           return [...filtered, data];
//         });
//         break;
//       case "user_stopped_typing":
//         setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
//         break;
//       case "joined_task_chat":
//         loadMessageHistory();
//         break;
//       case "message_history":
//         setMessages(data.messages || []);
//         setIsLoading(false);
//         break;
//     }
//   };

//   const { sendMessage, isConnected } = useWebSocket(handleWebSocketMessage);

//   // Join chat when connected
//   useEffect(() => {
//     if (isConnected && reportId) {
//       sendMessage({
//         type: "join_task_chat",
//         taskId: reportId
//       });
//     }
//   }, [isConnected, reportId, sendMessage]);

//   const loadMessageHistory = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const response = await fetch(`${API_BASE_URL}/messages/task/${reportId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         if (data.success) {
//           setMessages(data.data.messages || []);
//         }
//       }
//     } catch (error) {
//       console.error("Failed to load messages:", error);
//       // Fallback to mock data
//       setMessages(getMockMessages());
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getMockMessages = () => [
//     {
//       id: "1",
//       sender: { id: "worker", name: worker?.name || "Worker", role: "worker" },
//       message: "Hi! I've received your waste management report. I'm on my way to your location.",
//       createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
//       messageType: "text"
//     },
//     {
//       id: "2", 
//       sender: { id: "citizen", name: "You", role: "citizen" },
//       message: "Great! How long will it take to reach here?",
//       createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
//       messageType: "text"
//     }
//   ];

//   const handleSendMessage = () => {
//     if (!newMessage.trim()) return;

//     setIsSending(true);
    
//     const messageData = {
//       type: "send_message",
//       taskId: reportId,
//       message: newMessage.trim(),
//       messageType: "text"
//     };

//     const sent = sendMessage(messageData);
    
//     if (sent) {
//       // Add temporary message
//       const tempMessage = {
//         id: `temp-${Date.now()}`,
//         sender: { id: "citizen", name: "You", role: "citizen" },
//         message: newMessage.trim(),
//         createdAt: new Date().toISOString(),
//         messageType: "text",
//         isTemp: true
//       };
      
//       setMessages(prev => [...prev, tempMessage]);
//     }
    
//     setNewMessage("");
//     setIsSending(false);

//     // Stop typing
//     sendMessage({ type: "typing_stop", taskId: reportId });
//   };

//   const handleInputChange = (e) => {
//     setNewMessage(e.target.value);
    
//     // Start typing indicator
//     sendMessage({ type: "typing_start", taskId: reportId });

//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//     }

//     typingTimeoutRef.current = setTimeout(() => {
//       sendMessage({ type: "typing_stop", taskId: reportId });
//     }, 2000);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
//     if (diffInMinutes < 1) return "Just now";
//     if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const isMyMessage = (senderId) => senderId === "citizen";

//   return (
//     <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
//       <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
//         <div className="flex items-center space-x-3">
//           <Avatar className="h-10 w-10">
//             <AvatarImage src={worker?.avatar} alt={worker?.name} />
//             <AvatarFallback>{worker?.name?.charAt(0) || "W"}</AvatarFallback>
//           </Avatar>
//           <div>
//             <CardTitle className="text-lg">{worker?.name || "Worker"}</CardTitle>
//             <p className="text-sm text-gray-500 flex items-center">
//               <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? "bg-green-500" : "bg-red-500"}`}></span>
//               {isConnected ? "Online" : "Offline"}
//             </p>
//           </div>
//         </div>
//         <Button variant="ghost" size="icon" onClick={onClose}>
//           <X className="h-4 w-4" />
//         </Button>
//       </CardHeader>

//       <CardContent className="flex-1 p-4 overflow-y-auto">
//         {isLoading ? (
//           <div className="flex justify-center items-center h-32">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           </div>
//         ) : messages.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-32 text-gray-500">
//             <div className="text-4xl mb-2">💬</div>
//             <p>No messages yet</p>
//             <p className="text-sm">Start a conversation</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {messages.map((message) => (
//               <div key={message.id} className={`flex ${isMyMessage(message.sender?.id) ? "justify-end" : "justify-start"}`}>
//                 <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
//                   isMyMessage(message.sender?.id)
//                     ? "bg-blue-600 text-white rounded-br-none"
//                     : "bg-gray-200 text-gray-900 rounded-bl-none"
//                 } ${message.isTemp ? "opacity-70" : ""}`}>
//                   <p className="text-sm">{message.message}</p>
//                   <p className={`text-xs mt-1 ${isMyMessage(message.sender?.id) ? "text-blue-100" : "text-gray-500"}`}>
//                     {formatTime(message.createdAt)}
//                     {message.isTemp && " • Sending..."}
//                   </p>
//                 </div>
//               </div>
//             ))}
            
//             {typingUsers.map((user) => (
//               <div key={user.userId} className="flex justify-start">
//                 <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-2xl rounded-bl-none">
//                   <div className="flex space-x-1">
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
            
//             <div ref={messagesEndRef} />
//           </div>
//         )}
//       </CardContent>

//       <div className="border-t p-4">
//         <div className="flex space-x-2">
//           <Input
//             value={newMessage}
//             onChange={handleInputChange}
//             onKeyPress={handleKeyPress}
//             placeholder="Type your message..."
//             disabled={isSending}
//             className="flex-1"
//           />
//           <Button onClick={handleSendMessage} disabled={!newMessage.trim() || isSending}>
//             <Send className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../citizen/ui/card";
import { Button } from "../citizen/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../citizen/ui/avatar";
import { Input } from "../citizen/ui/input";
import { Send, X } from "lucide-react";
import { useSocketIO } from "../citizen/hooks/useSocketIO"; // CHANGED IMPORT

const API_BASE_URL = "http://localhost:8001/api";

export function CitizenMessaging({ worker, reportId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket message handler
  const handleSocketMessage = (data) => {
    console.log("📨 CITIZEN RECEIVED:", data);
    
    switch (data.type) {
      case "new_message":
        console.log("💬 ADDING NEW MESSAGE TO CHAT");
        setMessages(prev => [...prev, data]);
        break;
        
      case "message_history":
        console.log("📚 SETTING MESSAGE HISTORY");
        setMessages(data.messages || []);
        setIsLoading(false);
        break;
        
      case "joined_task_chat":
        console.log("✅ JOINED CHAT SUCCESS");
        break;
        
      case "socket_error":
        console.error("❌ CHAT ERROR:", data.message);
        setIsLoading(false);
        break;
        
      case "connected":
        console.log("🔗 SOCKET CONNECTED TO SERVER");
        if (reportId) {
          joinTaskChat(reportId);
        }
        break;
    }
  };

  const { 
    sendMessage, 
    isConnected, 
    socketId,
    joinTaskChat 
  } = useSocketIO(handleSocketMessage);

  // Join chat when connected
  useEffect(() => {
    if (isConnected && reportId) {
      console.log("🎯 JOINING CHAT WITH REPORT:", reportId);
      joinTaskChat(reportId);
    }
  }, [isConnected, reportId, joinTaskChat]);

  // Load initial messages
  useEffect(() => {
    if (reportId) {
      loadMessageHistory();
    }
  }, [reportId]);

  const loadMessageHistory = async () => {
    try {
      const token = localStorage.getItem("authToken");
      console.log("📡 Loading messages for report:", reportId);
      
      const response = await fetch(`${API_BASE_URL}/messages/task/${reportId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ MESSAGES LOADED:", data);
        if (data.success) {
          setMessages(data.data?.messages || []);
        }
      }
    } catch (error) {
      console.error("❌ Failed to load messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !isConnected) {
      alert("Cannot send message - not connected to server");
      return;
    }

    console.log("🚀 SENDING MESSAGE:", newMessage);
    setIsSending(true);

    // Create temporary message
    const tempMessage = {
      id: `temp-${Date.now()}`,
      taskId: reportId,
      sender: { 
        id: "citizen", 
        name: "You", 
        role: "citizen" 
      },
      message: newMessage.trim(),
      createdAt: new Date().toISOString(),
      messageType: "text",
      isTemp: true
    };

    // Add temporary message immediately
    setMessages(prev => [...prev, tempMessage]);
    const messageToSend = newMessage.trim();
    setNewMessage("");

    // Send via socket
    const success = sendMessage({
      taskId: reportId,
      message: messageToSend,
      messageType: "text"
    });

    if (!success) {
      console.error("❌ FAILED TO SEND VIA SOCKET");
      // Mark as failed
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id 
            ? { ...msg, isFailed: true }
            : msg
        )
      );
    }

    setIsSending(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isMyMessage = (senderId) => senderId === "citizen";

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={worker?.avatar} alt={worker?.name} />
            <AvatarFallback>{worker?.name?.charAt(0) || "W"}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{worker?.name || "Worker"}</CardTitle>
            <p className="text-sm text-gray-500 flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? "bg-green-500" : "bg-red-500"}`}></span>
              {isConnected ? `Online (${socketId})` : "Offline"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${isMyMessage(message.sender?.id) ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  isMyMessage(message.sender?.id)
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                } ${message.isTemp ? "opacity-70" : ""} ${message.isFailed ? "bg-red-200 border border-red-300" : ""}`}>
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${isMyMessage(message.sender?.id) ? "text-blue-100" : "text-gray-500"}`}>
                    {formatTime(message.createdAt)}
                    {message.isTemp && " • Sending..."}
                    {message.isFailed && " • Failed"}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>

      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? "Type your message..." : "Connecting to server..."}
            disabled={isSending || !isConnected}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim() || isSending || !isConnected}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {!isConnected && (
          <p className="text-xs text-red-500 mt-2">Not connected to server. Messages will not be sent.</p>
        )}
      </div>
    </div>
  );
}


