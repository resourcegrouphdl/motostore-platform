export type ServiceStatus = 'UP' | 'DEGRADED' | 'DOWN' | 'UNKNOWN';

export interface ServiceCheck {
  name:        string;
  key:         string;
  status:      ServiceStatus;
  latencyMs:   number | null;
  description: string;
}

export interface SystemHealth {
  status:      string;
  tenantCount: number;
  timestamp:   string;
}

export interface TenantUsage {
  id:         string;
  slug:       string;
  name:       string;
  plan:       string;
  status:     string;
  apiCalls:   number;
  storageKb:  number;
  userCount:  number;
  motoCount:  number;
  saleCount:  number;
}

export type SortField = 'name' | 'plan' | 'apiCalls' | 'storageKb' | 'userCount' | 'motoCount';
export type SortDir   = 'asc' | 'desc';

export interface RecentError {
  id:        string;
  severity:  'CRITICAL' | 'ERROR' | 'WARNING';
  service:   string;
  message:   string;
  count:     number;
  firstSeen: string;
  lastSeen:  string;
}

// Mock services shown in local dev
export const MOCK_SERVICES: ServiceCheck[] = [
  { key: 'cloud-run',  name: 'Cloud Run',    status: 'UP',      latencyMs: 12,   description: 'API backend principal' },
  { key: 'cloud-sql',  name: 'Cloud SQL',    status: 'UP',      latencyMs: 4,    description: 'PostgreSQL multi-tenant' },
  { key: 'firestore',  name: 'Firestore',    status: 'UP',      latencyMs: 8,    description: 'Tiempo real + catálogo' },
  { key: 'pubsub',     name: 'Cloud Pub/Sub', status: 'UP',     latencyMs: 6,    description: 'Event bus de dominio' },
  { key: 'storage',    name: 'Cloud Storage', status: 'UP',     latencyMs: null, description: 'Documentos y medios' },
  { key: 'firebase',   name: 'Firebase Auth', status: 'UP',     latencyMs: null, description: 'Autenticación tenants' },
];

export const MOCK_ERRORS: RecentError[] = [];
