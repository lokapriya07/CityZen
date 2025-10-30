// components/SocketDebugger.js
import React, { useState, useEffect } from 'react';
import { useWebSocket } from './citizen/hooks/useWebSocket';

export function SocketDebugger() {
    const [logs, setLogs] = useState([]);
    const [isVisible, setIsVisible] = useState(true);

    const addLog = (message) => {
        console.log(`[DEBUG] ${message}`); // Also log to console
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const handleSocketMessage = (data) => {
        addLog(`Received: ${data.type} - ${JSON.stringify(data).substring(0, 100)}`);
    };

    const { isConnected, socket, sendMessage, joinTaskChat } = useWebSocket(handleSocketMessage);

    useEffect(() => {
        addLog(`Connection: ${isConnected ? 'Connected' : 'Disconnected'}`);
    }, [isConnected]);

    useEffect(() => {
        if (socket) {
            addLog(`Socket created: ${socket.id}`);
        }
    }, [socket]);

    const testConnection = () => {
        addLog('=== Testing Connection ===');
        const token = localStorage.getItem('authToken') || localStorage.getItem('workerToken');
        addLog(`Token exists: ${!!token}`);
        addLog(`Token length: ${token?.length}`);
        addLog(`Socket ID: ${socket?.id}`);
        addLog(`Socket connected: ${socket?.connected}`);
        addLog(`Socket readyState: ${socket?.readyState}`);
        addLog(`=== End Test ===`);
    };

    const testMessage = () => {
        addLog('Sending test message...');
        const success = sendMessage({
            taskId: 'test-task-id',
            message: 'Test message from debugger',
            messageType: 'text'
        });
        addLog(`Send result: ${success}`);
    };

    if (!isVisible) {
        return (
            <button 
                onClick={() => setIsVisible(true)}
                style={{
                    position: 'fixed',
                    top: 10,
                    right: 10,
                    background: 'red',
                    color: 'white',
                    padding: '5px 10px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    zIndex: 10000
                }}
            >
                Debug
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            top: 10,
            right: 10,
            background: 'white',
            padding: '10px',
            border: '2px solid #ccc',
            borderRadius: '8px',
            zIndex: 10000,
            maxHeight: '400px',
            width: '500px',
            overflow: 'auto',
            fontSize: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: 0 }}>Socket.IO Debugger</h4>
                <button onClick={() => setIsVisible(false)} style={{ background: 'red', color: 'white', border: 'none', borderRadius: '3px', padding: '2px 8px' }}>
                    X
                </button>
            </div>
            
            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <button onClick={testConnection} style={{ padding: '5px 8px', background: '#007bff', color: 'white', border: 'none', borderRadius: '3px' }}>
                    Test Connection
                </button>
                <button onClick={testMessage} style={{ padding: '5px 8px', background: '#28a745', color: 'white', border: 'none', borderRadius: '3px' }}>
                    Test Message
                </button>
                <button onClick={() => setLogs([])} style={{ padding: '5px 8px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '3px' }}>
                    Clear Logs
                </button>
            </div>
            
            <div style={{ marginBottom: '10px', padding: '5px', background: isConnected ? '#d4edda' : '#f8d7da', borderRadius: '3px' }}>
                <strong>Status:</strong> 
                <span style={{ color: isConnected ? 'green' : 'red', marginLeft: '5px' }}>
                    ● {isConnected ? `Connected (${socket?.id})` : 'Disconnected'}
                </span>
            </div>
            
            <div style={{ border: '1px solid #ddd', borderRadius: '3px', padding: '5px', background: '#f8f9fa' }}>
                <strong>Recent Logs:</strong>
                <div style={{ maxHeight: '200px', overflow: 'auto', marginTop: '5px' }}>
                    {logs.slice(-15).map((log, i) => (
                        <div key={i} style={{ padding: '2px 0', borderBottom: '1px solid #eee', fontFamily: 'monospace' }}>
                            {log}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SocketDebugger;