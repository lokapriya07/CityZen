// WorkerEmergencyMessaging.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader2, Clock } from "lucide-react";
import { io } from "socket.io-client";

const SOCKET_URL = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8001") : "";
const getAuthToken = () => localStorage.getItem("authToken");

export default function WorkerEmergencyMessaging({ task, worker, onClose, messageHistory = [], onNewMessage }) {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messageHistory && messageHistory.length > 0) {
            setMessages(messageHistory.map(m => formatMessage(m)));
        }
    }, [messageHistory]);

    useEffect(() => {
        const token = getAuthToken();
        if (!token || !task?.id) return;

        const socket = io(SOCKET_URL, {
            auth: { token },
            transports: ["websocket"],
            reconnection: true,
        });
        socketRef.current = socket;

        socket.on("connect", () => {
            setIsConnected(true);
            socket.emit("join_task_chat", { taskId: task.id, userType: 'worker' });
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
        });

        socket.on("message_history", (payload) => {
            if (payload?.taskId !== task.id) return;
            setMessages((payload.messages || []).map(m => formatMessage(m)));
            scrollToBottom();
        });

        socket.on("new_message", (msg) => {
            if (!msg || msg.taskId !== task.id) return;
            const formatted = formatMessage(msg);
            setMessages(prev => {
                const exists = prev.some(pm => pm.id === formatted.id || (pm.isOptimistic && pm.message === formatted.message && pm.createdAt === formatted.createdAt));
                if (exists) {
                    return prev.map(pm => (pm.id === formatted.id || (pm.isOptimistic && pm.message === formatted.message && pm.createdAt === formatted.createdAt)) ? formatted : pm);
                }
                return [...prev, formatted];
            });
            onNewMessage && onNewMessage(task.id, formatted);
            scrollToBottom();
        });

        socket.on("socket_error", (payload) => {
            console.error("Socket error:", payload);
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [task?.id]);

    const formatMessage = (msg) => {
        return {
            id: msg.id || msg._id || `optimistic_${Date.now()}`,
            taskId: msg.taskId || task.id,
            sender: {
                id: msg.sender?.id || msg.sender?._id || 'unknown',
                name: msg.sender?.name || (msg.sender?._id === worker?.id ? 'You' : 'Unknown User'),
                role: msg.sender?.role || 'user',
                avatar: msg.sender?.avatar || null,
            },
            message: msg.message || 'No content',
            messageType: msg.messageType || 'text',
            createdAt: msg.createdAt || new Date().toISOString(),
            isRead: msg.isRead !== undefined ? msg.isRead : true,
            isOptimistic: !!msg.isOptimistic,
            failed: !!msg.failed
        };
    };

    const scrollToBottom = () => {
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
    };

    const handleSendMessage = async () => {
        const text = inputMessage.trim();
        if (!text) return;

        const timestamp = new Date().toISOString();
        const optimistic = formatMessage({
            id: `optimistic_${Date.now()}`,
            taskId: task.id,
            sender: { id: worker?.id || 'worker', name: 'You', role: 'worker' },
            message: text,
            createdAt: timestamp,
            isOptimistic: true
        });

        setMessages(prev => [...prev, optimistic]);
        onNewMessage && onNewMessage(task.id, optimistic);
        setInputMessage("");
        setIsSending(true);
        scrollToBottom();

        const socket = socketRef.current;
        if (socket && socket.connected) {
            socket.emit("send_message", { taskId: task.id, message: text, messageType: "text" });
            // Server will emit new_message with saved message
        } else {
            // Fallback to REST
            try {
                const token = getAuthToken();
                const res = await fetch(`/api/messages/send`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ taskId: task.id, message: text, messageType: "text" }),
                });
                const data = await res.json();
                if (res.ok && data.success) {
                    const saved = formatMessage(data.data);
                    setMessages(prev => prev.map(m => m.id === optimistic.id ? saved : m));
                    onNewMessage && onNewMessage(task.id, saved);
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl h-[80vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <h3 className="text-lg font-semibold">Chat with Citizen</h3>
                        <p className="text-sm text-gray-500">Task: {task.displayId} | {messages.length} messages</p>
                    </div>
                    <div>
                        <button onClick={() => socketRef.current?.emit("join_task_chat", { taskId: task.id, userType: 'worker' })} className="p-1 text-gray-500 hover:text-gray-700">
                            <Loader2 className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                        <button onClick={onClose} className="ml-2 text-gray-500 hover:text-gray-700">✕</button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {messages.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            <div className="text-lg mb-2">💬</div>
                            <p>No messages yet.</p>
                            <p className="text-sm">Start the conversation with the citizen!</p>
                        </div>
                    ) : messages.map((m, idx) => (
                        <div key={m.id + idx} className={`flex mb-4 ${m.sender.name === 'You' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs px-4 py-2 rounded-lg text-sm ${m.sender.name === 'You' ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'} ${m.failed ? 'border border-red-500' : ''}`}>
                                {!(m.sender.name === 'You') && <div className="font-bold text-xs mb-1 capitalize">{m.sender?.name || 'User'}</div>}
                                <div className="text-sm">{m.message}</div>
                                <div className={`text-xs mt-1 ${m.sender.name === 'You' ? 'text-green-200' : 'text-gray-500'} flex items-center gap-1`}>
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
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                            disabled={isSending}
                        />
                        <button onClick={handleSendMessage} disabled={!inputMessage.trim() || isSending} className="bg-green-600 text-white px-6 rounded-r-lg disabled:opacity-50 hover:bg-green-700 transition-colors">
                            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
