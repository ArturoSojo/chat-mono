import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { useI18n } from '../../hooks/use-i18n';

interface PhoneInputProps {
  onSubmit: (phone: string) => void;
  loading?: boolean;
  error?: string;
}

export function PhoneInput({ onSubmit, loading, error }: PhoneInputProps) {
  const [phone, setPhone] = useState('');
  const { t } = useI18n();

  const validatePhone = (phoneNumber: string) => {
    // Basic international phone validation
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePhone(phone)) {
      onSubmit(phone);
    }
  };

  const isValid = validatePhone(phone);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-accent/5">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <Phone className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{t('auth.welcome')}</CardTitle>
          <CardDescription>
            {t('auth.phoneNumber')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{t('auth.phoneNumber')}</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('auth.phoneNumberPlaceholder')}
                className="text-center text-lg"
                disabled={loading}
              />
              {phone && !isValid && (
                <p className="text-sm text-destructive">
                  {t('auth.invalidPhone')}
                </p>
              )}
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
              {loading ? t('common.loading') : t('auth.sendOtp')}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Al continuar, confirmas que has leído y aceptas nuestros{' '}
              <button className="text-primary hover:underline">
                Términos de Servicio
              </button>{' '}
              y{' '}
              <button className="text-primary hover:underline">
                Política de Privacidad
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}