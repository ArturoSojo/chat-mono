"use client";
import { useState } from "react";
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import {app, auth} from '@/lib/firebaseClient'

export default function PhoneAuth() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  //const [confirmationResult, setConfirmationResult] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);


  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "normal", // invisible o 'normal'
        callback: (response: ResponseType) => {
          console.log("reCAPTCHA verificado");
        },
        
      }
      
    );
   
  };

  const sendCode = async () => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    console.log("appVerifier", appVerifier);
    try {
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result );
      alert("Código enviado por SMS!");
    } catch (err) {
      console.error(err);
    }
  };

  const verifyCode = async () => {
    try {
        if (confirmationResult) {
            const result = confirmationResult.confirm(otp);
            console.log("Usuario autenticado:", result);
        }

       // const result = await confirmationResult.confirm(otp);
      //console.log("Usuario autenticado:", result.user);
    } catch (err) {
      console.error("Código incorrecto", err);
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

      <div id="recaptcha-container"></div>

      <input
        type="text"
        placeholder="Ingresa OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={verifyCode}>Verificar</button>
    </div>
  );
}
