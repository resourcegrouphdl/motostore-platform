// Ambiente: PRODUCCIÓN
// API apunta al backend en Cloud Run (actualizar URL cuando esté desplegado)
// Firebase usa los servicios reales del proyecto hdlizana (platform-prod)

export const environment = {
  production: true,
  apiUrl: 'https://motostore-api-749765863620.southamerica-east1.run.app',
  useEmulators: false,
  firebase: {
    apiKey: 'AIzaSyBNylqVfSm9_ofvWAlj3DyIgcGncUsR6-k',
    authDomain: 'hdlizana.firebaseapp.com',
    projectId: 'hdlizana',
    storageBucket: 'hdlizana.firebasestorage.app',
    messagingSenderId: '149047439285',
    appId: '1:149047439285:web:abafa15413f3f48be333fc'
  }
};
