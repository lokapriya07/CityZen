// hooks/useSocketIO.js - UPDATED VERSION
import { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';

export const useSocketIO = (onMessage) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [socketId, setSocketId] = useState(null);

    const connect = useCallback(() => {
        try {
            // Get the correct token based on user type
            const token = localStorage.getItem('authToken') || localStorage.getItem('workerToken');
            console.log('🔌 Connecting to Socket.IO...');
            
            if (!token) {
                console.error('❌ No authentication token found in localStorage');
                return;
            }

            // IMPORTANT: Use the correct URL and query parameter
            const newSocket = io('http://localhost:8001', {
                query: {
                    token: token
                },
                transports: ['websocket', 'polling'],
                timeout: 10000
            });

            newSocket.on('connect', () => {
                console.log('✅ SOCKET CONNECTED! ID:', newSocket.id);
                setIsConnected(true);
                setSocketId(newSocket.id);
                setSocket(newSocket);
                
                // Send connection confirmation
                if (onMessage) {
                    onMessage({
                        type: "connected",
                        message: "Socket connected successfully",
                        socketId: newSocket.id
                    });
                }
            });

            newSocket.on('disconnect', (reason) => {
                console.log('🔌 Socket disconnected:', reason);
                setIsConnected(false);
                setSocketId(null);
            });

            newSocket.on('connect_error', (error) => {
                console.error('❌ Socket connection error:', error);
            });

            // Listen for ALL events
            const events = [
                'connected', 'new_message', 'message_history', 
                'joined_task_chat', 'socket_error', 'user_typing', 'user_stopped_typing'
            ];

            events.forEach(event => {
                newSocket.on(event, (data) => {
                    console.log(`📨 Received ${event}:`, data);
                    if (onMessage) {
                        onMessage({
                            type: event,
                            ...data
                        });
                    }
                });
            });

        } catch (error) {
            console.error('❌ Socket setup error:', error);
        }
    }, [onMessage]);

    const disconnect = useCallback(() => {
        if (socket) {
            console.log('🔌 Disconnecting socket...');
            socket.disconnect();
        }
    }, [socket]);

    const sendMessage = useCallback((messageData) => {
        if (socket && socket.connected) {
            console.log('📤 EMITTING send_message:', messageData);
            socket.emit('send_message', messageData);
            return true;
        } else {
            console.error('❌ Socket not connected. Current state:', socket?.connected);
            return false;
        }
    }, [socket]);

    const joinTaskChat = useCallback((taskId) => {
        if (socket && socket.connected) {
            console.log('🚪 EMITTING join_task_chat:', taskId);
            socket.emit('join_task_chat', { taskId });
            return true;
        } else {
            console.error('❌ Socket not connected. Cannot join chat.');
            return false;
        }
    }, [socket]);

    useEffect(() => {
        connect();
        
        return () => {
            disconnect();
        };
    }, [connect, disconnect]);

    return {
        socket,
        isConnected,
        socketId,
        sendMessage,
        joinTaskChat,
        reconnect: connect
    };
};