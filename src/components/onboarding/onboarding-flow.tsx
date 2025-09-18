import React, { useState } from 'react';
import { PhoneInput } from './phone-input';
import { OTPVerification } from './otp-verification';
import { ProfileSetup } from './profile-setup';
import { OnboardingState } from '../../types';

interface OnboardingFlowProps {
  onComplete: (userData: {
    phone: string;
    displayName: string;
    username: string;
    photoFile?: File;
    about?: string;
  }) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [state, setState] = useState<OnboardingState>({
    step: 'phone',
    otpResendCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhoneSubmit = async (phone: string) => {
    setLoading(true);
    setError(null);

    try {
      // Mock Firebase Auth phone verification
      // In real implementation: await signInWithPhoneNumber(auth, phone, recaptchaVerifier)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      setState(prev => ({
        ...prev,
        step: 'otp',
        phone,
        otpSent: true,
        otpResendAvailableAt: Date.now() + 30000, // 30 seconds
      }));
    } catch {
      setError('Error al enviar el código. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    setLoading(true);
    setError(null);

    try {
      // Mock OTP verification
      // In real implementation: await confirmationResult.confirm(otp)
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (otp === '123456') {
        setState(prev => ({ ...prev, step: 'profile' }));
      } else {
        throw new Error('Código incorrecto');
      }
    } catch {
      setError('Código incorrecto. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPResend = async () => {
    if (state.otpResendCount >= 3) return;

    setLoading(true);
    setError(null);

    try {
      // Mock resend OTP
      await new Promise(resolve => setTimeout(resolve, 500));

      setState(prev => ({
        ...prev,
        otpResendCount: prev.otpResendCount + 1,
        otpResendAvailableAt: Date.now() + 30000,
      }));
    } catch {
      setError('Error al reenviar el código. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileComplete = async (profile: {
    displayName: string;
    username: string;
    photoFile?: File;
    about?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      // Mock profile creation
      // In real implementation: create user document in Firestore, upload photo to Storage
      await new Promise(resolve => setTimeout(resolve, 1500));

      onComplete({
        phone: state.phone!,
        ...profile,
      });
    } catch {
      setError('Error al crear el perfil. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    switch (state.step) {
      case 'otp':
        setState(prev => ({ ...prev, step: 'phone', error: null }));
        break;
      case 'profile':
        setState(prev => ({ ...prev, step: 'otp', error: null }));
        break;
    }
    setError(null);
  };

  switch (state.step) {
    case 'phone':
      return (
        <PhoneInput
          onSubmit={handlePhoneSubmit}
          loading={loading}
          error={error || undefined}
        />
      );

    case 'otp':
      return (
        <OTPVerification
          phone={state.phone!}
          onVerify={handleOTPVerify}
          onResend={handleOTPResend}
          onBack={handleBack}
          loading={loading}
          error={error || undefined}
          resendCount={state.otpResendCount}
          resendAvailableAt={state.otpResendAvailableAt}
        />
      );

    case 'profile':
      return (
        <ProfileSetup
          onComplete={handleProfileComplete}
          onBack={handleBack}
          loading={loading}
          error={error || undefined}
        />
      );

    default:
      return null;
  }
}
