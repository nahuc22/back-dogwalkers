import * as admin from 'firebase-admin';

let firebaseApp: admin.app.App | null = null;

/**
 * Inicializa Firebase Admin SDK
 */
export function initializeFirebase() {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    // Opción 1: Usar service account JSON (más seguro para producción)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } 
    // Opción 2: Usar credenciales individuales (más fácil para desarrollo)
    else if (process.env.FIREBASE_PROJECT_ID) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      console.warn('⚠️  Firebase no configurado. Usando credenciales por defecto.');
      firebaseApp = admin.initializeApp();
    }

    console.log('✅ Firebase Admin inicializado correctamente');
    return firebaseApp;
  } catch (error) {
    console.error('❌ Error al inicializar Firebase:', error);
    throw error;
  }
}

/**
 * Verifica un token de Firebase y retorna los datos del usuario
 */
export async function verifyFirebaseToken(idToken: string) {
  try {
    if (!firebaseApp) {
      initializeFirebase();
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
      emailVerified: decodedToken.email_verified,
    };
  } catch (error) {
    console.error('Error al verificar token de Firebase:', error);
    throw new Error('Token de Firebase inválido');
  }
}

/**
 * Obtiene el usuario de Firebase por UID
 */
export async function getFirebaseUser(uid: string) {
  try {
    if (!firebaseApp) {
      initializeFirebase();
    }

    const userRecord = await admin.auth().getUser(uid);
    return userRecord;
  } catch (error) {
    console.error('Error al obtener usuario de Firebase:', error);
    throw error;
  }
}
