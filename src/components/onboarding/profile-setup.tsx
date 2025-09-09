import React, { useState, useRef, useCallback } from 'react';
import { User, Camera, Check, X, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { useI18n } from '../../hooks/use-i18n';

interface ProfileSetupProps {
  onComplete: (profile: {
    displayName: string;
    username: string;
    photoFile?: File;
    about?: string;
  }) => void;
  onBack: () => void;
  loading?: boolean;
  error?: string;
}

type UsernameStatus = 'idle' | 'checking' | 'available' | 'unavailable';

export function ProfileSetup({ onComplete, onBack, loading, error }: ProfileSetupProps) {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [about, setAbout] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();

  // Debounced username check
  const checkUsernameAvailability = useCallback(
    debounce(async (usernameToCheck: string) => {
      if (usernameToCheck.length < 3) {
        setUsernameStatus('idle');
        return;
      }

      setUsernameStatus('checking');
      
      try {
        // Mock API call - replace with actual Firebase query
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simulate some usernames being taken
        const takenUsernames = ['admin', 'user', 'test', 'chat'];
        const isAvailable = !takenUsernames.includes(usernameToCheck.toLowerCase());
        
        setUsernameStatus(isAvailable ? 'available' : 'unavailable');
      } catch (error) {
        setUsernameStatus('idle');
      }
    }, 500),
    []
  );

  const handleUsernameChange = (value: string) => {
    // Clean username (only alphanumeric and underscore)
    const cleanValue = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(cleanValue);
    
    if (cleanValue.length >= 3) {
      checkUsernameAvailability(cleanValue);
    } else {
      setUsernameStatus('idle');
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        return;
      }

      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (displayName.trim() && username.trim() && usernameStatus === 'available') {
      onComplete({
        displayName: displayName.trim(),
        username: username.trim(),
        photoFile: photoFile || undefined,
        about: about.trim() || undefined,
      });
    }
  };

  const isValid = displayName.trim().length >= 2 && 
                  username.trim().length >= 3 && 
                  usernameStatus === 'available';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-accent/5">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="absolute left-4 top-4 h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <CardTitle className="text-2xl">{t('profile.setupProfile')}</CardTitle>
          <CardDescription>
            Personaliza tu perfil para comenzar a chatear
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={photoPreview || undefined} />
                  <AvatarFallback className="text-2xl">
                    <User className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {t('profile.uploadPhoto')}
                </Button>
                
                {photoPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemovePhoto}
                  >
                    {t('profile.removePhoto')}
                  </Button>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName">{t('profile.displayName')}</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t('profile.displayNamePlaceholder')}
                disabled={loading}
                maxLength={50}
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">{t('profile.username')}</Label>
              <div className="relative">
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  placeholder={t('profile.usernamePlaceholder')}
                  disabled={loading}
                  maxLength={20}
                  className="pr-12"
                />
                
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {usernameStatus === 'checking' && (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  )}
                  {usernameStatus === 'available' && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                  {usernameStatus === 'unavailable' && (
                    <X className="w-4 h-4 text-destructive" />
                  )}
                </div>
              </div>
              
              {usernameStatus === 'available' && (
                <Badge variant="secondary" className="text-green-600">
                  {t('profile.usernameAvailable')}
                </Badge>
              )}
              {usernameStatus === 'unavailable' && (
                <Badge variant="destructive">
                  {t('profile.usernameUnavailable')}
                </Badge>
              )}
              {usernameStatus === 'checking' && (
                <Badge variant="outline">
                  {t('profile.usernameChecking')}
                </Badge>
              )}
            </div>

            {/* About */}
            <div className="space-y-2">
              <Label htmlFor="about">{t('profile.aboutMe')} ({t('common.optional')})</Label>
              <Textarea
                id="about"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder={t('profile.aboutMePlaceholder')}
                disabled={loading}
                maxLength={139}
                rows={3}
              />
              <p className="text-xs text-muted-foreground text-right">
                {about.length}/139
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || loading}
            >
              {loading ? t('common.loading') : t('profile.completeSetup')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Debounce utility function
/* eslint-disable @typescript-eslint/no-explicit-any */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => { void func(...args); }, wait);
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */