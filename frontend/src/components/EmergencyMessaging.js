

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './citizen/ui/card';
import { Button } from './citizen/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './citizen/ui/avatar';
import { Input } from './citizen/ui/input';
import { Send, X } from 'lucide-react';
import io from 'socket.io-client';

export function EmergencyMessaging({ userType, taskId, worker, onClose }) {
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

        // Listen for ALL socket events with detailed logging
        newSocket.on('new_message', (data) => {
            console.log('💬 [FRONTEND] NEW MESSAGE RECEIVED:', data);
            setMessages(prev => [...prev, data]);
        });

        newSocket.on('message_history', (data) => {
            console.log('📚 [FRONTEND] MESSAGE HISTORY:', data.messages?.length, 'messages');
            setMessages(data.messages || []);
        });

        newSocket.on('joined_task_chat', (data) => {
            console.log('✅ [FRONTEND] JOINED CHAT:', data);
        });

        newSocket.on('socket_error', (error) => {
            console.error('❌ [FRONTEND] SOCKET ERROR:', error);
        });

        // Log any other events
        newSocket.onAny((eventName, ...args) => {
            console.log(`🔍 [FRONTEND] SOCKET EVENT [${eventName}]:`, args[0]);
        });

        setSocket(newSocket);

        return () => {
            console.log('🔌 Cleaning up socket connection');
            newSocket.disconnect();
        };
    }, []);

    // Join task chat when socket is connected
    useEffect(() => {
        if (socket && isConnected && taskId) {
            console.log('🚪 [FRONTEND] Joining task chat:', taskId);
            socket.emit('join_task_chat', { taskId });
        }
    }, [socket, isConnected, taskId]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        console.log("📤 [FRONTEND] SENDING MESSAGE:", newMessage);

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

        // Send via socket
        if (socket && isConnected) {
            console.log('📤 [FRONTEND] Emitting send_message via socket');
            socket.emit('send_message', {
                taskId: taskId,
                message: messageToSend,
                messageType: 'text'
            });
        } else {
            console.error('❌ [FRONTEND] Socket not connected, cannot send message');
        }

        // Remove temp status after a delay (will be replaced by real message)
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
        // For citizen: check if sender is citizen
        // For worker: check if sender is worker  
        return senderId === userType;
    };

    const getOtherUserName = () => {
        return userType === 'citizen' ? (worker?.name || "Worker") : "Citizen";
    };

    const getOtherUserAvatar = () => {
        return userType === 'citizen' ? worker?.avatar : null;
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
                            {isConnected ? `Online (${socket?.id})` : "Offline"}
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
                        <p className="text-xs mt-2">Status: {isConnected ? '✅ Connected' : '❌ Disconnected'}</p>
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
                        placeholder={isConnected ? "Type your message..." : "Connecting..."}
                        disabled={!isConnected}
                        className="flex-1"
                    />
                    <Button 
                        onClick={handleSendMessage} 
                        disabled={!newMessage.trim() || !isConnected}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    {isConnected ? '🟢 Real-time messaging active' : '🔴 Waiting for connection'}
                </p>
            </div>
        </div>
    );
}