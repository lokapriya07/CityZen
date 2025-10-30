// import React, { useState, useEffect, useRef } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "../citizen/ui/card";
// import { Button } from "../citizen/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "../citizen/ui/avatar";
// import { Input } from "../citizen/ui/input";
// import { Send, X } from "lucide-react";
// import { useWebSocket } from "../worker/hooks/useWebSocket";

// const API_BASE_URL = "http://localhost:8001/api";

// export function WorkerMessaging({ task, onClose }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSending, setIsSending] = useState(false);
//   const [typingUsers, setTypingUsers] = useState([]);
//   const [citizenInfo, setCitizenInfo] = useState({ name: "Citizen", avatar: null });
//   const messagesEndRef = useRef(null);
//   const typingTimeoutRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // WebSocket setup
//   const handleWebSocketMessage = (data) => {
//     console.log("Worker received:", data);
    
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
//     if (isConnected && task?.id) {
//       sendMessage({
//         type: "join_task_chat",
//         taskId: task.id
//       });
//     }
//   }, [isConnected, task, sendMessage]);

//   const loadMessageHistory = async () => {
//     try {
//       const token = localStorage.getItem("workerToken");
//       const response = await fetch(`${API_BASE_URL}/messages/task/${task.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       const data = await response.json();
//       if (data.success) {
//         setMessages(data.data.messages || []);
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
//       sender: { id: "citizen", name: "Citizen", role: "citizen" },
//       message: "Hi! When will you arrive?",
//       createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
//       messageType: "text"
//     },
//     {
//       id: "2",
//       sender: { id: "worker", name: "You", role: "worker" },
//       message: "I'll be there in 15 minutes",
//       createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
//       messageType: "text"
//     }
//   ];

//   const handleSendMessage = () => {
//     if (!newMessage.trim()) return;

//     setIsSending(true);
    
//     const messageData = {
//       type: "send_message",
//       taskId: task.id,
//       message: newMessage.trim(),
//       messageType: "text"
//     };

//     const sent = sendMessage(messageData);
    
//     if (sent) {
//       const tempMessage = {
//         id: `temp-${Date.now()}`,
//         sender: { id: "worker", name: "You", role: "worker" },
//         message: newMessage.trim(),
//         createdAt: new Date().toISOString(),
//         messageType: "text",
//         isTemp: true
//       };
      
//       setMessages(prev => [...prev, tempMessage]);
//     }
    
//     setNewMessage("");
//     setIsSending(false);

//     sendMessage({ type: "typing_stop", taskId: task.id });
//   };

//   const handleInputChange = (e) => {
//     setNewMessage(e.target.value);
    
//     sendMessage({ type: "typing_start", taskId: task.id });

//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//     }

//     typingTimeoutRef.current = setTimeout(() => {
//       sendMessage({ type: "typing_stop", taskId: task.id });
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

//   const isMyMessage = (senderId) => senderId === "worker";

//   return (
//     <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
//       <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
//         <div className="flex items-center space-x-3">
//           <Avatar className="h-10 w-10">
//             <AvatarImage src={citizenInfo.avatar} alt={citizenInfo.name} />
//             <AvatarFallback>{citizenInfo.name?.charAt(0) || "C"}</AvatarFallback>
//           </Avatar>
//           <div>
//             <CardTitle className="text-lg">{citizenInfo.name}</CardTitle>
//             <p className="text-sm text-gray-500">Task: {task?.title}</p>
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
import { useWebSocket } from "../worker/hooks/useWebSocket";

const API_BASE_URL = "http://localhost:8001/api";

export function WorkerMessaging({ task, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [citizenInfo, setCitizenInfo] = useState({ name: "Citizen", avatar: null });
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket message handler
  const handleWebSocketMessage = (data) => {
    console.log("Worker received:", data);
    
    switch (data.type) {
      case "new_message":
        console.log("💬 New message received from server:", data);
        // Remove any temporary messages and add the real one
        setMessages(prev => {
          const filtered = prev.filter(msg => !msg.isTemp);
          return [...filtered, data];
        });
        break;
      case "user_typing":
        setTypingUsers(prev => {
          const filtered = prev.filter(u => u.userId !== data.userId);
          return [...filtered, data];
        });
        break;
      case "user_stopped_typing":
        setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
        break;
      case "joined_task_chat":
        console.log("✅ Successfully joined task chat");
        // Message history will be sent automatically by the server
        break;
      case "message_history":
        console.log("📚 Received message history:", data.messages?.length, "messages");
        setMessages(data.messages || []);
        setIsLoading(false);
        break;
      case "socket_error":
        console.error("❌ Socket error:", data.message);
        setIsLoading(false);
        break;
      case "connected":
        console.log("✅ Socket connection confirmed");
        // Join the task chat once connected
        if (task?.id) {
          joinTaskChat(task.id);
        }
        break;
    }
  };

  const { 
    sendMessage, 
    isConnected, 
    joinTaskChat,
    socket 
  } = useWebSocket(handleWebSocketMessage);

  // Join chat when connected and taskId is available
  useEffect(() => {
    if (isConnected && task?.id) {
      console.log("🚪 Worker joining task chat with taskId:", task.id);
      joinTaskChat(task.id);
    }
  }, [isConnected, task, joinTaskChat]);

  // Load initial message history via API as fallback
  useEffect(() => {
    if (task?.id) {
      loadMessageHistory();
      loadCitizenInfo();
    }
  }, [task]);

  const loadMessageHistory = async () => {
    try {
      console.log("📡 Worker loading message history via API...");
      const token = localStorage.getItem("workerToken");
      const response = await fetch(`${API_BASE_URL}/messages/task/${task.id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Worker API message history loaded:", data);
        if (data.success) {
          setMessages(data.data?.messages || []);
        }
      } else {
        console.error("❌ Worker failed to load message history:", response.status);
        setMessages(getMockMessages());
      }
    } catch (error) {
      console.error("❌ Worker failed to load messages:", error);
      // Fallback to mock data
      setMessages(getMockMessages());
    } finally {
      setIsLoading(false);
    }
  };

  const loadCitizenInfo = async () => {
    try {
      // You might need to fetch citizen info from the task/report
      if (task?.report?.createdBy) {
        const token = localStorage.getItem("workerToken");
        const response = await fetch(`${API_BASE_URL}/users/${task.report.createdBy}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCitizenInfo({
              name: data.data.name || "Citizen",
              avatar: data.data.avatar || null
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to load citizen info:", error);
    }
  };

  const getMockMessages = () => [
    {
      id: "1",
      sender: { id: "citizen", name: "Citizen", role: "citizen" },
      message: "Hi! When will you arrive?",
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      messageType: "text"
    },
    {
      id: "2",
      sender: { id: "worker", name: "You", role: "worker" },
      message: "I'll be there in 15 minutes",
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      messageType: "text"
    }
  ];

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !isConnected) {
      console.error("❌ Worker cannot send message - no content or not connected");
      return;
    }

    setIsSending(true);
    
    const messageData = {
      taskId: task.id,
      message: newMessage.trim(),
      messageType: "text"
    };

    console.log("📤 Worker sending message:", messageData);

    // Add temporary message immediately for better UX
    const tempMessage = {
      id: `temp-${Date.now()}`,
      taskId: task.id,
      sender: { 
        id: "worker", 
        name: "You", 
        role: "worker",
        avatar: null 
      },
      message: newMessage.trim(),
      createdAt: new Date().toISOString(),
      messageType: "text",
      isTemp: true
    };
    
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage("");
    
    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    sendMessage({ type: "typing_stop", taskId: task.id });

    // Send the actual message via socket
    const sent = sendMessage(messageData);
    
    if (!sent) {
      console.error("❌ Worker failed to send message via socket");
      // Mark temporary message as failed
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

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // Start typing indicator
    if (isConnected) {
      sendMessage({ type: "typing_start", taskId: task.id });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        sendMessage({ type: "typing_stop", taskId: task.id });
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isMyMessage = (senderId) => {
    // For workers, check if sender is worker or current user
    return senderId === "worker" || senderId === socket?.userId;
  };

  const getSenderName = (message) => {
    if (isMyMessage(message.sender?.id)) {
      return "You";
    }
    return message.sender?.name || "Citizen";
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={citizenInfo.avatar} alt={citizenInfo.name} />
            <AvatarFallback>{citizenInfo.name?.charAt(0) || "C"}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{citizenInfo.name}</CardTitle>
            <p className="text-sm text-gray-500 flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? "bg-green-500" : "bg-red-500"}`}></span>
              {isConnected ? "Online" : "Offline"}
              {!isConnected && " - Reconnecting..."}
            </p>
            <p className="text-sm text-gray-500">Task: {task?.title}</p>
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
            <div className="text-4xl mb-2">💬</div>
            <p>No messages yet</p>
            <p className="text-sm">Start a conversation with the citizen</p>
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
                    {message.isFailed && " • Failed to send"}
                  </p>
                </div>
              </div>
            ))}
            
            {typingUsers.map((user) => (
              <div key={user.userId} className="flex justify-start">
                <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-2xl rounded-bl-none">
                  <p className="text-xs text-gray-600 mb-1">{user.userName} is typing</p>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
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
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? "Type your message..." : "Connecting..."}
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
      </div>
    </div>
  );
}