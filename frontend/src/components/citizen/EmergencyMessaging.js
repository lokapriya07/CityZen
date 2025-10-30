// EmergencyMessaging.jsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { X, Send, MapPin, Clock, Loader2 } from 'lucide-react';
import { io } from "socket.io-client";

// Replace with actual socket URL or env var
const SOCKET_URL = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8001") : "";

const getAuthToken = () => localStorage.getItem("authToken");

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

    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // format pre-provided history
        if (messageHistory && messageHistory.length > 0) {
            setMessages(messageHistory.map(m => formatMessage(m)));
        }
    }, [messageHistory]);

    // initialize socket
    useEffect(() => {
        const token = getAuthToken();
        if (!token || !taskId) {
            setConnectionStatus("No token or task");
            return;
        }

        // create socket
        const socket = io(SOCKET_URL, {
            auth: { token },
            transports: ["websocket"],
            autoConnect: true,
            reconnection: true,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            setIsConnected(true);
            setConnectionStatus("Connected");
            // join the task room
            socket.emit("join_task_chat", { taskId, userType });
        });

        socket.on("disconnect", (reason) => {
            setIsConnected(false);
            setConnectionStatus("Disconnected");
        });

        socket.on("connect_error", (err) => {
            setConnectionStatus("Conn error");
            console.error("Socket connect_error:", err);
        });

        socket.on("message_history", (payload) => {
            if (payload?.taskId !== taskId) return;
            const formatted = (payload.messages || []).map(m => formatMessage(m));
            setMessages(formatted);
            scrollToBottom();
        });

        // server broadcasts new messages
        socket.on("new_message", (msg) => {
            if (!msg || msg.taskId !== taskId) return;
            const formatted = formatMessage(msg);

            setMessages(prev => {
                // replace optimistic if matches by createdAt or id
                const exists = prev.some(pm => pm.id === formatted.id || (pm.isOptimistic && pm.message === formatted.message && pm.createdAt === formatted.createdAt));
                if (exists) {
                    return prev.map(pm => (pm.id === formatted.id || (pm.isOptimistic && pm.message === formatted.message && pm.createdAt === formatted.createdAt)) ? formatted : pm);
                }
                return [...prev, formatted];
            });

            // persist through parent handler
            onNewMessage && onNewMessage(taskId, formatted);
            scrollToBottom();
        });

        socket.on("socket_error", (payload) => {
            console.error("Socket error:", payload);
        });

        // cleanup
        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [taskId, userType]);

    const scrollToBottom = () => {
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
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
        const isSelf = msg.sender?.id === currentUserId || msg.sender?.id === msg.sender?._id || (msg.sender && (msg.sender.name === 'You'));

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

    const handleSendMessage = async () => {
        const text = inputMessage.trim();
        if (!text) return;

        const timestamp = new Date().toISOString();
        const currentUserId = getCurrentUserId();

        const optimistic = formatMessage({
            id: `optimistic_${Date.now()}`,
            taskId,
            sender: { id: currentUserId, name: 'You', role: userType },
            message: text,
            messageType: "text",
            createdAt: timestamp,
            isOptimistic: true
        });

        // optimistic UI + persist via parent
        setMessages(prev => [...prev, optimistic]);
        onNewMessage && onNewMessage(taskId, optimistic);

        setInputMessage("");
        setIsSending(true);
        scrollToBottom();

        const socket = socketRef.current;
        if (socket && socket.connected) {
            // Emit to server
            socket.emit("send_message", { taskId, message: text, messageType: "text" }, (ack) => {
                // optional ack from server (if you implement)
            });
            // The server will reply with "new_message" (saved message), which will replace optimistic
        } else {
            // Fallback to REST when socket not connected
            try {
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
                if (res.ok && data.success) {
                    // Replace optimistic with returned saved message
                    const saved = formatMessage(data.data);
                    setMessages(prev => prev.map(m => m.id === optimistic.id ? saved : m));
                    onNewMessage && onNewMessage(taskId, saved);
                } else {
                    setMessages(prev => prev.map(m => m.id === optimistic.id ? { ...m, failed: true } : m));
                }
            } catch (err) {
                console.error("Fallback send error:", err);
                setMessages(prev => prev.map(m => m.id === optimistic.id ? { ...m, failed: true } : m));
            }
        }

        setIsSending(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const partnerName = userType === 'citizen' ? (worker?.name || 'Worker') : (citizen?.name || 'Citizen');

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">{partnerName}</h3>
                    <p className="text-xs text-gray-500">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {connectionStatus} | {messages.length} messages
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => {
                        setIsLoading(true);
                        // trigger server reload of messages
                        socketRef.current?.emit("join_task_chat", { taskId, userType });
                        setTimeout(() => setIsLoading(false), 600);
                    }} disabled={isLoading}>
                        <Loader2 className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 pt-10">
                        <div className="text-lg mb-2">💬</div>
                        <p>No messages yet.</p>
                        <p className="text-sm">Start a conversation with {partnerName}!</p>
                    </div>
                ) : messages.map((m, i) => (
                    <div key={m.id + i} className={`flex mb-4 ${m.sender.name === 'You' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm shadow-md ${m.sender.name === 'You' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'} ${m.isOptimistic ? 'opacity-70' : ''} ${m.failed ? 'border border-red-500' : ''}`}>
                            {!(m.sender.name === 'You') && <div className="font-bold text-xs mb-1 text-blue-800 capitalize">{m.sender.name}</div>}
                            <div className="text-sm whitespace-pre-wrap break-words">{m.message}</div>
                            <div className={`text-xs mt-1 flex items-center gap-1 ${m.sender.name === 'You' ? 'text-blue-200' : 'text-gray-500'}`}>
                                <Clock className="w-3 h-3" />
                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                {m.isOptimistic && <span className="italic"> • Sending...</span>}
                                {m.failed && <span className="text-red-400"> • Failed</span>}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-white">
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder={isConnected ? `Type a message to ${partnerName}...` : "Connecting..."}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                        disabled={!isConnected && !socketRef.current}
                    />
                    <Button onClick={handleSendMessage} className="rounded-l-none rounded-r-lg px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors" disabled={(inputMessage.trim() === "") || isSending}>
                        {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </div>

                {!isConnected && <p className="text-xs text-red-500 mt-2 flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span> Connection issues. Messages may use fallback send.</p>}
            </div>
        </div>
    );
}
