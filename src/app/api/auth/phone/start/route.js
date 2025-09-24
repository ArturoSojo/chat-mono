// src/app/api/getData/route.ts

import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
//import { initializeApp } from 'firebase/app';
import serviceAccount from '../../../../../../service-account.json';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
// Revisa si Firebase ya está inicializado
let app = null; 
if (!admin.apps.length) {
  //const serviceAccount = require('../../../../service-account.json');

  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount ),
    //credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const db = admin.firestore();

export async function GET() {
  try {
    const docRef = db.collection('user').doc('v7b93KksWDk7zfTDcfiG');
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Devuelve los datos como JSON
    return NextResponse.json(doc.data(), { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Nueva función POST 
//const auth = getAuth(app);
//const appVerifier = window.recaptchaVerifier;
export async function POST(request) {
  try {
    // 1. Lee los datos del cuerpo de la solicitud
    const body = await request.json();
    console.log("haciendo el log :", request)
    console.log("haciendo el log2*** :", body)

    // 2. Crea un nuevo documento en la colección 'user' con los datos del cuerpo
    const newDocRef = await db.collection('session').add(body);
    //signInWithPhoneNumber(auth, '+584243241710', appVerifier );

    // 3. Responde con un mensaje de éxito y el ID del nuevo documento
    return NextResponse.json({ 
        message: 'Document created successfully',
        id: newDocRef.id
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/*function sendSMS(phone : number ){

}*/

/*window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
  'size': 'invisible',
  'callback': (response) => {
    // reCAPTCHA solved, allow signInWithPhoneNumber.
    onSignInSubmit();
  }
});*/

/*signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
      console.log("Envio mensaje")
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;
      // ...
    }).catch((error) => {
      console.log("NO Envio mensaje")
      // Error; SMS not sent
      // ...
});*/
/*const handleSendOtp = async () => {
    setUpRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      // Send the OTP to the user's phone number
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      alert('OTP sent successfully!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Error sending OTP. Please check the phone number.');
    }
};

  // This function sets up the reCAPTCHA verifier
const setUpRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, you can proceed with phone number verification
      }
    });
};*/