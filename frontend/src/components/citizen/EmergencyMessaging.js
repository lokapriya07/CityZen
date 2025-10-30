"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { X, Send, Clock, Loader2 } from 'lucide-react';
import { io } from "socket.io-client";

const SOCKET_URL = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8001") : "";

const getAuthToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("authToken");
    }
    return null;
};

// ✅ Message deduplication utility
const useMessageDeduplication = () => {
    const messageIds = useRef(new Set());

    const addMessageId = useCallback((id) => {
        messageIds.current.add(id);
    }, []);

    const hasMessageId = useCallback((id) => {
        return messageIds.current.has(id);
    }, []);

    const clearMessageIds = useCallback(() => {
        messageIds.current.clear();
    }, []);

    return { addMessageId, hasMessageId, clearMessageIds };
};

export function EmergencyMessaging({
    userType,
    taskId,
    worker,
    citizen,
    onClose,
    messageHistory = [],
    onNewMessage
}) {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("Connecting...");
    const [hasJoinedRoom, setHasJoinedRoom] = useState(false);

    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const { addMessageId, hasMessageId, clearMessageIds } = useMessageDeduplication();

    // ✅ FIXED: Reset when taskId changes
    useEffect(() => {
        clearMessageIds();
        setMessages([]);
        setHasJoinedRoom(false);
    }, [taskId, clearMessageIds]);

    // ✅ FIXED: Initialize with provided history
    useEffect(() => {
        if (messageHistory && messageHistory.length > 0 && taskId) {
            console.log("📚 Initializing with message history:", messageHistory.length);
            const formatted = messageHistory.map(m => formatMessage(m));

            // Filter duplicates
            const uniqueMessages = formatted.filter(msg => !hasMessageId(msg.id));
            uniqueMessages.forEach(msg => addMessageId(msg.id));

            setMessages(uniqueMessages);
            scrollToBottom();
        }
    }, [messageHistory, taskId, addMessageId, hasMessageId]);

    // ✅ FIXED: Socket initialization with proper cleanup
    useEffect(() => {
        const token = getAuthToken();
        if (!token || !taskId) {
            setConnectionStatus("No token or task");
            return;
        }

        console.log("🔌 Initializing socket connection...");

        const socket = io(SOCKET_URL, {
            auth: { token },
            transports: ["websocket", "polling"],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            timeout: 20000
        });

        socketRef.current = socket;

        const handleConnect = () => {
            console.log("✅ Socket connected");
            setIsConnected(true);
            setConnectionStatus("Connected");

            // Join task room immediately after connection
            console.log(`🚪 Joining task chat: ${taskId}`);
            socket.emit("join_task_chat", { taskId, userType });
        };

        const handleDisconnect = (reason) => {
            console.log("❌ Socket disconnected:", reason);
            setIsConnected(false);
            setConnectionStatus("Disconnected");
            setHasJoinedRoom(false);
        };

        const handleConnectError = (err) => {
            console.error("❌ Socket connect_error:", err);
            setConnectionStatus("Connection Failed");
        };

        const handleJoinedTaskChat = (data) => {
            console.log("✅ Successfully joined task chat:", data);
            setHasJoinedRoom(true);
        };

        // ✅ FIXED: Message history handler with duplicate prevention
        const handleMessageHistory = (payload) => {
            if (payload?.taskId !== taskId) return;

            console.log("📨 Received message history:", payload.messages?.length, "messages");

            const formatted = (payload.messages || []).map(m => formatMessage(m));

            // Filter out duplicates
            const uniqueMessages = formatted.filter(msg => !hasMessageId(msg.id));

            // Add new IDs to tracking set
            uniqueMessages.forEach(msg => addMessageId(msg.id));

            setMessages(prev => {
                // Merge and sort messages
                const allMessages = [...prev, ...uniqueMessages];
                const unique = allMessages.filter((msg, index, self) =>
                    index === self.findIndex(m => m.id === msg.id)
                );

                return unique.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            });

            scrollToBottom();

            // Mark messages as read
            socket.emit("mark_messages_read", { taskId });
        };

        // ✅ FIXED: New message handler with strict duplicate prevention
        const handleNewMessage = (msg) => {
            if (!msg || msg.taskId !== taskId) {
                console.log("⚠️ Ignoring message for different task");
                return;
            }

            console.log("📩 Received new message:", msg.id);

            // Strict duplicate check
            if (hasMessageId(msg.id)) {
                console.log("🔄 Duplicate message detected, ignoring:", msg.id);
                return;
            }

            const formatted = formatMessage(msg);
            addMessageId(formatted.id);

            setMessages(prev => {
                // Remove any optimistic message with same content
                const filtered = prev.filter(m =>
                    !m.isOptimistic ||
                    (m.isOptimistic && m.message !== formatted.message)
                );

                const newMessages = [...filtered, formatted];
                return newMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            });

            // Call parent handler
            onNewMessage && onNewMessage(taskId, formatted);
            scrollToBottom();

            // Mark as read
            socket.emit("mark_messages_read", { taskId });
        };

        const handleSocketError = (payload) => {
            console.error("Socket error:", payload);
            if (payload.message) {
                alert(`Chat Error: ${payload.message}`);
            }
        };

        // Register event listeners
        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", handleConnectError);
        socket.on("joined_task_chat", handleJoinedTaskChat);
        socket.on("message_history", handleMessageHistory);
        socket.on("new_message", handleNewMessage);
        socket.on("socket_error", handleSocketError);

        return () => {
            console.log("🧹 Cleaning up socket connection");

            // Remove all listeners
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleConnectError);
            socket.off("joined_task_chat", handleJoinedTaskChat);
            socket.off("message_history", handleMessageHistory);
            socket.off("new_message", handleNewMessage);
            socket.off("socket_error", handleSocketError);

            socket.disconnect();
            socketRef.current = null;
        };
    }, [taskId, userType, addMessageId, hasMessageId, onNewMessage]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 100);
    };

    const getCurrentUserId = () => {
        try {
            const token = getAuthToken();
            if (!token) return null;
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id;
        } catch (e) {
            return null;
        }
    };

    const formatMessage = (msg) => {
        const currentUserId = getCurrentUserId();
        const isSelf = msg.sender?.id === currentUserId;

        return {
            id: msg.id || msg._id || `optimistic_${Date.now()}_${Math.random()}`,
            taskId: msg.taskId,
            sender: {
                id: msg.sender?.id || msg.sender?._id || 'unknown',
                name: msg.sender?.name || (isSelf ? 'You' : 'Unknown User'),
                role: msg.sender?.role || 'user',
                avatar: msg.sender?.avatar || null,
            },
            message: msg.message || msg.content || 'No content',
            messageType: msg.messageType || 'text',
            createdAt: msg.createdAt || new Date().toISOString(),
            isRead: msg.isRead !== undefined ? msg.isRead : true,
            isOptimistic: !!msg.isOptimistic,
            failed: !!msg.failed
        };
    };

    // ✅ FIXED: Send message with robust error handling
    const handleSendMessage = async () => {
        const text = inputMessage.trim();
        if (!text || !taskId || !hasJoinedRoom) return;

        const timestamp = new Date().toISOString();
        const optimisticId = `optimistic_${timestamp}_${Math.random()}`;

        // Create optimistic message
        const optimisticMsg = formatMessage({
            id: optimisticId,
            taskId,
            sender: { id: getCurrentUserId(), name: 'You', role: userType },
            message: text,
            messageType: "text",
            createdAt: timestamp,
            isOptimistic: true
        });

        // Add to tracking set
        addMessageId(optimisticId);

        // Update UI optimistically
        setMessages(prev => {
            const newMessages = [...prev, optimisticMsg];
            return newMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        });
        setInputMessage("");
        setIsSending(true);
        scrollToBottom();

        const socket = socketRef.current;

        try {
            if (socket && socket.connected) {
                // Send via socket with acknowledgment
                socket.emit("send_message",
                    { taskId, message: text, messageType: "text" },
                    (ack) => {
                        if (ack && ack.success) {
                            console.log("✅ Message sent successfully via socket");
                            // The actual message will come via "new_message" event
                        } else {
                            throw new Error(ack?.error || "Socket send failed");
                        }
                    }
                );
            } else {
                // Fallback to REST API
                console.log("🔄 Socket not connected, using REST fallback");
                const token = getAuthToken();
                const res = await fetch(`/api/messages/send`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ taskId, message: text, messageType: "text" }),
                });

                const data = await res.json();
                if (!res.ok || !data.success) {
                    throw new Error(data.message || "REST send failed");
                }

                console.log("✅ Message sent successfully via REST");
            }
        } catch (err) {
            console.error("❌ Send message error:", err);
            // Mark optimistic message as failed
            setMessages(prev =>
                prev.map(m =>
                    m.id === optimisticId
                        ? { ...m, failed: true }
                        : m
                )
            );
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleReloadMessages = () => {
        if (socketRef.current) {
            setIsLoading(true);
            socketRef.current.emit("join_task_chat", { taskId, userType });
            setTimeout(() => setIsLoading(false), 1000);
        }
    };

    const partnerName = userType === 'citizen' || userType === 'user'
        ? (worker?.name || 'Worker')
        : (citizen?.name || 'Citizen');

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">{partnerName}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${isConnected && hasJoinedRoom ? 'bg-green-500' :
                                isConnected ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></span>
                        {isConnected && hasJoinedRoom ? 'Connected' :
                            isConnected ? 'Connecting to chat...' : 'Disconnected'}
                        <span className="ml-2">| {messages.length} messages</span>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleReloadMessages}
                        disabled={isLoading}
                        title="Reload messages"
                    >
                        <Loader2 className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        title="Close chat"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 min-h-0">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 pt-10">
                        <div className="text-2xl mb-2">💬</div>
                        <p className="font-medium">No messages yet</p>
                        <p className="text-sm mt-1">Start a conversation with {partnerName}!</p>
                        {!hasJoinedRoom && (
                            <p className="text-xs text-yellow-600 mt-2">
                                Connecting to chat room...
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender.name === 'You' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm shadow-sm ${message.sender.name === 'You'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                                    } ${message.isOptimistic ? 'opacity-70' : ''} ${message.failed ? 'border border-red-300 bg-red-50 text-red-800' : ''
                                    }`}>
                                    {message.sender.name !== 'You' && (
                                        <div className="font-semibold text-xs mb-1 text-blue-700 capitalize">
                                            {message.sender.name}
                                        </div>
                                    )}
                                    <div className="text-sm whitespace-pre-wrap break-words">
                                        {message.message}
                                    </div>
                                    <div className={`text-xs mt-1 flex items-center gap-1 ${message.sender.name === 'You' ? 'text-blue-200' : 'text-gray-500'
                                        }`}>
                                        <Clock className="w-3 h-3" />
                                        {new Date(message.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                        {message.isOptimistic && (
                                            <span className="italic"> • Sending...</span>
                                        )}
                                        {message.failed && (
                                            <span className="text-red-400"> • Failed to send</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-white">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder={
                            !isConnected ? "Connecting..." :
                                !hasJoinedRoom ? "Joining chat..." :
                                    `Type a message to ${partnerName}...`
                        }
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                        disabled={!isConnected || !hasJoinedRoom || isSending}
                    />
                    <Button
                        onClick={handleSendMessage}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                        disabled={!inputMessage.trim() || isSending || !isConnected || !hasJoinedRoom}
                    >
                        {isSending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </Button>
                </div>

                {!isConnected && (
                    <p className="text-xs text-red-500 mt-2 flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        Disconnected. Reconnecting...
                    </p>
                )}
                {isConnected && !hasJoinedRoom && (
                    <p className="text-xs text-yellow-600 mt-2 flex items-center">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                        Joining chat room...
                    </p>
                )}
            </div>
        </div>
    );
}