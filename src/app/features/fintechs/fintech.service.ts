import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Fintech, MOCK_FINTECHS } from './fintech.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FintechService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/v1/platform/fintechs`;

  listFintechs(): Observable<Fintech[]> {
    // Mock en local dev; reemplazar por this.http.get<Fintech[]>(this.base) en prod
    return of(MOCK_FINTECHS);
  }

  getFintech(id: string): Observable<Fintech> {
    return of(MOCK_FINTECHS.find(f => f.id === id)!);
  }
}
