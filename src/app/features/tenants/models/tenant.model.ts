export type TenantPlan   = 'STARTER' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';
export type TenantStatus = 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';

export interface Tenant {
  id:          string;
  slug:        string;
  name:        string;
  plan:        TenantPlan;
  status:      TenantStatus;
  countryCode: string;
  schemaName:  string;
  trialEndsAt: string | null;
  activatedAt: string | null;
  createdAt:   string;
  updatedAt:   string;
}

export interface CreateTenantRequest {
  slug:        string;
  name:        string;
  plan:        TenantPlan;
  countryCode: string;
}

export const PLAN_LABELS: Record<TenantPlan, string> = {
  STARTER:    'Starter',
  PRO:        'Pro',
  BUSINESS:   'Business',
  ENTERPRISE: 'Enterprise',
};

export const PLAN_ORDER: TenantPlan[] = ['STARTER', 'PRO', 'BUSINESS', 'ENTERPRISE'];

export const STATUS_LABELS: Record<TenantStatus, string> = {
  TRIAL:     'Trial',
  ACTIVE:    'Activo',
  SUSPENDED: 'Suspendido',
  CANCELLED: 'Cancelado',
};

export const COUNTRY_LABELS: Record<string, string> = {
  PE: 'Perú',
  CO: 'Colombia',
  MX: 'México',
};

export function trialDaysLeft(tenant: Tenant): number | null {
  if (tenant.status !== 'TRIAL' || !tenant.trialEndsAt) return null;
  const ms = new Date(tenant.trialEndsAt).getTime() - Date.now();
  return Math.ceil(ms / 86_400_000);
}
