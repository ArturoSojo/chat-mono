import React, { useState, useRef } from 'react';
import { Send, Smile, Paperclip, Mic, MicOff } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface MessageComposerProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  disabled?: boolean;
}

export function MessageComposer({ onSendMessage, disabled }: MessageComposerProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojis = ['😊', '😂', '❤️', '👍', '👏', '🎉', '🔥', '💯', '😍', '🤔', '👌', '✨'];

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message.trim(), attachments);
      setMessage('');
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    textareaRef.current?.focus();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Here you would implement actual voice recording logic
  };

  return (
    <div className="border-t bg-background p-4">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div key={index} className="bg-muted rounded px-3 py-1 text-sm flex items-center gap-2">
              <Paperclip className="h-3 w-3" />
              <span className="truncate max-w-32">{file.name}</span>
              <button
                onClick={() => removeAttachment(index)}
                className="text-muted-foreground hover:text-foreground"
                aria-label={`Eliminar archivo ${file.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-3">
        {/* Emoji Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 shrink-0"
              disabled={disabled}
              aria-label="Agregar emoji"
            >
              <Smile className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2">
            <div className="grid grid-cols-6 gap-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="text-lg hover:bg-muted rounded p-1 transition-colors"
                  aria-label={`Agregar emoji ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* File Attachment */}
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 shrink-0"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
          aria-label="Adjuntar archivo"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        />

        {/* Message Input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            disabled={disabled}
            className="min-h-[40px] max-h-[120px] resize-none pr-12"
            rows={1}
          />
        </div>

        {/* Voice Recording */}
        <Button
          variant={isRecording ? "destructive" : "ghost"}
          size="sm"
          className="h-10 w-10 p-0 shrink-0"
          disabled={disabled}
          onClick={toggleRecording}
          aria-label={isRecording ? "Detener grabación" : "Grabar mensaje de voz"}
        >
          {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={disabled || (!message.trim() && attachments.length === 0)}
          className="h-10 w-10 p-0 shrink-0"
          aria-label="Enviar mensaje"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span>Grabando mensaje de voz...</span>
        </div>
      )}
    </div>
  );
}