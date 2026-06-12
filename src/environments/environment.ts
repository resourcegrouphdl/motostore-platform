// Ambiente: LOCAL / DESARROLLO
// API apunta al Spring Boot local (puerto 8080)
// Firebase usa los emuladores locales del proyecto hdlizana (platform-prod)
// IMPORTANTE: este proyecto Firebase es SEPARADO del de las tiendas (mvmotors-alcontado-front)
// Solo Auth — no usa Firestore ni Storage directamente

export const environment = {
  production: false,
  apiUrl: 'https://motostore-api-749765863620.southamerica-east1.run.app',
  useEmulators: false,
  firebase: {
    apiKey: 'AIzaSyBNylqVfSm9_ofvWAlj3DyIgcGncUsR6-k',
    authDomain: 'hdlizana.firebaseapp.com',
    projectId: 'hdlizana',
    storageBucket: 'hdlizana.firebasestorage.app',
    messagingSenderId: '149047439285',
    appId: '1:149047439285:web:abafa15413f3f48be333fc'
  },
  emulators: {
    authPort: 9099,
    firestorePort: 8082,
    storagePort: 9199
  }
};
