// import { useState, useEffect, useRef, useCallback } from 'react';

// export const useWebSocket = (onMessage) => {
//     const [socket, setSocket] = useState(null);
//     const [isConnected, setIsConnected] = useState(false);
//     const reconnectTimeoutRef = useRef(null);

//     const connect = useCallback(() => {
//         try {
//             const token = localStorage.getItem('authToken') || localStorage.getItem('workerToken');
//             if (!token) {
//                 console.error('No authentication token found');
//                 return;
//             }

//             const wsUrl = `ws://localhost:8001?token=${encodeURIComponent(token)}`;
//             console.log('🔌 Connecting to WebSocket...');
            
//             const newSocket = new WebSocket(wsUrl);

//             newSocket.onopen = () => {
//                 console.log('✅ WebSocket connected successfully');
//                 setIsConnected(true);
//                 setSocket(newSocket);
//             };

//             newSocket.onmessage = (event) => {
//                 try {
//                     const data = JSON.parse(event.data);
//                     if (onMessage) {
//                         onMessage(data);
//                     }
//                 } catch (error) {
//                     console.error('Error parsing WebSocket message:', error);
//                 }
//             };

//             newSocket.onclose = () => {
//                 console.log('🔌 WebSocket disconnected');
//                 setIsConnected(false);
//                 setSocket(null);
                
//                 // Auto-reconnect after 3 seconds
//                 reconnectTimeoutRef.current = setTimeout(() => {
//                     console.log('🔄 Attempting to reconnect...');
//                     connect();
//                 }, 3000);
//             };

//             newSocket.onerror = (error) => {
//                 console.error('WebSocket error:', error);
//             };

//         } catch (error) {
//             console.error('WebSocket connection error:', error);
//         }
//     }, [onMessage]);

//     const disconnect = useCallback(() => {
//         if (reconnectTimeoutRef.current) {
//             clearTimeout(reconnectTimeoutRef.current);
//         }
//         if (socket) {
//             socket.close();
//         }
//     }, [socket]);

//     const sendMessage = useCallback((data) => {
//         if (socket && socket.readyState === WebSocket.OPEN) {
//             socket.send(JSON.stringify(data));
//             return true;
//         }
//         return false;
//     }, [socket]);

//     useEffect(() => {
//         connect();
//         return () => disconnect();
//     }, [connect, disconnect]);

//     return { 
//         socket, 
//         isConnected, 
//         sendMessage,
//         reconnect: connect
//     };
// };

// hooks/useWebSocket.js
import { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';

export const useWebSocket = (onMessage) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const reconnectTimeoutRef = useRef(null);

    const connect = useCallback(() => {
        try {
            const token = localStorage.getItem('authToken') || localStorage.getItem('workerToken');
            if (!token) {
                console.error('❌ No authentication token found');
                return;
            }

            console.log('🔌 Connecting to Socket.IO...');
            
            // Create Socket.IO instance
            const newSocket = io('http://localhost:8001', {
                query: {
                    token: token
                },
                transports: ['websocket', 'polling'],
                timeout: 10000,
                forceNew: true
            });

            newSocket.on('connect', () => {
                console.log('✅ Socket.IO connected successfully!', newSocket.id);
                setIsConnected(true);
                setSocket(newSocket);
            });

            newSocket.on('disconnect', (reason) => {
                console.log('🔌 Socket.IO disconnected:', reason);
                setIsConnected(false);
                setSocket(null);
                
                // Auto-reconnect after 3 seconds
                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log('🔄 Attempting to reconnect...');
                    connect();
                }, 3000);
            });

            newSocket.on('connect_error', (error) => {
                console.error('❌ Socket.IO connection failed:', error);
                console.error('Connection error details:', error.message);
            });

            // Handle all message types
            newSocket.onAny((eventName, ...args) => {
                console.log(`📨 Socket event: ${eventName}`, args[0]);
                if (onMessage && args[0]) {
                    onMessage(args[0]);
                }
            });

            setSocket(newSocket);

        } catch (error) {
            console.error('❌ Socket connection error:', error);
        }
    }, [onMessage]);

    const disconnect = useCallback(() => {
        console.log('🔌 Disconnecting socket...');
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        if (socket) {
            socket.disconnect();
            socket.removeAllListeners();
        }
    }, [socket]);

    const sendMessage = useCallback((data) => {
        if (socket && socket.connected) {
            console.log('📤 Sending message via socket:', data);
            socket.emit('send_message', data);
            return true;
        } else {
            console.error('❌ Socket not connected. Current state:', socket?.connected ? 'connected' : 'disconnected');
            return false;
        }
    }, [socket]);

    const joinTaskChat = useCallback((taskId) => {
        if (socket && socket.connected) {
            console.log(`🚪 Joining task chat: ${taskId}`);
            socket.emit('join_task_chat', { taskId });
            return true;
        } else {
            console.error('❌ Socket not connected. Cannot join task chat.');
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
        sendMessage,
        joinTaskChat,
        reconnect: connect,
        disconnect
    };
};