import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BbPaginatorComponent, BbPaginatorEvent, BbSort, BbSortDirective, BbTableDataSource } from 'dls-angular';
import * as log from 'loglevel';
import { ABA_TABS } from 'src/app/models/constants/aba-constants';
import { MENSAGENS } from 'src/app/models/constants/mensagens-constants';
import { SituacaoAtivoEnum, listSituacaoAtivoEnum } from 'src/app/models/enums/situacao-ativo';
import { AbaBandeiraEmit } from 'src/app/models/interface/aba.bandeira.interface';

import { UsuarioService } from './../../../service/usuario/usuario.service';
import { ArquivoService } from 'src/app/service/arquivo/arquivo.service';
import { BandeirasService } from 'src/app/service/bandeiras/bandeiras.service';
import { MensagemService } from 'src/app/service/messages/mensagem.service';

import { Usuario } from './../../../models/usuario.model';
import { Bandeira } from 'src/app/models/bandeira.model';
import { FiltrosConsultarBandeiras } from 'src/app/models/filtros-consultar-bandeiras.model';

@Component({
  selector: 'pcb-tabela-bandeiras',
  templateUrl: './tabela-bandeiras.component.html',
  styleUrls: ['./tabela-bandeiras.component.scss'],
})
export class TabelaBandeirasComponent implements OnInit, OnChanges, AfterViewInit {
  @Output() filtrosEmitter = new EventEmitter<FiltrosConsultarBandeiras>();
  @Output() emitAba = new EventEmitter<AbaBandeiraEmit>();
  @Input() filtro = new FiltrosConsultarBandeiras();
  @ViewChild('bbPaginatorTable', {
    static: false,
  })
  paginatorTable!: BbPaginatorComponent;

  @ViewChild(BbSortDirective, { static: false })
  sort!: BbSortDirective;

  public bandeiras: Bandeira[] = [];
  public dataSource = new BbTableDataSource(this.bandeiras);
  public totalRegistros = 0;
  public columns: string[] = ['codigo', 'arquivo', 'nome', 'situacao', 'acao'];
  public usuario?: Usuario;

  constructor(
    private bandeiraService: BandeirasService,
    private arquivoService: ArquivoService,
    private route: ActivatedRoute,
    private router: Router,
    private mensagemService: MensagemService,
    private usuarioService: UsuarioService,
    public cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregaBandeiras();
    this.usuarioService.usuario.subscribe((u) => {
      this.usuario = u;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filtro && !changes.filtro.isFirstChange()) {
      this.mensagemService.limpar();
      this.carregaBandeiras();
    }
  }

  carregaBandeiras(): void {
    this.bandeiraService.consultaBandeiras(this.filtro).subscribe({
      next: (response) => {
        this.totalRegistros = response.quantidadeTotalRegistro;
        this.bandeiras = response.listaRetorno;
        this.dataSource = new BbTableDataSource(this.bandeiras);
        this.initDataSourceEsort();
      },
      error: (err) => {
        this.mensagemService.mensagemErro(MENSAGENS.MENSAGEM_ERROR_AO_CONSULTAR);
        log.error(`Erro ao consultar bandeiras:`, err);
      },
    });
  }

  onPageChange(event: BbPaginatorEvent): void {
    this.mensagemService.limpar();

    this.filtro.pageIndex = event.pageIndex;
    this.filtro.pageSize = event.pageSize;
    this.filtrosEmitter.emit(this.filtro);

    this.bandeiraService.consultaBandeiras(this.filtro).subscribe({
      next: (response) => {
        this.totalRegistros = response.quantidadeTotalRegistro;
        this.bandeiras = response.listaRetorno;
        this.dataSource = new BbTableDataSource(this.bandeiras);
        this.initDataSourceEsort();
      },
    });
  }

  initDataSourceEsort() {
    this.dataSource = new BbTableDataSource(this.bandeiras);
    this.dataSource.sort = this.sort;
    this.cdr.detectChanges();
  }

  onSortChange(event: BbSort) {
    this.filtro.sortField = event.active;
    this.filtro.sortOrder = event.direction;
    this.filtrosEmitter.emit(this.filtro);
  }

  formataSituacao(situacao?: SituacaoAtivoEnum): string {
    const listaSituacao = listSituacaoAtivoEnum.filter((s) => s.value === situacao);
    let retorno = '';
    listaSituacao.forEach((sit) => {
      retorno = sit.label;
    });

    return retorno;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginatorTable;
  }

  obtemUrlImagemBandeira(codigo: number): string {
    return this.arquivoService.obterUrlDownload(codigo);
  }

  abreLog(bandeira: Bandeira): void {
    this.router.navigate(['../log-bandeiras'], {
      state: bandeira,
      relativeTo: this.route,
    });
  }

  abrirAlterar(bandeira: Bandeira): void {
    this.trocaAba({ aba: ABA_TABS.ABA_TAB_ALTERAR, bandeira: bandeira });
  }

  trocaAba(abaEmit: AbaBandeiraEmit) {
    this.emitAba.emit(abaEmit);
  }
}
