import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth, connectAuthEmulator } from '@angular/fire/auth';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { authInterceptor } from './core/interceptors/auth.interceptor';

// Platform solo usa Auth — no Firestore ni Storage
// Los datos vienen del backend API (Spring Boot)
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),

    // Firebase App (proyecto hdlizana — separado del de las tiendas)
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    // Firebase Auth — solo para PLATFORM_ADMIN, con 2FA obligatorio
    provideAuth(() => {
      const auth = getAuth();
      if (environment.useEmulators) {
        connectAuthEmulator(auth, `http://localhost:${environment.emulators!.authPort}`, { disableWarnings: true });
      }
      return auth;
    }),
  ]
};
