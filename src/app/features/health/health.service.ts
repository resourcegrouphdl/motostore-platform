import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SystemHealth, TenantUsage } from './health.model';

@Injectable({ providedIn: 'root' })
export class HealthService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/v1/platform`;

  getHealth(): Observable<SystemHealth> {
    return this.http.get<SystemHealth>(`${this.base}/health`);
  }

  getUsage(): Observable<TenantUsage[]> {
    return this.http.get<TenantUsage[]>(`${this.base}/usage`);
  }
}
