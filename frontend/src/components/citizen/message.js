import React, { useState, useEffect, useRef } from "react";

export function WorkerMessaging({ worker, reportId, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "worker",
      text: "Hi! I've received your waste management report. I'm on my way to your location.",
      timestamp: new Date(Date.now() - 5 * 60000),
      read: true,
    },
    {
      id: "2",
      sender: "user",
      text: "Great! How long will it take to reach here?",
      timestamp: new Date(Date.now() - 4 * 60000),
      read: true,
    },
    {
      id: "3",
      sender: "worker",
      text: "I'll be there in about 15-20 minutes. Currently at Sector 12.",
      timestamp: new Date(Date.now() - 3 * 60000),
      read: true,
    },
    {
      id: "4",
      sender: "user",
      text: "Perfect! I'll be waiting. The waste is near the main gate.",
      timestamp: new Date(Date.now() - 2 * 60000),
      read: true,
    },
  ]);
  
  const [messageInput, setMessageInput] = useState("");
  const [workerTyping, setWorkerTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate worker response
  useEffect(() => {
    if (workerTyping) {
      const timer = setTimeout(() => {
        setWorkerTyping(false);
        const responses = [
          "Got it! I'll take care of that.",
          "Thanks for letting me know!",
          "I'm almost there now.",
          "No problem, I'll handle it professionally.",
          "See you soon!",
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "worker",
            text: randomResponse,
            timestamp: new Date(),
            read: true,
          },
        ]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [workerTyping]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: "user",
        text: messageInput,
        timestamp: new Date(),
        read: false,
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessageInput("");
      setWorkerTyping(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const formatMessageTime = (date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffMinutes < 1) return "now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col border-0 shadow-lg bg-white">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-blue-50 to-emerald-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
              {worker.avatar ? (
                <img src={worker.avatar} alt={worker.name} className="w-12 h-12 rounded-full" />
              ) : (
                <span className="font-semibold text-gray-600">
                  {worker.name.split(' ').map(n => n[0]).join('')}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{worker.name}</h3>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <span>⭐ {worker.rating || "4.8"}</span>
                <span>•</span>
                <span>{worker.completedTasks || "150"}+ completed</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              Active
            </span>
            {onClose && (
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-1 rounded"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                {formatMessageTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {workerTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg rounded-bl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4 space-y-3">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <button className="flex-1 text-xs bg-transparent border border-gray-300 rounded-lg py-2 px-3 hover:bg-gray-50">
            📍 Share Location
          </button>
          <button className="flex-1 text-xs bg-transparent border border-gray-300 rounded-lg py-2 px-3 hover:bg-gray-50">
            📞 Call Worker
          </button>
        </div>
      </div>
    </div>
  );
}



// import React, { useState, useEffect, useRef } from "react";

// export function WorkerMessaging({ worker, reportId, onClose }) {
//   const [messages, setMessages] = useState([]);
//   const [messageInput, setMessageInput] = useState("");
//   const [workerTyping, setWorkerTyping] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [isSending, setIsSending] = useState(false);
//   const messagesEndRef = useRef(null);

//   const getAuthToken = () => {
//     return localStorage.getItem("authToken");
//   };

//   // Fetch messages from API
//   const fetchMessages = async () => {
//     try {
//       setIsLoading(true);
//       const token = getAuthToken();
//       const response = await fetch(`/api/reports/${reportId}/messages`, {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch messages");
//       }

//       const data = await response.json();
      
//       if (data.success && data.messages) {
//         // Transform API response to match our message format
//         const formattedMessages = data.messages.map(msg => ({
//           id: msg.id || msg._id,
//           sender: msg.senderType === 'worker' ? 'worker' : 'user',
//           text: msg.content,
//           timestamp: new Date(msg.timestamp || msg.createdAt),
//           read: msg.read || true
//         }));
//         setMessages(formattedMessages);
//       } else {
//         // If no messages, start with empty array
//         setMessages([]);
//       }
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//       setError("Failed to load messages");
//       // Fallback to sample messages if API fails
//       setMessages(getSampleMessages());
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Sample messages for fallback
//   const getSampleMessages = () => [
//     {
//       id: "1",
//       sender: "worker",
//       text: "Hi! I've received your waste management report. I'm on my way to your location.",
//       timestamp: new Date(Date.now() - 5 * 60000),
//       read: true,
//     },
//     {
//       id: "2",
//       sender: "user",
//       text: "Great! How long will it take to reach here?",
//       timestamp: new Date(Date.now() - 4 * 60000),
//       read: true,
//     },
//     {
//       id: "3",
//       sender: "worker",
//       text: "I'll be there in about 15-20 minutes. Currently at Sector 12.",
//       timestamp: new Date(Date.now() - 3 * 60000),
//       read: true,
//     },
//     {
//       id: "4",
//       sender: "user",
//       text: "Perfect! I'll be waiting. The waste is near the main gate.",
//       timestamp: new Date(Date.now() - 2 * 60000),
//       read: true,
//     },
//   ];

//   // Send message to API
//   const sendMessageToAPI = async (messageText) => {
//     const token = getAuthToken();
//     const response = await fetch(`/api/reports/${reportId}/messages`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         content: messageText,
//         senderType: 'user',
//         timestamp: new Date().toISOString()
//       }),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to send message");
//     }

//     const data = await response.json();
//     return data.message || data.newMessage;
//   };

//   // Simulate worker response (for demo - replace with WebSocket or polling in production)
//   const simulateWorkerResponse = () => {
//     const responses = [
//       "Got it! I'll take care of that.",
//       "Thanks for letting me know!",
//       "I'm almost there now.",
//       "No problem, I'll handle it professionally.",
//       "See you soon!",
//       "I've noted that down.",
//       "I'll update you once I reach.",
//       "Understood. I'm on it.",
//     ];
//     return responses[Math.floor(Math.random() * responses.length)];
//   };

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Fetch messages on component mount
//   useEffect(() => {
//     fetchMessages();
//   }, [reportId]);

//   // Simulate worker response
//   useEffect(() => {
//     if (workerTyping) {
//       const timer = setTimeout(async () => {
//         setWorkerTyping(false);
//         const workerResponse = simulateWorkerResponse();
        
//         try {
//           // Send worker response to API
//           const token = getAuthToken();
//           await fetch(`/api/reports/${reportId}/messages`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               "Authorization": `Bearer ${token}`,
//             },
//             body: JSON.stringify({
//               content: workerResponse,
//               senderType: 'worker',
//               timestamp: new Date().toISOString()
//             }),
//           });

//           // Add worker response to local state
//           const newMessage = {
//             id: Date.now().toString(),
//             sender: "worker",
//             text: workerResponse,
//             timestamp: new Date(),
//             read: true,
//           };
//           setMessages((prev) => [...prev, newMessage]);
//         } catch (error) {
//           console.error("Error sending worker response:", error);
//           // Still add to local state even if API fails
//           const newMessage = {
//             id: Date.now().toString(),
//             sender: "worker",
//             text: workerResponse,
//             timestamp: new Date(),
//             read: true,
//           };
//           setMessages((prev) => [...prev, newMessage]);
//         }
//       }, 2000 + Math.random() * 2000); // Random delay between 2-4 seconds

//       return () => clearTimeout(timer);
//     }
//   }, [workerTyping, reportId]);

//   const handleSendMessage = async () => {
//     if (!messageInput.trim()) return;

//     const messageText = messageInput.trim();
//     setMessageInput("");
//     setIsSending(true);

//     // Optimistically add message to UI
//     const tempMessage = {
//       id: `temp-${Date.now()}`,
//       sender: "user",
//       text: messageText,
//       timestamp: new Date(),
//       read: false,
//     };

//     setMessages((prev) => [...prev, tempMessage]);

//     try {
//       // Send to API
//       const sentMessage = await sendMessageToAPI(messageText);
      
//       // Replace temp message with actual message from API
//       setMessages((prev) => 
//         prev.map(msg => 
//           msg.id === tempMessage.id 
//             ? {
//                 ...msg,
//                 id: sentMessage.id || sentMessage._id,
//                 read: true
//               }
//             : msg
//         )
//       );

//       // Simulate worker typing
//       setWorkerTyping(true);
//     } catch (error) {
//       console.error("Error sending message:", error);
//       // Mark message as failed
//       setMessages((prev) => 
//         prev.map(msg => 
//           msg.id === tempMessage.id 
//             ? { ...msg, failed: true }
//             : msg
//         )
//       );
//       alert("Failed to send message. Please try again.");
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const formatMessageTime = (date) => {
//     const now = new Date();
//     const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

//     if (diffMinutes < 1) return "now";
//     if (diffMinutes < 60) return `${diffMinutes}m ago`;
//     if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
//     return date.toLocaleDateString();
//   };

//   const handleShareLocation = async () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation is not supported by your browser");
//       return;
//     }

//     try {
//       const position = await new Promise((resolve, reject) => {
//         navigator.geolocation.getCurrentPosition(resolve, reject, {
//           enableHighAccuracy: true,
//           timeout: 10000,
//           maximumAge: 60000
//         });
//       });

//       const { latitude, longitude } = position.coords;
//       const locationMessage = `📍 My current location: https://maps.google.com/?q=${latitude},${longitude}`;
      
//       // Send location as message
//       setMessageInput(locationMessage);
//     } catch (error) {
//       console.error("Error getting location:", error);
//       alert("Unable to get your location. Please check permissions.");
//     }
//   };

//   const handleCallWorker = () => {
//     if (worker.phone) {
//       window.location.href = `tel:${worker.phone}`;
//     } else {
//       alert("Worker phone number not available");
//     }
//   };

//   return (
//     <div className="h-full flex flex-col border-0 shadow-lg bg-white">
//       {/* Header */}
//       <div className="border-b bg-gradient-to-r from-blue-50 to-emerald-50 p-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
//               {worker.avatar ? (
//                 <img src={worker.avatar} alt={worker.name} className="w-12 h-12 rounded-full" />
//               ) : (
//                 <span className="font-semibold text-gray-600">
//                   {worker.name.split(' ').map(n => n[0]).join('')}
//                 </span>
//               )}
//             </div>
//             <div>
//               <h3 className="font-semibold text-gray-900">{worker.name}</h3>
//               <div className="flex items-center space-x-2 text-xs text-gray-600">
//                 <span>⭐ {worker.rating || "4.8"}</span>
//                 <span>•</span>
//                 <span>{worker.completedTasks || "150"}+ completed</span>
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center space-x-2">
//             <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
//               <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
//               Active
//             </span>
//             {onClose && (
//               <button 
//                 onClick={onClose}
//                 className="text-gray-500 hover:text-gray-700 p-1 rounded"
//               >
//                 ✕
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
//         {isLoading ? (
//           <div className="flex justify-center items-center h-32">
//             <div className="text-center">
//               <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
//               <p className="text-sm text-gray-600">Loading messages...</p>
//             </div>
//           </div>
//         ) : error ? (
//           <div className="flex justify-center items-center h-32">
//             <div className="text-center text-red-600">
//               <p className="text-sm">{error}</p>
//               <button 
//                 onClick={fetchMessages}
//                 className="mt-2 text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
//               >
//                 Retry
//               </button>
//             </div>
//           </div>
//         ) : messages.length === 0 ? (
//           <div className="flex justify-center items-center h-32">
//             <div className="text-center text-gray-500">
//               <p className="text-sm">No messages yet</p>
//               <p className="text-xs">Start a conversation with {worker.name}</p>
//             </div>
//           </div>
//         ) : (
//           <>
//             {messages.map((message) => (
//               <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
//                 <div
//                   className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
//                     message.sender === "user"
//                       ? message.failed
//                         ? "bg-red-500 text-white rounded-br-none"
//                         : "bg-blue-500 text-white rounded-br-none"
//                       : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
//                   }`}
//                 >
//                   <p className="text-sm">{message.text}</p>
//                   <div className="flex items-center justify-between mt-1">
//                     <p className={`text-xs ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
//                       {formatMessageTime(message.timestamp)}
//                     </p>
//                     {message.failed && (
//                       <span className="text-xs text-red-200 ml-2">Failed</span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </>
//         )}

//         {/* Typing Indicator */}
//         {workerTyping && (
//           <div className="flex justify-start">
//             <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg rounded-bl-none">
//               <div className="flex space-x-1">
//                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                 <div
//                   className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                   style={{ animationDelay: "0.1s" }}
//                 ></div>
//                 <div
//                   className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                   style={{ animationDelay: "0.2s" }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Area */}
//       <div className="border-t bg-white p-4 space-y-3">
//         <div className="flex space-x-2">
//           <input
//             type="text"
//             placeholder="Type your message..."
//             value={messageInput}
//             onChange={(e) => setMessageInput(e.target.value)}
//             onKeyPress={handleKeyPress}
//             disabled={isSending}
//             className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
//           />
//           <button
//             onClick={handleSendMessage}
//             disabled={!messageInput.trim() || isSending}
//             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center min-w-16"
//           >
//             {isSending ? (
//               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//             ) : (
//               "Send"
//             )}
//           </button>
//         </div>

//         {/* Quick Actions */}
//         <div className="flex space-x-2">
//           <button 
//             onClick={handleShareLocation}
//             className="flex-1 text-xs bg-transparent border border-gray-300 rounded-lg py-2 px-3 hover:bg-gray-50 transition-all"
//           >
//             📍 Share Location
//           </button>
//           <button 
//             onClick={handleCallWorker}
//             className="flex-1 text-xs bg-transparent border border-gray-300 rounded-lg py-2 px-3 hover:bg-gray-50 transition-all"
//           >
//             📞 Call Worker
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }