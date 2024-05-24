import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IIBDetalheLogRetorno } from 'src/app/cyborg/service/op7669211v1/IIBDetalheLogRetorno';
import { MENSAGENS } from 'src/app/models/constants/mensagens-constants';
import { SituacaoAtivoEnum } from 'src/app/models/enums/situacao-ativo';
import { ILogBandeira } from 'src/app/models/ILogBandeira';
import { formataAcaoLog, formataSituacao } from 'src/app/utils/helper-functions';

import { ArquivoService } from 'src/app/service/arquivo/arquivo.service';
import { BandeirasService } from 'src/app/service/bandeiras/bandeiras.service';
import { MensagemService } from 'src/app/service/messages/mensagem.service';

import { Arquivo } from 'src/app/models/arquivo.model';
import { Bandeira } from 'src/app/models/bandeira.model';

@Component({
  selector: 'pcb-detalhar-log-bandeiras',
  templateUrl: './detalhar-log-bandeiras.component.html',
  styleUrls: ['./detalhar-log-bandeiras.component.scss'],
})
export class DetalharLogBandeirasComponent implements OnInit {
  public bandeira = new Bandeira();
  public detalhesDoLog: IIBDetalheLogRetorno;
  public arquivo = new Arquivo();
  public logBandeira: ILogBandeira;
  public formataSituacao = formataSituacao;
  public formataAcaoLog = formataAcaoLog;

  public camposAlterados = {
    nome: true,
    arquivo: true,
    situacao: true,
  };

  constructor(
    private route: ActivatedRoute,
    private arquivoService: ArquivoService,
    private router: Router,
    public datePipe: DatePipe,
    private bandeirasService: BandeirasService,
    private mensagemService: MensagemService
  ) {
    if (window.history.state) {
      this.logBandeira = window.history.state as ILogBandeira;
    } else {
      this.logBandeira = {
        codigo: 0,
        usuarioResponsavel: '-',
        dataHora: '2000-01-00T00:00:00.856828',
        tipoRegistro: '-',
      };
    }

    this.detalhesDoLog = {
      codigo: 0,
      nomeBandeira: '-',
      situacao: SituacaoAtivoEnum.INATIVO,
      codigoArquivo: 0,
      nomeAlterado: 0,
      situacaoAlterada: 0,
      arquivoAlterado: 0,
    };
  }

  ngOnInit(): void {
    this.buscaDetalhes();
  }

  buscaDetalhes(): void {
    this.bandeirasService.consultaDetalhesDoLog(this.logBandeira).subscribe({
      next: (response) => {
        this.detalhesDoLog = response;
        this.bandeira.codigo = response.codigo;
        this.formataCamposAlterados();
        if (this.detalhesDoLog.codigoArquivo) this.obtemNomeImagemBandeira(this.detalhesDoLog.codigoArquivo);
      },
    });
  }

  formataCamposAlterados(): void {
    this.camposAlterados = {
      nome: this.detalhesDoLog.nomeAlterado === 0,
      situacao: this.detalhesDoLog.situacaoAlterada === 0,
      arquivo: this.detalhesDoLog.arquivoAlterado === 0,
    };
  }

  obtemNomeImagemBandeira(codigo: number): void {
    this.arquivoService.metadado(codigo).subscribe({
      next: (response) => {
        this.arquivo = response;
      },
      error: () => {
        this.mensagemService.mensagemErro(MENSAGENS.MENSAGEM_ERRO_AO_BUSCAR_IMAGEM);
      },
    });
  }

  obtemUrlImagemBandeira(codigo: number): string {
    return this.arquivoService.obterUrlDownload(codigo);
  }

  fecharDetalhe() {
    this.router.navigate(['../log-bandeiras'], {
      state: this.bandeira,
      relativeTo: this.route,
    });
  }
}
