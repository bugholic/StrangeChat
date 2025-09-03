import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'stranger';
  timestamp: string;
}

type ConnectionState = 'disconnected' | 'searching' | 'connected' | 'chat-ended' | 'partner-disconnected';

export const useSocket = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to server
    const serverUrl = import.meta.env.DEV ? 'http://localhost:3001' : window.location.origin;
    socketRef.current = io(serverUrl);

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to server');
      setConnectionState('disconnected');
    });

    socket.on('searching', () => {
      setConnectionState('searching');
    });

    socket.on('partner-found', () => {
      setConnectionState('connected');
      setMessages([]);
    });

    socket.on('receive-message', (message: Omit<Message, 'sender'> & { sender: 'stranger' }) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('chat-ended', () => {
      setConnectionState('chat-ended');
    });

    socket.on('partner-disconnected', () => {
      setConnectionState('partner-disconnected');
    });

    socket.on('disconnect', () => {
      setConnectionState('disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const findPartner = () => {
    if (socketRef.current) {
      setConnectionState('searching');
      socketRef.current.emit('find-partner');
    }
  };

  const sendMessage = (text: string) => {
    if (socketRef.current && connectionState === 'connected') {
      const message: Message = {
        id: Date.now().toString(),
        text,
        sender: 'me',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, message]);
      socketRef.current.emit('send-message', { text });
    }
  };

  const endChat = () => {
    if (socketRef.current) {
      socketRef.current.emit('end-chat');
      setConnectionState('chat-ended');
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setConnectionState('disconnected');
  };

  return {
    connectionState,
    messages,
    findPartner,
    sendMessage,
    endChat,
    startNewChat
  };
};