import React, { useState, useEffect } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { useI18n } from '../../hooks/use-i18n';

interface OTPVerificationProps {
  phone: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onBack: () => void;
  loading?: boolean;
  error?: string;
  resendCount: number;
  resendAvailableAt?: number;
}

export function OTPVerification({
  phone,
  onVerify,
  onResend,
  onBack,
  loading,
  error,
  resendCount,
  resendAvailableAt
}: OTPVerificationProps) {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const { t } = useI18n();

  useEffect(() => {
    if (resendAvailableAt) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, resendAvailableAt - Date.now());
        setTimeLeft(Math.ceil(remaining / 1000));
        
        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [resendAvailableAt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      onVerify(otp);
    }
  };

  const handleResend = () => {
    if (timeLeft === 0 && resendCount < 3) {
      onResend();
      setOtp('');
    }
  };

  const canResend = timeLeft === 0 && resendCount < 3;
  const maxAttemptsReached = resendCount >= 3;

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
          
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{t('auth.enterOtp')}</CardTitle>
          <CardDescription>
            {t('auth.otpSent', { phone })}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="sr-only">
                {t('auth.enterOtp')}
              </Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  disabled={loading || maxAttemptsReached}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {maxAttemptsReached && (
              <Alert variant="destructive">
                <AlertDescription>
                  {t('auth.maxAttemptsReached')}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={otp.length !== 6 || loading || maxAttemptsReached}
            >
              {loading ? t('common.loading') : t('auth.verifyOtp')}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={handleResend}
                disabled={!canResend || loading}
                className="text-sm"
              >
                {timeLeft > 0 
                  ? t('auth.resendAvailableIn', { seconds: timeLeft })
                  : t('auth.resendOtp')
                }
              </Button>
              
              {resendCount > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Intentos de reenvío: {resendCount}/3
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}