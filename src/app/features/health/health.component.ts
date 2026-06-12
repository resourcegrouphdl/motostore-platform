import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="health-wrap">
      <h1 class="health-title">Salud del sistema</h1>
      <div class="health-card" *ngIf="data() as d">
        <div class="hc-row"><span class="hc-key">Estado</span><span class="hc-val hc-ok">{{ d.status }}</span></div>
        <div class="hc-row"><span class="hc-key">Tenants totales</span><span class="hc-val">{{ d.tenantCount }}</span></div>
        <div class="hc-row"><span class="hc-key">Timestamp</span><span class="hc-val hc-mono">{{ d.timestamp }}</span></div>
      </div>
      <div class="health-loading" *ngIf="loading()">Cargando…</div>
      <div class="health-error" *ngIf="error()">{{ error() }}</div>
    </div>
  `,
  styles: [`
    .health-wrap { max-width: 480px; }
    .health-title { font-size: 20px; font-weight: 700; color: var(--ink); margin: 0 0 20px; }
    .health-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-md); overflow: hidden; }
    .hc-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--hairline); &:last-child { border-bottom: none; } }
    .hc-key { font-size: 13px; color: var(--ink-3); }
    .hc-val { font-size: 13px; font-weight: 600; color: var(--ink); }
    .hc-ok  { color: var(--success); }
    .hc-mono { font-family: var(--font-mono); font-size: 11.5px; }
    .health-loading, .health-error { font-size: 13px; color: var(--ink-3); margin-top: 12px; }
    .health-error { color: var(--danger); }
  `]
})
export class HealthComponent implements OnInit {
  private http = inject(HttpClient);

  data    = signal<any>(null);
  loading = signal(true);
  error   = signal<string | null>(null);

  ngOnInit() {
    this.http.get(`${environment.apiUrl}/api/v1/platform/health`).subscribe({
      next:  d  => { this.data.set(d); this.loading.set(false); },
      error: _e => { this.error.set('No se pudo conectar al backend.'); this.loading.set(false); },
    });
  }
}
