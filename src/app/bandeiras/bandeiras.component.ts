import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BbTabComponent, BbTabGroupComponent } from 'dls-angular';

import { UsuarioService } from '../service/usuario/usuario.service';

import { ConsultarBandeirasComponent } from './consultar-bandeiras/consultar-bandeiras.component';

import { FiltrosConsultarBandeiras } from '../models/filtros-consultar-bandeiras.model';
import { Usuario } from '../models/usuario.model';
import { Bandeira } from './../models/bandeira.model';

import { ABA_TABS } from '../models/constants/aba-constants';
import { AbaBandeiraEmit } from '../models/interface/aba.bandeira.interface';

@Component({
  selector: 'pcb-bandeiras',
  templateUrl: './bandeiras.component.html',
  styleUrls: ['./bandeiras.component.scss'],
})
export class BandeirasComponent implements OnInit, AfterViewInit {
  public usuario?: Usuario;
  public abaAtual: BbTabComponent;
  public filtro: FiltrosConsultarBandeiras = new FiltrosConsultarBandeiras();
  public abaConsultar: BbTabComponent;
  public abaInserir: BbTabComponent;
  public abaAlterar: BbTabComponent;
  public bandeira: Bandeira;
  public ABA_TAB_ALTERAR = ABA_TABS.ABA_TAB_ALTERAR;
  public ABA_TAB_INSERIR = ABA_TABS.ABA_TAB_INSERIR;

  @ViewChild(BbTabGroupComponent)
  tabGroup!: BbTabGroupComponent;

  @ViewChild(ConsultarBandeirasComponent)
  consultaComponent!: ConsultarBandeirasComponent;

  @ViewChildren(BbTabComponent)
  tabs: QueryList<BbTabComponent> = new QueryList();

  constructor(private readonly usuarioService: UsuarioService) {
    this.filtro.pageIndex = 0;
    this.filtro.pageSize = 10;
    this.filtro.sortField = '';
    this.filtro.sortOrder = '';
    this.abaConsultar = new BbTabComponent();
    this.abaInserir = new BbTabComponent();
    this.abaAlterar = new BbTabComponent();
    this.abaAtual = new BbTabComponent();
    this.bandeira = new Bandeira();
  }

  ngOnInit(): void {
    this.usuarioService.usuario.subscribe((u) => {
      this.usuario = u;
    });
    this.selecionaAba(ABA_TABS.ABA_TAB_CONSULTAR);
  }

  ngAfterViewInit(): void {
    this.abaConsultar = this.tabs.get(ABA_TABS.ABA_TAB_CONSULTAR) as BbTabComponent;
    this.abaInserir = this.tabs.get(ABA_TABS.ABA_TAB_INSERIR) as BbTabComponent;
    this.abaAlterar = this.tabs.get(ABA_TABS.ABA_TAB_ALTERAR) as BbTabComponent;
  }

  onChange(aba: number): void {
    if (aba === ABA_TABS.ABA_TAB_CONSULTAR) {
      this.abaAtual = this.abaConsultar;
      this.abaInserir.active = false;
      this.abaConsultar.active = true;
      this.abaAlterar.active = false;
      this.consultaComponent.tabelaComponent.carregaBandeiras();
    } else if (aba === ABA_TABS.ABA_TAB_INSERIR) {
      this.abaAtual = this.abaInserir;
      this.abaInserir.active = true;
      this.abaConsultar.active = false;
      this.abaAlterar.active = false;
    } else if (aba === ABA_TABS.ABA_TAB_ALTERAR) {
      this.abaAtual = this.abaAlterar;
      this.abaInserir.active = false;
      this.abaConsultar.active = false;
      this.abaAlterar.active = true;
    }
  }

  desabilitaInserir(): boolean {
    return !this.usuario?.podeAdministrar() || this.abaAtual.tabIndex === ABA_TABS.ABA_TAB_ALTERAR;
  }

  desabilitaConsultar(): boolean {
    return !this.usuario?.podeConsultar() || this.abaAtual.tabIndex === ABA_TABS.ABA_TAB_ALTERAR;
  }

  selecionaAba(aba: number) {
    this.onChange(aba);
    this.tabGroup.select(this.abaAtual);
  }

  onTrocaAba($event: AbaBandeiraEmit) {
    this.selecionaAba($event.aba as number);
    this.bandeira = $event.bandeira ?? new Bandeira();
  }
}
