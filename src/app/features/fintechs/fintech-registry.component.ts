import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FintechService } from './fintech.service';
import { Fintech, FintechStatus, STATUS_LABELS } from './fintech.model';

@Component({
  selector: 'app-fintech-registry',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fintech-registry.component.html',
  styleUrl:    './fintech-registry.component.scss',
})
export class FintechRegistryComponent implements OnInit {
  private svc = inject(FintechService);

  fintechs     = signal<Fintech[]>([]);
  loading      = signal(true);
  selectedId   = signal<string | null>(null);
  panelOpen    = signal(false);

  selected = computed(() => this.fintechs().find(f => f.id === this.selectedId()) ?? null);

  totalCredits = computed(() => this.fintechs().reduce((s, f) => s + f.creditsCount, 0));
  avgApproval  = computed(() => {
    const active = this.fintechs().filter(f => f.creditsCount > 0);
    if (!active.length) return 0;
    return active.reduce((s, f) => s + f.approvalPct, 0) / active.length;
  });
  activeCount  = computed(() => this.fintechs().filter(f => f.status === 'ACTIVO').length);

  readonly STATUS_LABELS = STATUS_LABELS;

  ngOnInit() {
    this.svc.listFintechs().subscribe(list => {
      this.fintechs.set(list);
      this.loading.set(false);
    });
  }

  openDetail(id: string) {
    this.selectedId.set(id);
    this.panelOpen.set(true);
  }

  closePanel() {
    this.panelOpen.set(false);
    setTimeout(() => this.selectedId.set(null), 300);
  }

  statusClass(s: FintechStatus) {
    return {
      ACTIVO:     'badge--green',
      EN_PRUEBAS: 'badge--blue',
      PENDIENTE:  'badge--yellow',
      SUSPENDIDO: 'badge--red',
    }[s] ?? '';
  }

  pingClass(p: 'OK' | 'FAIL' | 'PENDING') {
    return { OK: 'ping--ok', FAIL: 'ping--fail', PENDING: 'ping--pending' }[p];
  }

  readonly skeletonRows = Array(3);
}
