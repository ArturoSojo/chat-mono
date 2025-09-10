// pages/api/getData.js

import * as admin from 'firebase-admin';

import serviceAccount from './service-account.json';
// Revisa si Firebase ya está inicializado para evitar errores
if (!admin.apps.length) {
  //const serviceAccount = require('../../../service-account.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  // Solo permite solicitudes GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const docRef = db.collection('usuarios').doc('idDelUsuario');
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Devuelve los datos como JSON
    res.status(200).json(doc.data());
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}