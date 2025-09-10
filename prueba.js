import * as admin from 'firebase-admin';

import serviceAccount from './service-account.json' with { type: 'json' };

// Inicializa la aplicación de Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Referencia a la base de datos de Firestore
const db = admin.firestore();

// Función asíncrona para obtener datos
async function obtenerDatos() {
  // Referencia a un documento específico en la colección 'usuarios'
  const docRef = db.collection('phone').doc('phone');

  try {
    // Obtén el documento
    const doc = await docRef.get();

    // Verifica si el documento existe
    if (!doc.exists) {
      console.log('¡No se encontró el documento!');
    } else {
      console.log('Datos del documento:', doc.data());
    }
  } catch (err) {
    console.log('Error al obtener el documento', err);
  }
}

// Llama a la función para ejecutarla
obtenerDatos();