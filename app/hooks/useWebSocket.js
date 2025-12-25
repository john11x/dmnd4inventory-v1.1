import { useEffect, useRef, useState } from 'react';

/**
 * WebSocket hook for real-time inventory updates
 * Implements reconnection logic and message queuing
 */
export function useWebSocket(url, options = {}) {
  const {
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    onMessage,
    onConnect,
    onDisconnect,
    onError
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [lastMessage, setLastMessage] = useState(null);
  
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const messageQueueRef = useRef([]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      setConnectionStatus('connecting');
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
        
        // Send queued messages
        while (messageQueueRef.current.length > 0) {
          const message = messageQueueRef.current.shift();
          wsRef.current.send(JSON.stringify(message));
        }
        
        onConnect?.();
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
          onMessage?.(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        setConnectionStatus('disconnected');
        onDisconnect?.();
        
        // Attempt reconnection
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            setConnectionStatus('reconnecting');
            connect();
          }, reconnectInterval);
        }
      };

      wsRef.current.onerror = (error) => {
        setConnectionStatus('error');
        onError?.(error);
      };

    } catch (error) {
      setConnectionStatus('error');
      onError?.(error);
    }
  }, [url, reconnectInterval, maxReconnectAttempts, onConnect, onDisconnect, onError, onMessage]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  const sendMessage = useCallback((message) => {
    const messageToSend = typeof message === 'string' ? message : JSON.stringify(message);
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(messageToSend);
    } else {
      // Queue message for when connection is restored
      messageQueueRef.current.push(message);
    }
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    connectionStatus,
    lastMessage,
    sendMessage,
    disconnect,
    reconnect: connect
  };
}

/**
 * Real-time inventory management hook
 */
export function useRealTimeInventory() {
  const [inventoryUpdates, setInventoryUpdates] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);

  const { 
    isConnected, 
    connectionStatus, 
    lastMessage, 
    sendMessage 
  } = useWebSocket('ws://localhost:8080/ws/inventory', {
    onMessage: (message) => {
      switch (message.type) {
        case 'STOCK_UPDATE':
          setInventoryUpdates(prev => [message.data, ...prev.slice(0, 99)]);
          break;
          
        case 'STOCK_ALERT':
          setStockAlerts(prev => [message.data, ...prev.slice(0, 49)]);
          break;
          
        case 'BULK_UPDATE':
          setInventoryUpdates(prev => [...message.data, ...prev.slice(0, 99)]);
          break;
          
        default:
          console.log('Unknown message type:', message.type);
      }
    },
    onConnect: () => {
      console.log('Real-time inventory connected');
      // Subscribe to inventory updates
      sendMessage({ type: 'SUBSCRIBE', channel: 'inventory' });
    },
    onDisconnect: () => {
      console.log('Real-time inventory disconnected');
    }
  });

  const requestStockUpdate = useCallback((productId) => {
    sendMessage({
      type: 'REQUEST_STOCK',
      productId
    });
  }, [sendMessage]);

  const clearAlerts = useCallback(() => {
    setStockAlerts([]);
  }, []);

  return {
    isConnected,
    connectionStatus,
    inventoryUpdates,
    stockAlerts,
    requestStockUpdate,
    clearAlerts,
    lastUpdate: lastMessage
  };
}
