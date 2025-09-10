// src/app/api/getData/route.ts

import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import serviceAccount from '../../../../service-account.json'
// Revisa si Firebase ya está inicializado
if (!admin.apps.length) {
  //const serviceAccount = require('../../../../service-account.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const db = admin.firestore();

export async function GET() {
  try {
    const docRef = db.collection('phone').doc('u8SPloiZnvMH5m84ydvy');
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