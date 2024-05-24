import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BbPaginatorComponent, BbPaginatorEvent, BbSort, BbSortDirective, BbTableDataSource } from 'dls-angular';
import { SituacaoAtivoEnum } from 'src/app/models/enums/situacao-ativo';
import { ILogBandeira } from 'src/app/models/ILogBandeira';
import { IPaginacaoLog } from 'src/app/models/IPaginacaoLog';
import { IUsuarioResponsavel } from 'src/app/models/IUsuarioResponsavel';
import { formataAcaoLog } from 'src/app/utils/helper-functions';

import { BandeirasService } from 'src/app/service/bandeiras/bandeiras.service';
import { MensagemService } from 'src/app/service/messages/mensagem.service';

import { Bandeira } from 'src/app/models/bandeira.model';

@Component({
  selector: 'pcb-log-bandeiras',
  templateUrl: './log-bandeiras.component.html',
  styleUrls: ['./log-bandeiras.component.scss'],
})
export class LogBandeirasComponent implements OnInit, AfterViewInit {
  @ViewChild('bbPaginatorTable', {
    static: false,
  })
  paginatorTable!: BbPaginatorComponent;

  @ViewChild(BbSortDirective, { static: false })
  sort!: BbSortDirective;

  paginacao: IPaginacaoLog = {
    codigo: 0,
    pageIndex: 0,
    pageSize: 10,
    totalRegistros: 0,
    sortField: 'dataCadastro',
    sortOrder: 'desc',
  };

  public formataAcaoLog = formataAcaoLog;
  public bandeira: Bandeira;
  public logBandeira: ILogBandeira[] = [];
  public chavesENomesDeUsuarios: IUsuarioResponsavel[] = [];
  dataSource = new BbTableDataSource(this.logBandeira);

  colunas: string[] = ['dataCadastro', 'codigoUsuario', 'acao', '-'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private mensagemService: MensagemService,
    private bandeirasService: BandeirasService
  ) {
    if (window.history.state) {
      this.bandeira = window.history.state as Bandeira;
    } else {
      this.bandeira = {
        codigo: 0,
        nome: '-',
        situacao: SituacaoAtivoEnum.INATIVO,
        codigoArquivo: 0,
      };
    }

    this.paginacao.codigo = this.bandeira.codigo ? this.bandeira.codigo : 0;
  }

  ngOnInit(): void {
    this.listaLog();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginatorTable;
  }

  listaLog(): void {
    this.bandeirasService.consultaLogBandeiras(this.paginacao).subscribe({
      next: (response) => {
        this.paginacao.totalRegistros = response.quantidadeTotalRegistro;
        this.logBandeira = response.listaRetorno;
        this.dataSource = new BbTableDataSource(this.logBandeira);
        this.filtrarChavesDosResponsaveis(this.logBandeira);
        this.initDataSourceEsort();
      },
    });
  }

  filtrarChavesDosResponsaveis(logBandeira: ILogBandeira[]): void {
    let chaves: string[] = [];
    logBandeira.forEach((logs) => {
      chaves.push(logs.usuarioResponsavel);
    });
    chaves = this.removerChavesRepetidas(chaves);

    this.buscaNomesDosUsuarios(chaves);
  }

  removerChavesRepetidas(array: string[]): string[] {
    const novoArray: string[] = [];
    for (const elemento of array) {
      if (!novoArray.includes(elemento)) {
        novoArray.push(elemento);
      }
    }
    return novoArray;
  }

  buscaNomesDosUsuarios(chaves: string[]): void {
    this.bandeirasService.consultaNomeDoUsuario(chaves).subscribe({
      next: (response) => {
        this.chavesENomesDeUsuarios = response;
        this.juntaNomeEChaveNoUsuario(this.chavesENomesDeUsuarios);
      },
    });
  }

  juntaNomeEChaveNoUsuario(chavesENomesDeUsuarios: IUsuarioResponsavel[]): void {
    for (const chaveENome of chavesENomesDeUsuarios) {
      this.logBandeira.forEach((logs) => {
        if (logs.usuarioResponsavel === chaveENome.codigoFuncional)
          logs.usuarioResponsavel = `${chaveENome.codigoFuncional} - ${this.obtemNomeFormatado(chaveENome.nomeCompleto)}`;
      });
    }
  }

  obtemNomeFormatado(nome?: string): string {
    let textoFormatado;
    if (nome)
      textoFormatado = nome.toLowerCase().replace(/(^|\s)\S/g, (letra) => {
        return letra.toUpperCase();
      });
    else textoFormatado = 'Nome não cadastrado';
    return textoFormatado;
  }

  abreDetalhe(logBandeira: ILogBandeira): void {
    this.router.navigate(['../detalhar-log-bandeiras'], {
      state: logBandeira,
      relativeTo: this.route,
    });
  }

  onPageChange($event: BbPaginatorEvent) {
    this.mensagemService.limpar();

    this.paginacao.pageSize = $event.pageSize;
    this.paginacao.pageIndex = $event.pageIndex;

    this.listaLog();
  }

  onSortChange(event: BbSort) {
    this.paginacao.sortField = event.active;
    this.paginacao.sortOrder = event.direction;

    this.listaLog();
  }

  initDataSourceEsort() {
    this.dataSource = new BbTableDataSource(this.logBandeira);
    this.dataSource.sort = this.sort;
    this.cdr.detectChanges();
  }

  fecharLog() {
    this.router.navigate([''], {
      relativeTo: this.route,
    });
  }
}
