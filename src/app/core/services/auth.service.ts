import { Injectable, signal, computed, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _auth = inject(Auth);

  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => this.currentUser() !== null);

  constructor() {
    onAuthStateChanged(this._auth, user => this.currentUser.set(user));
  }

  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this._auth, email, password);
  }

  signOut() {
    return signOut(this._auth);
  }
}
