import React, { useState, useRef, useEffect } from 'react';
import { Phone, Video, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { MessageComposer } from './message-composer';
import { MessageBubble } from './chat/message-bubble';
import { useI18n } from '../hooks/use-i18n';
import { Message, User, Conversation } from '../types';

interface ChatPanelProps {
  currentUserId: string;
  conversation?: Conversation & { id: string; otherUser: User };
  onVideoCall: (userId: string) => void;
}

export function ChatPanel({ currentUserId, conversation, onVideoCall }: ChatPanelProps) {
  const [messages, setMessages] = useState<Array<Message & { id: string }>>([]);
  const [isTypingVisible, setIsTypingVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock messages for demonstration
  useEffect(() => {
    if (conversation) {
      const mockMessages: Array<Message & { id: string }> = [
        {
          id: 'msg1',
          from: conversation.otherUser.phone,
          type: 'text',
          text: '¡Hola! ¿Cómo estás?',
          status: 'read',
          reactions: {},
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          deletedFor: []
        },
        {
          id: 'msg2',
          from: currentUserId,
          type: 'text',
          text: '¡Muy bien, gracias! ¿Y tú qué tal?',
          status: 'read',
          reactions: {},
          createdAt: new Date(Date.now() - 3500000).toISOString(),
          deletedFor: []
        },
        {
          id: 'msg3',
          from: conversation.otherUser.phone,
          type: 'text',
          text: 'Genial, trabajando en el nuevo proyecto. ¿Has visto los últimos cambios?',
          status: 'read',
          reactions: {},
          createdAt: new Date(Date.now() - 3000000).toISOString(),
          deletedFor: []
        },
        {
          id: 'msg4',
          from: currentUserId,
          type: 'text',
          text: 'Sí, me parecen excelentes. El diseño está quedando muy bien.',
          status: 'delivered',
          reactions: {},
          createdAt: new Date(Date.now() - 2500000).toISOString(),
          deletedFor: []
        },
        {
          id: 'msg5',
          from: conversation.otherUser.phone,
          type: 'text',
          text: 'Perfecto, mañana podemos hacer una revisión juntos.',
          status: 'read',
          reactions: { [currentUserId]: '👍' },
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          deletedFor: []
        }
      ];
      setMessages(mockMessages);
    }
  }, [conversation, currentUserId]);

  useEffect(() => {
    // TODO: Show typing indicator from real-time data
    // This would come from Socket.IO events
    setIsTypingVisible(false);
  }, []);

  const handleSendMessage = (content: string, attachments?: File[]) => {
    if (!conversation) return;

    const newMessage: Message & { id: string } = {
      id: 'temp_' + Date.now(),
      from: currentUserId,
      to: conversation.otherUser.phone,
      type: 'text',
      text: content,
      status: 'pending',
      reactions: {},
      createdAt: new Date().toISOString(),
      deletedFor: []
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate message delivery states
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'sent' }
            : msg
        )
      );
    }, 500);

    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'delivered' }
            : msg
        )
      );
    }, 1500);

    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'read' }
            : msg
        )
      );
    }, 3000);
  };

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? 'bg-green-500' : 'bg-gray-400';
  };

  const getStatusText = (isOnline: boolean, lastSeen: string) => {
    if (isOnline) {
      return t('chat.online');
    }
    
    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - lastSeenDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      return `${t('chat.lastSeen', { time: 'hace un momento' })}`;
    } else if (diffHours < 24) {
      return `${t('chat.lastSeen', { time: lastSeenDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) })}`;
    } else {
      return `${t('chat.lastSeen', { time: lastSeenDate.toLocaleDateString('es-ES') })}`;
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="mb-2">Bienvenido a tu chat</h2>
          <p className="text-muted-foreground">
            {t('chat.startFirstConversation')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-background p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={conversation.otherUser.photoURL} alt={conversation.otherUser.displayName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {conversation.otherUser.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(conversation.otherUser.presence.online)}`} />
            </div>
            <div>
              <h2 className="font-medium">{conversation.otherUser.displayName}</h2>
              <p className="text-sm text-muted-foreground">
                {isTypingVisible ? t('chat.typing') : 
                 getStatusText(conversation.otherUser.presence.online, conversation.otherUser.presence.lastSeen)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Phone className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 w-9 p-0"
              onClick={() => onVideoCall(conversation.otherUser.phone)}
              aria-label="Iniciar videollamada"
            >
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {messages.map((message, index) => {
            const isOwn = message.from === currentUserId;
            const previousMessage = messages[index - 1];
            const showAvatar = !isOwn && (!previousMessage || previousMessage.from !== message.from);
            
            return (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={isOwn}
                sender={isOwn ? undefined : conversation.otherUser}
                showAvatar={showAvatar}
                onRetry={() => {
                  // TODO: Implement message retry
                  console.log('Retry message:', message.id);
                }}
                onReact={(emoji) => {
                  // TODO: Implement message reactions
                  console.log('React to message:', message.id, emoji);
                }}
              />
            );
          })}

          {/* Typing Indicator */}
          {isTypingVisible && (
            <div className="flex justify-start">
              <div 
                className="max-w-xs rounded-2xl px-4 py-2"
                style={{
                  backgroundColor: 'var(--chat-bubble-received)',
                  color: 'var(--chat-bubble-received-foreground)'
                }}
              >
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                  </div>
                  <span className="text-xs opacity-70 ml-2">{t('chat.typing')}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Invisible div to scroll to */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Composer */}
      <MessageComposer onSendMessage={handleSendMessage} />
    </div>
  );
}