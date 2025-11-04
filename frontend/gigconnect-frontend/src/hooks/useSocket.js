import { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

export const useSocket = () => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Skip socket in production
    if (import.meta.env.PROD) {
      console.log('Socket.io disabled in production');
      return;
    }

    if (user && token && !socketRef.current) {
      // Lazy load socket.io-client
      import('socket.io-client').then((socketModule) => {
        const io = socketModule.default || socketModule.io;
        
        const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
          auth: {
            token: token
          },
          transports: ['websocket'],
          forceNew: true
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        newSocket.on('connect', () => {
          console.log('Connected to server');
          setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
          console.log('Disconnected from server');
          setIsConnected(false);
        });

        newSocket.on('error', (error) => {
          console.error('Socket error:', error);
        });
      }).catch((error) => {
        console.error('Failed to load socket.io-client:', error);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [user, token]);

  const emit = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    emit,
    on,
    off
  };
};