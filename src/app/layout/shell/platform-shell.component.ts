import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../core/services/auth.service';
import { signal } from '@angular/core';

interface NavItem { label: string; route: string; svg: SafeHtml; }

@Component({
  selector: 'app-platform-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './platform-shell.component.html',
  styleUrl:    './platform-shell.component.scss',
})
export class PlatformShellComponent {
  private auth      = inject(AuthService);
  private router    = inject(Router);
  private sanitizer = inject(DomSanitizer);

  currentUser  = this.auth.currentUser;
  menuOpen     = signal(false);

  userInitials = computed(() => {
    const email = this.currentUser()?.email ?? '';
    return email.slice(0, 2).toUpperCase();
  });

  navItems: NavItem[] = [
    {
      label: 'Tenants',
      route: '/tenants',
      svg: this.svg(`<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>`)
    },
    {
      label: 'Planes',
      route: '/plans',
      svg: this.svg(`<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`)
    },
    {
      label: 'Salud',
      route: '/health',
      svg: this.svg(`<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>`)
    },
    {
      label: 'Fintechs',
      route: '/fintechs',
      svg: this.svg(`<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>`)
    },
  ];

  toggleMenu() { this.menuOpen.update(v => !v); }

  logout() {
    this.menuOpen.set(false);
    this.auth.signOut().then(() => this.router.navigate(['/login']));
  }

  private svg(paths: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`
    );
  }
}
