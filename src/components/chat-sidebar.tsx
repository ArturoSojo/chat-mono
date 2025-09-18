import React, { useState, useMemo } from 'react';
import { Search, Plus, Phone, Video, Users } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { useI18n } from '../hooks/use-i18n';
import { User, Conversation } from '../types';

interface ChatSidebarProps {
  currentUserId: string;
  selectedConversationId?: string;
  conversations: Array<Conversation & { id: string; otherUser: User }>;
  onConversationSelect: (conversationId: string) => void;
  onVideoCall: (userId: string) => void;
  onNewChat: () => void;
}

export function ChatSidebar({ 
  currentUserId, 
  selectedConversationId, 
  conversations, 
  onConversationSelect, 
  onVideoCall,
  onNewChat 
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useI18n();

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    
    return conversations.filter(conv =>
      conv.otherUser.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.otherUser.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage?.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? 'bg-green-500' : 'bg-gray-400';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 1) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return date.toLocaleDateString('es-ES', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="w-80 border-r bg-sidebar flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-medium">{t('chat.chats')}</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={onNewChat}
            aria-label={t('chat.newMessage')}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('chat.searchConversations')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Contacts List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery.trim() ? (
                <>
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No se encontraron conversaciones</p>
                  <p className="text-sm">Intenta con otros términos de búsqueda</p>
                </>
              ) : (
                <>
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t('chat.noConversations')}</p>
                  <p className="text-sm">{t('chat.startFirstConversation')}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onNewChat}
                    className="mt-4"
                  >
                    {t('chat.newMessage')}
                  </Button>
                </>
              )}
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const unreadCount = conversation.unreadCount[currentUserId] || 0;
              const isSelected = selectedConversationId === conversation.id;
              
              return (
                <div
                  key={conversation.id}
                  onClick={() => onConversationSelect(conversation.id)}
                  className={`
                    flex items-center p-3 rounded-lg cursor-pointer transition-colors
                    ${isSelected 
                      ? 'bg-sidebar-accent' 
                      : 'hover:bg-sidebar-accent/50'
                    }
                  `}
                >
                  <div className="relative mr-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.otherUser.photoURL} alt={conversation.otherUser.displayName} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {conversation.otherUser.displayName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-sidebar ${getStatusColor(conversation.otherUser.presence.online)}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium truncate">{conversation.otherUser.displayName}</h3>
                      <div className="flex items-center gap-1">
                        {conversation.lastMessageAt && (
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conversation.lastMessageAt)}
                          </span>
                        )}
                        {isSelected && (
                          <div className="flex gap-1 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle voice call
                              }}
                              aria-label="Llamada de voz"
                            >
                              <Phone className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                onVideoCall(conversation.otherUser.phone);
                              }}
                              aria-label="Videollamada"
                            >
                              <Video className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate flex-1">
                        {/* TODO: Add typing indicator from real-time data */}
                        {conversation.lastMessage?.preview || t('chat.newMessage')}
                      </p>
                      {unreadCount > 0 && (
                        <Badge variant="default" className="bg-primary text-primary-foreground ml-2 h-5 text-xs px-2">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}