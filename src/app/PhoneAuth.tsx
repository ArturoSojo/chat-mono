"use client";
import { useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

export default function PhoneAuth() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible", // cambia a "normal" para debug
        callback: (response: ResponseType) => {
          console.log("✅ reCAPTCHA verificado", response);
        },
      });
    }
    return window.recaptchaVerifier;
  };

  const sendCode = async () => {
    try {
      const appVerifier = setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result); // ✅ ahora lo guardamos
      alert("Código enviado por SMS!");
    } catch (err) {
      console.error("❌ Error enviando SMS:", err);
    }
  };

  const verifyCode = async () => {
    try {
      if (!confirmationResult) {
        throw new Error("No hay código pendiente de verificar");
      }
      const result = await confirmationResult.confirm(otp);
      console.log("🎉 Usuario autenticado:", result.user);
    } catch (err) {
      console.error("❌ Código incorrecto:", err);
    }
  };

  return (
    <div>
      <input
        type="tel"
        placeholder="+1234567890"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={sendCode}>Enviar código</button>

      {/* Aquí se monta el reCAPTCHA */}
      <div id="recaptcha-container"></div>

      <input
        type="text"
        placeholder="Ingresa OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={verifyCode}>Verifica2r</button>
    </div>
  );
}
