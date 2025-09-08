import React from 'react';
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Message, MessageStatus, User } from '../../types';
import { useI18n } from '../../hooks/use-i18n';

interface MessageBubbleProps {
  message: Message & { id: string };
  isOwn: boolean;
  sender?: User;
  showAvatar?: boolean;
  onRetry?: () => void;
  onReact?: (emoji: string) => void;
}

export function MessageBubble({ 
  message, 
  isOwn, 
  sender, 
  showAvatar = true,
  onRetry,
  onReact 
}: MessageBubbleProps) {
  const { t } = useI18n();

  const getStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3 text-muted-foreground animate-pulse" />;
      case 'sent':
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-primary" />;
    }
  };

  const getStatusText = (status: MessageStatus) => {
    switch (status) {
      case 'pending':
        return t('chat.messageFailedToSend');
      case 'sent':
        return 'Enviado';
      case 'delivered':
        return t('chat.messageDelivered');
      case 'read':
        return t('chat.messageRead');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <div className="break-words whitespace-pre-wrap">
            {message.text}
          </div>
        );

      case 'image':
        return (
          <div className="space-y-2">
            {message.media && (
              <div className="rounded-lg overflow-hidden max-w-xs">
                <img
                  src={message.media.url}
                  alt="Imagen"
                  className="w-full h-auto object-cover"
                  style={{ 
                    maxHeight: '300px',
                    aspectRatio: message.media.width && message.media.height 
                      ? `${message.media.width}/${message.media.height}` 
                      : 'auto'
                  }}
                />
              </div>
            )}
            {message.text && (
              <div className="break-words whitespace-pre-wrap">
                {message.text}
              </div>
            )}
          </div>
        );

      case 'audio':
      case 'voice':
        return (
          <div className="flex items-center gap-3 min-w-48">
            <div className="flex-1">
              <audio 
                controls 
                className="w-full h-8"
                style={{ filter: isOwn ? 'invert(1)' : 'none' }}
              >
                <source src={message.media?.url} type={message.media?.type} />
                Tu navegador no soporta audio.
              </audio>
            </div>
            {message.media?.duration && (
              <span className="text-xs opacity-70">
                {Math.floor(message.media.duration / 60)}:{(message.media.duration % 60).toString().padStart(2, '0')}
              </span>
            )}
          </div>
        );

      case 'document':
        return (
          <div className="flex items-center gap-3 p-2 bg-black/5 rounded-lg min-w-48">
            <div className="w-8 h-8 bg-black/10 rounded flex items-center justify-center">
              📄
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {message.media?.url?.split('/').pop() || 'Documento'}
              </p>
              {message.media?.size && (
                <p className="text-xs opacity-70">
                  {(message.media.size / 1024 / 1024).toFixed(1)} MB
                </p>
              )}
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="text-center text-sm text-muted-foreground italic">
            {message.text}
          </div>
        );

      default:
        return <div>Mensaje no soportado</div>;
    }
  };

  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
          {renderMessageContent()}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 mb-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar (only for received messages and when showAvatar is true) */}
      {!isOwn && showAvatar && sender && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={sender.photoURL} alt={sender.displayName} />
          <AvatarFallback className="text-xs">
            {sender.displayName.charAt(0)}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message content */}
      <div className={`flex flex-col max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Sender name (only for received messages) */}
        {!isOwn && sender && (
          <span className="text-xs text-muted-foreground mb-1 px-1">
            {sender.displayName}
          </span>
        )}

        {/* Reply context */}
        {message.replyTo && (
          <div className="mb-2 p-2 bg-muted/50 rounded-md text-xs border-l-2 border-primary/50">
            <p className="text-muted-foreground">Respuesta a:</p>
            <p className="truncate">Mensaje anterior...</p>
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`
            relative rounded-2xl px-4 py-2 shadow-sm
            ${isOwn 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground'
            }
            ${message.status === 'pending' ? 'opacity-70' : ''}
          `}
          style={{
            backgroundColor: isOwn 
              ? 'var(--chat-bubble-sent)' 
              : 'var(--chat-bubble-received)',
            color: isOwn 
              ? 'var(--chat-bubble-sent-foreground)' 
              : 'var(--chat-bubble-received-foreground)'
          }}
        >
          {renderMessageContent()}

          {/* Message info (time, status, edited) */}
          <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            {message.editedAt && (
              <span className="text-xs opacity-60">
                {t('chat.messageEdited')}
              </span>
            )}
            
            <span className="text-xs opacity-70">
              {formatTime(message.createdAt)}
            </span>
            
            {isOwn && (
              <div className="opacity-70" title={getStatusText(message.status)}>
                {getStatusIcon(message.status)}
              </div>
            )}
            
            {message.status === 'pending' && onRetry && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 opacity-70 hover:opacity-100"
                onClick={onRetry}
                title="Reintentar envío"
              >
                <AlertCircle className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Reactions */}
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {Object.entries(message.reactions).map(([userId, emoji]) => (
              <Badge
                key={userId}
                variant="secondary"
                className="text-xs px-2 py-0 h-5 cursor-pointer hover:bg-secondary/80"
                onClick={() => onReact && onReact(emoji)}
              >
                {emoji}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}