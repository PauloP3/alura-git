import { Component, EventEmitter, Input, Output } from '@angular/core';
import { listSituacaoAtivoEnum } from 'src/app/models/enums/situacao-ativo';

import { MensagemService } from './../../../service/messages/mensagem.service';

import { FiltrosConsultarBandeiras } from 'src/app/models/filtros-consultar-bandeiras.model';

@Component({
  selector: 'pcb-filtro-bandeiras',
  templateUrl: './filtro-bandeiras.component.html',
  styleUrls: ['./filtro-bandeiras.component.scss'],
})
export class FiltroBandeirasComponent {
  @Output() filtrosEmitter = new EventEmitter<FiltrosConsultarBandeiras>();
  @Input() filtros = new FiltrosConsultarBandeiras();

  public situacoes = listSituacaoAtivoEnum;

  constructor(private mensagemService: MensagemService) {}

  validaCodigo() {
    if (Number(this.filtros.codigo) === 0) {
      this.filtros.codigo = undefined;
    }
  }

  consultaBandeiras() {
    this.mensagemService.limpar();
    this.filtros.pageIndex = 0;
    this.filtrosEmitter.emit(this.filtros);
  }

  limpaFiltros() {
    delete this.filtros.codigo;
    delete this.filtros.nome;
    delete this.filtros.situacao;

    this.consultaBandeiras();
  }
}
