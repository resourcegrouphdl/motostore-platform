import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HealthService } from './health.service';
import {
  ServiceCheck, TenantUsage, RecentError,
  MOCK_SERVICES, MOCK_ERRORS, SortField, SortDir, SystemHealth
} from './health.model';

type Tab = 'status' | 'usage' | 'errors';

@Component({
  selector: 'app-system-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './system-status.component.html',
  styleUrl:    './system-status.component.scss',
})
export class SystemStatusComponent implements OnInit {
  private svc = inject(HealthService);

  activeTab = signal<Tab>('status');

  // Status tab
  health    = signal<SystemHealth | null>(null);
  services  = signal<ServiceCheck[]>(MOCK_SERVICES);
  healthErr = signal(false);

  // Usage tab
  usage      = signal<TenantUsage[]>([]);
  usageLoad  = signal(true);
  usageErr   = signal(false);
  sortField  = signal<SortField>('name');
  sortDir    = signal<SortDir>('asc');
  usageQuery = signal('');

  sortedUsage = computed(() => {
    const q = this.usageQuery().toLowerCase();
    let list = this.usage().filter(t =>
      !q || t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q));
    const f = this.sortField();
    const d = this.sortDir() === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      const av = (a as any)[f]; const bv = (b as any)[f];
      return typeof av === 'string' ? av.localeCompare(bv) * d : (av - bv) * d;
    });
  });

  // Errors tab
  errors    = signal<RecentError[]>(MOCK_ERRORS);
  errorsLoad = signal(false);

  overallStatus = computed(() => {
    const svc = this.services();
    if (svc.some(s => s.status === 'DOWN'))      return 'DOWN';
    if (svc.some(s => s.status === 'DEGRADED'))  return 'DEGRADED';
    return 'UP';
  });

  ngOnInit() {
    this.svc.getHealth().subscribe({
      next:  h  => this.health.set(h),
      error: () => this.healthErr.set(true),
    });
    this.loadUsage();
  }

  loadUsage() {
    this.usageLoad.set(true);
    this.usageErr.set(false);
    this.svc.getUsage().subscribe({
      next:  u  => { this.usage.set(u); this.usageLoad.set(false); },
      error: () => { this.usageErr.set(true); this.usageLoad.set(false); },
    });
  }

  setTab(t: Tab) { this.activeTab.set(t); }

  toggleSort(field: SortField) {
    if (this.sortField() === field) {
      this.sortDir.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDir.set('asc');
    }
  }

  skeletonRows = Array(4);
  readonly formatKb = (kb: number) => kb > 1024 ? `${(kb/1024).toFixed(1)} MB` : `${kb} KB`;
}
