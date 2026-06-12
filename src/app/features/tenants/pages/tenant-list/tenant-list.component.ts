import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TenantService, ProvisionResult } from '../../services/tenant.service';
import {
  Tenant, TenantPlan, TenantStatus,
  PLAN_LABELS, PLAN_ORDER, STATUS_LABELS, CreateTenantRequest, trialDaysLeft
} from '../../models/tenant.model';

type KpiFilter = 'all' | 'ACTIVE' | 'TRIAL' | 'SUSPENDED';
type PanelTab  = 'info' | 'hostnames' | 'billing';

interface CreationStep {
  key:    string;
  label:  string;
  status: 'pending' | 'loading' | 'done' | 'error';
}

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tenant-list.component.html',
  styleUrl:    './tenant-list.component.scss',
})
export class TenantListComponent implements OnInit {
  private svc = inject(TenantService);

  tenants     = signal<Tenant[]>([]);
  loading     = signal(true);
  error       = signal<string | null>(null);

  searchQuery  = signal('');
  kpiFilter    = signal<KpiFilter>('all');
  expandedId   = signal<string | null>(null);

  panelOpen    = signal(false);
  selectedTenant = signal<Tenant | null>(null);
  activeTab    = signal<PanelTab>('info');

  createOpen   = signal(false);
  createLoading   = signal(false);
  createError     = signal<string | null>(null);
  createSteps     = signal<CreationStep[]>([]);
  provisionResult = signal<ProvisionResult | null>(null);

  createForm = {
    slug: '', name: '', plan: 'STARTER' as TenantPlan, countryCode: 'PE',
    adminEmail: '', adminFullName: ''
  };

  suspendOpen    = signal(false);
  suspendSlugInput = signal('');
  suspendLoading = signal(false);
  suspendShake   = signal(false);

  planChangeOpen = signal(false);
  planChanging   = signal(false);
  selectedPlan   = signal<TenantPlan>('STARTER');

  readonly planLabels   = PLAN_LABELS;
  readonly planOrder    = PLAN_ORDER;
  readonly statusLabels = STATUS_LABELS;
  readonly trialDaysLeft = trialDaysLeft;

  kpiCounts = computed(() => {
    const all = this.tenants();
    return {
      active:    all.filter(t => t.status === 'ACTIVE').length,
      trial:     all.filter(t => t.status === 'TRIAL').length,
      suspended: all.filter(t => t.status === 'SUSPENDED').length,
    };
  });

  filtered = computed(() => {
    let list = this.tenants();
    const kpi = this.kpiFilter();
    const q   = this.searchQuery().toLowerCase().trim();

    if (kpi !== 'all') list = list.filter(t => t.status === kpi);
    if (q) list = list.filter(t =>
      t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q));
    return list;
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.svc.listTenants().subscribe({
      next:  t  => { this.tenants.set(t); this.loading.set(false); },
      error: _e => { this.error.set('Error al cargar tenants.'); this.loading.set(false); },
    });
  }

  setKpiFilter(f: KpiFilter) { this.kpiFilter.set(f); }

  toggleExpand(id: string) {
    this.expandedId.update(cur => cur === id ? null : id);
  }

  openPanel(tenant: Tenant) {
    this.selectedTenant.set(tenant);
    this.activeTab.set('info');
    this.planChangeOpen.set(false);
    this.suspendOpen.set(false);
    this.panelOpen.set(true);
  }

  closePanel() { this.panelOpen.set(false); }

  setTab(tab: PanelTab) { this.activeTab.set(tab); }

  openCreate() {
    this.createForm = { slug: '', name: '', plan: 'STARTER', countryCode: 'PE', adminEmail: '', adminFullName: '' };
    this.createError.set(null);
    this.createSteps.set([]);
    this.createLoading.set(false);
    this.createOpen.set(true);
  }

  closeCreate() {
    if (!this.createLoading()) {
      this.createOpen.set(false);
      this.provisionResult.set(null);
    }
  }

  submitCreate() {
    const { slug, name, adminEmail, adminFullName } = this.createForm;
    if (!slug || !name || !adminEmail || !adminFullName) return;

    const steps: CreationStep[] = [
      { key: 'db',       label: 'Registrando tenant en BD',         status: 'loading' },
      { key: 'schema',   label: 'Creando schema PostgreSQL',         status: 'pending' },
      { key: 'firebase', label: 'Creando usuario administrador',     status: 'pending' },
      { key: 'done',     label: 'Tenant listo',                      status: 'pending' },
    ];
    this.createSteps.set(steps);
    this.createLoading.set(true);
    this.createError.set(null);

    const req: CreateTenantRequest = {
      slug, name, plan: this.createForm.plan, countryCode: this.createForm.countryCode,
    };

    // Paso 1: crear el registro del tenant
    this.svc.createTenant(req).subscribe({
      next: (tenant) => {
        this.advanceStep('db', 'done');
        this.advanceStep('schema', 'loading');

        // Paso 2: provisionar schema + usuario admin
        this.svc.provisionTenant(tenant.id, adminEmail, adminFullName).subscribe({
          next: (result) => {
            this.advanceStep('schema', 'done');
            this.advanceStep('firebase', 'done');
            this.advanceStep('done', 'done');
            // Actualiza el tenant en la lista con status ACTIVE
            const activeTenant = { ...tenant, status: 'ACTIVE' as const };
            this.tenants.update(ts => [activeTenant, ...ts]);
            this.provisionResult.set(result);
            this.createLoading.set(false);
          },
          error: (e) => {
            this.advanceStep('schema', 'error');
            this.createError.set(e?.error?.message ?? 'Error en el provisioning del schema.');
            this.createLoading.set(false);
          },
        });
      },
      error: (e) => {
        this.advanceStep('db', 'error');
        this.createError.set(e?.error?.message ?? 'Error al crear el tenant.');
        this.createLoading.set(false);
      },
    });
  }

  private advanceStep(key: string, status: CreationStep['status']) {
    this.createSteps.update(steps =>
      steps.map(s => {
        if (s.key === key) return { ...s, status };
        if (status === 'loading' && s.status === 'pending') return s;
        return s;
      })
    );
  }

  openSuspend() { this.suspendSlugInput.set(''); this.suspendOpen.set(true); }
  closeSuspend() { this.suspendOpen.set(false); }

  confirmSuspend() {
    const tenant = this.selectedTenant();
    if (!tenant) return;
    if (this.suspendSlugInput() !== tenant.slug) {
      this.suspendShake.set(true);
      setTimeout(() => this.suspendShake.set(false), 350);
      return;
    }
    this.suspendLoading.set(true);
    this.svc.suspendTenant(tenant.id, '').subscribe({
      next: (updated) => {
        this.tenants.update(ts => ts.map(t => t.id === updated.id ? updated : t));
        this.selectedTenant.set(updated);
        this.suspendLoading.set(false);
        this.suspendOpen.set(false);
      },
      error: () => { this.suspendLoading.set(false); },
    });
  }

  activateTenant() {
    const tenant = this.selectedTenant();
    if (!tenant) return;
    this.svc.activateTenant(tenant.id).subscribe({
      next: (updated) => {
        this.tenants.update(ts => ts.map(t => t.id === updated.id ? updated : t));
        this.selectedTenant.set(updated);
      },
    });
  }

  openPlanChange() {
    const t = this.selectedTenant();
    if (t) this.selectedPlan.set(t.plan);
    this.planChangeOpen.set(true);
  }

  confirmPlanChange() {
    const tenant = this.selectedTenant();
    if (!tenant) return;
    this.planChanging.set(true);
    this.svc.changePlan(tenant.id, this.selectedPlan()).subscribe({
      next: (updated) => {
        this.tenants.update(ts => ts.map(t => t.id === updated.id ? updated : t));
        this.selectedTenant.set(updated);
        this.planChanging.set(false);
        this.planChangeOpen.set(false);
      },
      error: () => { this.planChanging.set(false); },
    });
  }

  skeletonRows = Array(5);

  formatDate(iso: string | null) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
