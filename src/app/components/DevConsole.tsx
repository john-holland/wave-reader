import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { AppTome } from '../tomes/AppTome';
import { FeatureToggleService } from '../../config/feature-toggles';

interface ConsoleMessage {
  id: number;
  timestamp: number;
  type: 'log' | 'warn' | 'error';
  message: string;
  args: any[];
}

const ConsoleContainer = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 400px;
  max-height: 300px;
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid #444;
  border-radius: 8px;
  color: #fff;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 11px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const ConsoleHeader = styled.div`
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid #444;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
  user-select: none;
`;

const ConsoleTitle = styled.div`
  font-weight: 600;
  font-size: 12px;
  color: #fff;
`;

const ConsoleControls = styled.div`
  display: flex;
  gap: 8px;
`;

const ConsoleButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #555;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 10px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &:active {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ConsoleMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
`;

const MessageLine = styled.div<{ type: 'log' | 'warn' | 'error' }>`
  display: flex;
  gap: 8px;
  padding: 4px 6px;
  border-radius: 3px;
  background: ${props => {
    if (props.type === 'error') return 'rgba(255, 0, 0, 0.2)';
    if (props.type === 'warn') return 'rgba(255, 255, 0, 0.15)';
    return 'transparent';
  }};
  word-break: break-word;
  line-height: 1.4;

  &:hover {
    background: ${props => {
      if (props.type === 'error') return 'rgba(255, 0, 0, 0.3)';
      if (props.type === 'warn') return 'rgba(255, 255, 0, 0.25)';
      return 'rgba(255, 255, 255, 0.1)';
    }};
  }
`;

const MessageTime = styled.span`
  color: #888;
  font-size: 10px;
  flex-shrink: 0;
  min-width: 60px;
`;

const MessageContent = styled.span<{ type: 'log' | 'warn' | 'error' }>`
  flex: 1;
  color: ${props => {
    if (props.type === 'error') return '#ff6b6b';
    if (props.type === 'warn') return '#ffd93d';
    return '#e0e0e0';
  }};
`;

const MessageCount = styled.span`
  color: #888;
  font-size: 10px;
  margin-left: 8px;
`;

// Wave Reader message patterns to filter
const WAVE_READER_PATTERNS = [
  '🌊',
  '⚙️',
  'Wave Reader',
  'App Component',
  'SettingsTomes',
  'ContentSystem',
  'Message Router',
  'Epileptic blacklist',
  'KeyChordService',
  'Log-View-Machine',
  'Integrated System',
  'Background System'
];

function isWaveReaderMessage(message: string): boolean {
  return WAVE_READER_PATTERNS.some(pattern => message.includes(pattern));
}

function formatMessage(args: any[]): string {
  return args
    .map(arg => {
      if (typeof arg === 'string') {
        return arg;
      } else if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg, null, 0);
        } catch {
          return String(arg);
        }
      } else {
        return String(arg);
      }
    })
    .join(' ');
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  });
}

export const DevConsole: React.FC = () => {
  const [messages, setMessages] = useState<ConsoleMessage[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messageId, setMessageId] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const maxMessages = 200;

  // Auto-scroll to bottom only if user hasn't manually scrolled up
  useEffect(() => {
    if (messagesEndRef.current && messagesContainerRef.current && shouldAutoScroll) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldAutoScroll]);

  // Track scroll position to determine if we should auto-scroll
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
      setShouldAutoScroll(isNearBottom);
    }
  };

  // Check developer mode feature toggle
  useEffect(() => {
    const checkDeveloperMode = async () => {
      try {
        const appTomeRouter = AppTome.getRouter();
        const bgProxyMachine = appTomeRouter?.resolve('BackgroundProxyMachine');
        const robotCopy = bgProxyMachine?.robotCopy || null;
        
        const toggleService = new FeatureToggleService(robotCopy);
        const enabled = await toggleService.isEnabled('DEVELOPER_MODE');
        setIsDeveloperMode(enabled);
      } catch (error) {
        console.warn('Failed to check developer mode feature toggle, defaulting to disabled', error);
        setIsDeveloperMode(false);
      }
    };

    checkDeveloperMode();
  }, []);

  useEffect(() => {
    // Store original console methods
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    // Override console.log
    console.log = (...args: any[]) => {
      originalLog.apply(console, args);
      const message = formatMessage(args);
      if (isWaveReaderMessage(message)) {
        setMessageId(prev => {
          const id = prev + 1;
          const newMessage: ConsoleMessage = { id, timestamp: Date.now(), type: 'log' as const, message, args };
          setMessages(prevMessages => {
            const newMessages = [...prevMessages, newMessage];
            return newMessages.slice(-maxMessages);
          });
          return id;
        });
      }
    };

    // Override console.warn
    console.warn = (...args: any[]) => {
      originalWarn.apply(console, args);
      const message = formatMessage(args);
      if (isWaveReaderMessage(message)) {
        setMessageId(prev => {
          const id = prev + 1;
          const newMessage: ConsoleMessage = { id, timestamp: Date.now(), type: 'warn' as const, message, args };
          setMessages(prevMessages => {
            const newMessages = [...prevMessages, newMessage];
            return newMessages.slice(-maxMessages);
          });
          return id;
        });
      }
    };

    // Override console.error
    console.error = (...args: any[]) => {
      originalError.apply(console, args);
      const message = formatMessage(args);
      if (isWaveReaderMessage(message)) {
        setMessageId(prev => {
          const id = prev + 1;
          const newMessage: ConsoleMessage = { id, timestamp: Date.now(), type: 'error' as const, message, args };
          setMessages(prevMessages => {
            const newMessages = [...prevMessages, newMessage];
            return newMessages.slice(-maxMessages);
          });
          return id;
        });
      }
    };

    // Cleanup: restore original console methods
    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  const handleClear = () => {
    setMessages([]);
    setShouldAutoScroll(true);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isDeveloperMode) {
    return null;
  }

  if (isMinimized) {
    return (
      <ConsoleContainer style={{ height: 'auto', maxHeight: 'none' }}>
        <ConsoleHeader onClick={handleMinimize}>
          <ConsoleTitle>🌊 Dev Console ({messages.length})</ConsoleTitle>
        </ConsoleHeader>
      </ConsoleContainer>
    );
  }

  return (
    <ConsoleContainer>
      <ConsoleHeader>
        <ConsoleTitle>🌊 Dev Console</ConsoleTitle>
        <ConsoleControls>
          <ConsoleButton onClick={handleClear}>Clear</ConsoleButton>
          <ConsoleButton onClick={handleMinimize}>−</ConsoleButton>
        </ConsoleControls>
      </ConsoleHeader>
      <ConsoleMessages ref={messagesContainerRef} onScroll={handleScroll}>
        {messages.length === 0 ? (
          <MessageLine type="log">
            <MessageContent type="log">No messages yet...</MessageContent>
          </MessageLine>
        ) : (
          messages.map(msg => (
            <MessageLine key={msg.id} type={msg.type}>
              <MessageTime>{formatTime(msg.timestamp)}</MessageTime>
              <MessageContent type={msg.type}>{msg.message}</MessageContent>
            </MessageLine>
          ))
        )}
        <div ref={messagesEndRef} />
      </ConsoleMessages>
    </ConsoleContainer>
  );
};

