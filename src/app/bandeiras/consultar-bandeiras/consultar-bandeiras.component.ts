import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ABA_TABS } from 'src/app/models/constants/aba-constants';
import { AbaBandeiraEmit } from 'src/app/models/interface/aba.bandeira.interface';

import { TabelaBandeirasComponent } from './tabela-bandeiras/tabela-bandeiras.component';

import { FiltrosConsultarBandeiras } from 'src/app/models/filtros-consultar-bandeiras.model';

@Component({
  selector: 'pcb-consultar-bandeiras',
  templateUrl: './consultar-bandeiras.component.html',
  styleUrls: ['./consultar-bandeiras.component.scss'],
})
export class ConsultarBandeirasComponent implements OnInit {
  @Output() emitAba = new EventEmitter<AbaBandeiraEmit>();
  @Input() abaAtual: number = ABA_TABS.ABA_TAB_CONSULTAR;

  @ViewChild(TabelaBandeirasComponent)
  tabelaComponent!: TabelaBandeirasComponent;

  filtros = new FiltrosConsultarBandeiras();
  public subscriptions: Array<Subscription> = [];

  public ABA_TABS = ABA_TABS;

  constructor() {
    const filtrosSessionStorage = sessionStorage.getItem('filtros');
    if (filtrosSessionStorage) {
      this.filtros = JSON.parse(filtrosSessionStorage) as FiltrosConsultarBandeiras;
    } else {
      this.filtros.pageIndex = 0;
      this.filtros.pageSize = 10;
      this.filtros.sortField = '';
      this.filtros.sortOrder = '';
    }
  }

  ngOnInit(): void {
    this.subscriptions.push();
    delete this.filtros.codigo;
    delete this.filtros.nome;
    delete this.filtros.situacao;
    this.filtros.pageIndex = 0;
    this.filtros.pageSize = 10;
    this.filtros.sortField = '';
    this.filtros.sortOrder = '';
  }

  onFilterEmitter($event: FiltrosConsultarBandeiras) {
    this.filtros = Object.assign({}, $event);
    sessionStorage.setItem('filtros', JSON.stringify(this.filtros));
  }

  onTrocaAba(abaEmit: AbaBandeiraEmit) {
    this.emitAba.emit(abaEmit);
  }
}
