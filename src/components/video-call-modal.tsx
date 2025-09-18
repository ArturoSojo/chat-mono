import React, { useState, useEffect } from 'react';
import { X, Mic, MicOff, Video, VideoOff, PhoneOff, Settings } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactName: string;
  contactAvatar?: string;
}

export function VideoCallModal({ isOpen, onClose, contactName, contactAvatar }: VideoCallModalProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [callStatus, setCallStatus] = useState<'calling' | 'connected' | 'ended'>('calling');
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus]);

  useEffect(() => {
    if (isOpen) {
      // Simulate call connection after 3 seconds
      const timer = setTimeout(() => {
        setCallStatus('connected');
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      // Reset state when modal closes
      setCallStatus('calling');
      setCallDuration(0);
      setIsVideoEnabled(true);
      setIsAudioEnabled(true);
    }
  }, [isOpen]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[600px] p-0 bg-black border-0">
        <div className="relative w-full h-full flex flex-col">
          {/* Header */}
          <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
            <div className="flex items-center gap-3 text-white">
              <Avatar className="h-10 w-10">
                <AvatarImage src={contactAvatar} alt={contactName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {contactName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{contactName}</h3>
                <p className="text-sm text-gray-300">
                  {callStatus === 'calling' && 'Llamando...'}
                  {callStatus === 'connected' && formatDuration(callDuration)}
                  {callStatus === 'ended' && 'Llamada finalizada'}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Video Area */}
          <div className="flex-1 relative">
            {/* Remote Video (placeholder) */}
            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-purple-600 flex items-center justify-center">
              {callStatus === 'calling' ? (
                <div className="text-center text-white">
                  <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center mb-4 mx-auto">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={contactAvatar} alt={contactName} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                        {contactName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="text-xl font-medium mb-2">{contactName}</div>
                  <div className="text-gray-300">Conectando...</div>
                  <div className="flex justify-center mt-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              ) : callStatus === 'connected' ? (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  {/* Placeholder for remote video */}
                  <div className="text-white text-center">
                    <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-400">Video del contacto</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-white">
                  <PhoneOff className="h-16 w-16 mx-auto mb-4 text-red-400" />
                  <div className="text-xl font-medium">Llamada finalizada</div>
                </div>
              )}
            </div>

            {/* Local Video (Picture-in-Picture) */}
            {callStatus === 'connected' && (
              <div className="absolute bottom-20 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20">
                {isVideoEnabled ? (
                  <div className="w-full h-full bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Video className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs text-gray-300">Tu video</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <VideoOff className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex items-center gap-4 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3">
              {/* Mute/Unmute */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                className={`h-12 w-12 rounded-full ${
                  isAudioEnabled 
                    ? 'bg-white/20 text-white hover:bg-white/30' 
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
                disabled={callStatus !== 'connected'}
                aria-label={isAudioEnabled ? 'Silenciar micrófono' : 'Activar micrófono'}
              >
                {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>

              {/* Video On/Off */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                className={`h-12 w-12 rounded-full ${
                  isVideoEnabled 
                    ? 'bg-white/20 text-white hover:bg-white/30' 
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
                disabled={callStatus !== 'connected'}
                aria-label={isVideoEnabled ? 'Desactivar video' : 'Activar video'}
              >
                {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>

              {/* Settings */}
              <Button
                variant="ghost"
                size="sm"
                className="h-12 w-12 rounded-full bg-white/20 text-white hover:bg-white/30"
                disabled={callStatus !== 'connected'}
                aria-label="Configuración"
              >
                <Settings className="h-5 w-5" />
              </Button>

              {/* End Call */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEndCall}
                className="h-12 w-12 rounded-full bg-red-500 text-white hover:bg-red-600"
                disabled={callStatus === 'ended'}
                aria-label="Finalizar llamada"
              >
                <PhoneOff className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}