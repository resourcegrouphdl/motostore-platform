export type FintechStatus = 'ACTIVO' | 'EN_PRUEBAS' | 'PENDIENTE' | 'SUSPENDIDO';

export interface Webhook {
  url:       string;
  event:     string;
  lastPing:  string | null;
  pingStatus: 'OK' | 'FAIL' | 'PENDING';
}

export interface Fintech {
  id:             string;
  name:           string;
  slug:           string;
  status:         FintechStatus;
  countryCode:    string;
  creditsCount:   number;
  approvalPct:    number;
  avgLatencyMs:   number | null;
  webhooks:       Webhook[];
  contactEmail:   string;
  apiKeyPrefix:   string;
  createdAt:      string;
  lastActivityAt: string | null;
}

export const STATUS_LABELS: Record<FintechStatus, string> = {
  ACTIVO:      'Activo',
  EN_PRUEBAS:  'En pruebas',
  PENDIENTE:   'Pendiente',
  SUSPENDIDO:  'Suspendido',
};

export const MOCK_FINTECHS: Fintech[] = [
  {
    id: 'f1', name: 'FinMoto PE', slug: 'finmoto-pe', status: 'ACTIVO',
    countryCode: 'PE', creditsCount: 142, approvalPct: 68, avgLatencyMs: 340,
    contactEmail: 'api@finmoto.pe', apiKeyPrefix: 'fmpe_live_',
    createdAt: '2025-11-01T00:00:00Z', lastActivityAt: '2026-06-08T14:30:00Z',
    webhooks: [
      { url: 'https://api.finmoto.pe/hooks/moto', event: 'credit.approved', lastPing: '2026-06-08T14:30:00Z', pingStatus: 'OK' },
      { url: 'https://api.finmoto.pe/hooks/reject', event: 'credit.rejected', lastPing: '2026-06-07T09:00:00Z', pingStatus: 'OK' },
    ],
  },
  {
    id: 'f2', name: 'CreditMás', slug: 'creditmas', status: 'EN_PRUEBAS',
    countryCode: 'PE', creditsCount: 8, approvalPct: 75, avgLatencyMs: 890,
    contactEmail: 'tech@creditmas.com', apiKeyPrefix: 'cms_test_',
    createdAt: '2026-04-15T00:00:00Z', lastActivityAt: '2026-06-08T10:00:00Z',
    webhooks: [
      { url: 'https://creditmas.com/webhook', event: 'credit.approved', lastPing: null, pingStatus: 'PENDING' },
    ],
  },
  {
    id: 'f3', name: 'VélocitaFin', slug: 'velocitafin', status: 'PENDIENTE',
    countryCode: 'CO', creditsCount: 0, approvalPct: 0, avgLatencyMs: null,
    contactEmail: 'integraciones@velocitafin.co', apiKeyPrefix: 'vf_live_',
    createdAt: '2026-06-01T00:00:00Z', lastActivityAt: null,
    webhooks: [],
  },
];
