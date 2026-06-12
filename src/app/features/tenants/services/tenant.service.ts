import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CreateTenantRequest, Tenant } from '../models/tenant.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/v1/platform`;

  listTenants(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(`${this.base}/tenants`);
  }

  getTenant(id: string): Observable<Tenant> {
    return this.http.get<Tenant>(`${this.base}/tenants/${id}`);
  }

  createTenant(req: CreateTenantRequest): Observable<Tenant> {
    return this.http.post<Tenant>(`${this.base}/tenants`, req);
  }

  changePlan(id: string, plan: string): Observable<Tenant> {
    return this.http.patch<Tenant>(`${this.base}/tenants/${id}/plan`, { plan });
  }

  suspendTenant(id: string, reason: string): Observable<Tenant> {
    return this.http.patch<Tenant>(`${this.base}/tenants/${id}/suspend`, { reason });
  }

  activateTenant(id: string): Observable<Tenant> {
    return this.http.patch<Tenant>(`${this.base}/tenants/${id}/activate`, {});
  }

  provisionTenant(id: string, adminEmail: string, adminFullName: string): Observable<ProvisionResult> {
    return this.http.post<ProvisionResult>(`${this.base}/tenants/${id}/provision`, { adminEmail, adminFullName });
  }
}

export interface ProvisionResult {
  success:    boolean;
  slug:       string;
  schema:     string;
  adminEmail: string;
  adminUrl:   string;
}
