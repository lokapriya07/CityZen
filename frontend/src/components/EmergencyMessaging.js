// // src/components/EmergencyMessaging.js
// import React, { useState, useEffect, useRef } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "./citizen/ui/card";
// import { Button } from "./citizen/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "./citizen/ui/avatar";
// import { Input } from "./citizen/ui/input";
// import { Send, X } from "lucide-react";

// export function EmergencyMessaging({ userType, taskId, worker, onClose }) {
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState("");
//     const [isConnected, setIsConnected] = useState(true);
//     const messagesEndRef = useRef(null);

//     useEffect(() => {
//         console.log("🚀 EMERGENCY MESSAGING ACTIVATED for:", userType);
//         setIsConnected(true);
        
//         if (userType === "citizen") {
//             setMessages([
//                 {
//                     id: "1",
//                     sender: { id: "worker", name: worker?.name || "Worker", role: "worker" },
//                     message: "Hi! I've received your waste management report. I'm on my way to your location.",
//                     createdAt: new Date(Date.now() - 300000).toISOString(),
//                 },
//                 {
//                     id: "2", 
//                     sender: { id: "citizen", name: "You", role: "citizen" },
//                     message: "Great! How long will it take to reach here?",
//                     createdAt: new Date(Date.now() - 240000).toISOString(),
//                 }
//             ]);
//         } else {
//             setMessages([
//                 {
//                     id: "1",
//                     sender: { id: "citizen", name: "Citizen", role: "citizen" },
//                     message: "Hi! When will you arrive?",
//                     createdAt: new Date(Date.now() - 300000).toISOString(),
//                 },
//                 {
//                     id: "2",
//                     sender: { id: "worker", name: "You", role: "worker" },
//                     message: "I'll be there in 15 minutes",
//                     createdAt: new Date(Date.now() - 240000).toISOString(),
//                 }
//             ]);
//         }
//     }, [userType, worker]);

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);

//     const handleSendMessage = () => {
//         if (!newMessage.trim()) return;

//         console.log("📤 SENDING MESSAGE:", newMessage);

//         const tempMessage = {
//             id: `temp-${Date.now()}`,
//             sender: { 
//                 id: userType, 
//                 name: "You", 
//                 role: userType 
//             },
//             message: newMessage.trim(),
//             createdAt: new Date().toISOString(),
//             isTemp: true
//         };

//         setMessages(prev => [...prev, tempMessage]);
//         setNewMessage("");

//         setTimeout(() => {
//             setMessages(prev => 
//                 prev.map(msg => 
//                     msg.id === tempMessage.id 
//                         ? { ...msg, isTemp: false }
//                         : msg
//                 )
//             );
//         }, 500);
//     };

//     const handleKeyPress = (e) => {
//         if (e.key === "Enter" && !e.shiftKey) {
//             e.preventDefault();
//             handleSendMessage();
//         }
//     };

//     const formatTime = (timestamp) => {
//         const date = new Date(timestamp);
//         const now = new Date();
//         const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
//         if (diffInMinutes < 1) return "Just now";
//         if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
//         return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     };

//     const isMyMessage = (senderId) => senderId === userType;

//     const getOtherUserName = () => {
//         return userType === 'citizen' ? (worker?.name || "Worker") : "Citizen";
//     };

//     const getOtherUserAvatar = () => {
//         return userType === 'citizen' ? worker?.avatar : null;
//     };

//     return (
//         <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
//             <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
//                 <div className="flex items-center space-x-3">
//                     <Avatar className="h-10 w-10">
//                         <AvatarImage src={getOtherUserAvatar()} alt={getOtherUserName()} />
//                         <AvatarFallback>{getOtherUserName()?.charAt(0) || "U"}</AvatarFallback>
//                     </Avatar>
//                     <div>
//                         <CardTitle className="text-lg">{getOtherUserName()}</CardTitle>
//                         <p className="text-sm text-gray-500 flex items-center">
//                             <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? "bg-green-500" : "bg-red-500"}`}></span>
//                             {isConnected ? "Online" : "Offline"}
//                         </p>
//                     </div>
//                 </div>
//                 <Button variant="ghost" size="icon" onClick={onClose}>
//                     <X className="h-4 w-4" />
//                 </Button>
//             </CardHeader>

//             <CardContent className="flex-1 p-4 overflow-y-auto">
//                 {messages.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center h-32 text-gray-500">
//                         <p>No messages yet. Start a conversation!</p>
//                     </div>
//                 ) : (
//                     <div className="space-y-4">
//                         {messages.map((message) => (
//                             <div key={message.id} className={`flex ${isMyMessage(message.sender?.id) ? "justify-end" : "justify-start"}`}>
//                                 <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
//                                     isMyMessage(message.sender?.id)
//                                         ? "bg-blue-600 text-white rounded-br-none"
//                                         : "bg-gray-200 text-gray-900 rounded-bl-none"
//                                 } ${message.isTemp ? "opacity-70" : ""}`}>
//                                     <p className="text-sm">{message.message}</p>
//                                     <p className={`text-xs mt-1 ${isMyMessage(message.sender?.id) ? "text-blue-100" : "text-gray-500"}`}>
//                                         {formatTime(message.createdAt)}
//                                         {message.isTemp && " • Sending..."}
//                                     </p>
//                                 </div>
//                             </div>
//                         ))}
//                         <div ref={messagesEndRef} />
//                     </div>
//                 )}
//             </CardContent>

//             <div className="border-t p-4">
//                 <div className="flex space-x-2">
//                     <Input
//                         value={newMessage}
//                         onChange={(e) => setNewMessage(e.target.value)}
//                         onKeyPress={handleKeyPress}
//                         placeholder="Type your message..."
//                         className="flex-1"
//                     />
//                     <Button 
//                         onClick={handleSendMessage} 
//                         disabled={!newMessage.trim()}
//                     >
//                         <Send className="h-4 w-4" />
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// src/components/EmergencyMessaging.js - UPDATED VERSION
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './citizen/ui/card';
import { Button } from './citizen/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './citizen/ui/avatar';
import { Input } from './citizen/ui/input';
import { Send, X } from 'lucide-react';
import io from 'socket.io-client';

export function EmergencyMessaging({ userType, taskId, worker, task, onClose }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Socket.IO connection
    useEffect(() => {
        console.log("🔌 Connecting to Socket.IO...");
        const token = localStorage.getItem('authToken') || localStorage.getItem('workerToken');
        
        if (!token) {
            console.error('❌ No token found');
            return;
        }

        const newSocket = io('http://localhost:8001', {
            query: { token },
            transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
            console.log('✅ SOCKET CONNECTED! ID:', newSocket.id);
            setIsConnected(true);
            setSocket(newSocket);
        });

        newSocket.on('disconnect', () => {
            console.log('🔌 Socket disconnected');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('❌ Connection error:', error);
        });

        // Listen for messages
        newSocket.on('new_message', (data) => {
            console.log('💬 NEW MESSAGE RECEIVED:', data);
            setMessages(prev => [...prev, data]);
        });

        newSocket.on('message_history', (data) => {
            console.log('📚 MESSAGE HISTORY:', data.messages);
            setMessages(data.messages || []);
        });

        newSocket.on('joined_task_chat', (data) => {
            console.log('✅ JOINED CHAT:', data);
        });

        newSocket.on('socket_error', (error) => {
            console.error('❌ SOCKET ERROR:', error);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Join task chat when socket is connected
    useEffect(() => {
        if (socket && isConnected && taskId) {
            console.log('🚪 Joining task chat:', taskId);
            socket.emit('join_task_chat', { taskId });
        }
    }, [socket, isConnected, taskId]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        console.log("📤 SENDING DYNAMIC MESSAGE:", newMessage);

        // Create temporary message
        const tempMessage = {
            id: `temp-${Date.now()}`,
            sender: { 
                id: userType, 
                name: "You", 
                role: userType 
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

        // Send via socket if connected
        if (socket && isConnected) {
            console.log('📤 Emitting send_message via socket');
            socket.emit('send_message', {
                taskId: taskId,
                message: messageToSend,
                messageType: 'text'
            });
        } else {
            console.log('📤 Sending via API fallback');
            sendMessageViaAPI(messageToSend, taskId);
        }

        // Remove temp status after a delay
        setTimeout(() => {
            setMessages(prev => 
                prev.map(msg => 
                    msg.id === tempMessage.id && msg.isTemp
                        ? { ...msg, isTemp: false }
                        : msg
                )
            );
        }, 3000);
    };

    const sendMessageViaAPI = async (message, taskId) => {
        try {
            const token = localStorage.getItem('authToken') || localStorage.getItem('workerToken');
            const response = await fetch(`http://localhost:8001/api/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    taskId: taskId,
                    message: message,
                    messageType: 'text'
                })
            });
            
            if (response.ok) {
                console.log('✅ Message saved via API');
            }
        } catch (error) {
            console.error('❌ API message save failed:', error);
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

    const isMyMessage = (senderId) => senderId === userType;

    // ✅ FIXED: Get the correct user info based on component usage
    const getOtherUserName = () => {
        if (userType === 'citizen') {
            return worker?.name || "Worker";
        } else {
            // For worker, we need to get citizen name from task/report
            return task?.report?.createdBy?.name || "Citizen";
        }
    };

    const getOtherUserAvatar = () => {
        if (userType === 'citizen') {
            return worker?.avatar;
        } else {
            return task?.report?.createdBy?.avatar;
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={getOtherUserAvatar()} alt={getOtherUserName()} />
                        <AvatarFallback>{getOtherUserName()?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-lg">{getOtherUserName()}</CardTitle>
                        <p className="text-sm text-gray-500 flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? "bg-green-500" : "bg-red-500"}`}></span>
                            {isConnected ? `Online (Dynamic)` : "Offline - Using API"}
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>

            <CardContent className="flex-1 p-4 overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                        <p>No messages yet. Start a conversation!</p>
                        <p className="text-xs mt-2">Connection: {isConnected ? '✅ Socket.IO' : '📡 API Fallback'}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div key={message.id} className={`flex ${isMyMessage(message.sender?.id) ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                    isMyMessage(message.sender?.id)
                                        ? "bg-blue-600 text-white rounded-br-none"
                                        : "bg-gray-200 text-gray-900 rounded-bl-none"
                                } ${message.isTemp ? "opacity-70" : ""}`}>
                                    <p className="text-sm">{message.message}</p>
                                    <p className={`text-xs mt-1 ${isMyMessage(message.sender?.id) ? "text-blue-100" : "text-gray-500"}`}>
                                        {formatTime(message.createdAt)}
                                        {message.isTemp && " • Sending..."}
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
                        placeholder={isConnected ? "Type your message (Live)..." : "Type your message (API)..."}
                        className="flex-1"
                    />
                    <Button 
                        onClick={handleSendMessage} 
                        disabled={!newMessage.trim()}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    Mode: {isConnected ? '🟢 Real-time (Socket.IO)' : '🟡 Fallback (API)'}
                </p>
            </div>
        </div>
    );
}