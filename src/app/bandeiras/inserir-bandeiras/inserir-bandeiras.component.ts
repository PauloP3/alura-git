import { Component, EventEmitter, Output, ViewChild, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BbDialogService, BbDialogSizes } from 'dls-angular';
import { Subscription } from 'rxjs';
import { CLASS } from 'src/app/models/constants/class-constants';
import { CONSTANTS } from 'src/app/models/constants/general-constants';
import { SituacaoAtivoEnum } from 'src/app/models/enums/situacao-ativo';
import { AbaBandeiraEmit } from 'src/app/models/interface/aba.bandeira.interface';

import { BandeirasService } from 'src/app/service/bandeiras/bandeiras.service';
import { ErrorMensagem, MensagemService } from 'src/app/service/messages/mensagem.service';

import { InserirArquivosComponent } from './inserir-arquivos/inserir-arquivos.component';

import { Bandeira } from './../../models/bandeira.model';
import { Arquivo } from 'src/app/models/arquivo.model';

import { ABA_TABS } from '../../models/constants/aba-constants';
import { MENSAGENS } from '../../models/constants/mensagens-constants';

@Component({
  selector: 'pcb-inserir-bandeiras',
  templateUrl: './inserir-bandeiras.component.html',
  styleUrls: ['./inserir-bandeiras.component.scss'],
})
export class InserirBandeirasComponent implements OnInit, OnChanges {
  @ViewChild(InserirArquivosComponent)
  inserirArquivo!: InserirArquivosComponent;

  @Output()
  emitAba = new EventEmitter<AbaBandeiraEmit>();

  @Input() abaAtual: number = ABA_TABS.ABA_TAB_INSERIR;

  @Input() bandeira: Bandeira = new Bandeira();

  public subscriptions: Array<Subscription> = [];
  public arquivoValido = false;
  public nomeCadastrado = false;
  public codigoArquivoOrigin?: number = undefined;
  public alterar = false;
  public alterado = false;
  public arquivo: Arquivo = new Arquivo();
  public ATIVO = SituacaoAtivoEnum.ATIVO;
  public INATIVO = SituacaoAtivoEnum.INATIVO;
  public NOME_JA_CADASTRADO = MENSAGENS.MENSAGEM_NOME_JA_CADASTRDO;
  public CAMPO_OBRIGATORIO = MENSAGENS.MENSAGEM_CAMPO_OBRIGATORIO;
  public NOME = 'nome';
  public SITUACAO = 'situacao';
  public CODIGO = 'codigo';

  public ABA_TABS = ABA_TABS;

  constructor(
    private bandeiraService: BandeirasService,
    private mensagemService: MensagemService,
    private dialogService: BbDialogService
  ) {}

  public get codigo(): AbstractControl {
    return this.formulario.get(this.CODIGO) as AbstractControl;
  }

  public get nome(): AbstractControl {
    return this.formulario.get(this.NOME) as AbstractControl;
  }

  public get situacao() {
    return this.formulario.get(this.SITUACAO) as AbstractControl;
  }

  public formulario = new UntypedFormGroup({
    nome: new UntypedFormControl(
      '',
      Validators.compose([(ctrl) => Validators.required(ctrl), Validators.maxLength(30), Validators.minLength(1)])
    ),
    situacao: new UntypedFormControl(null, [Validators.required]),
    codigo: new UntypedFormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.situacao.setValue(this.ATIVO);
    this.populaFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.abaAtual) {
      this.alterar = this.abaAtual === ABA_TABS.ABA_TAB_ALTERAR;
    }
    if (changes.bandeira) {
      this.populaFormulario();
    }
  }

  cancela() {
    const dialogRef = this.dialogService.open({
      context: {
        size: BbDialogSizes.LARGE,
        paragraph: [MENSAGENS.MENSAGEM_SAIR_ABA_INCLUIR],
        primaryButtonLabel: CONSTANTS.SIM_CAIXA_ALTA,
        secondaryButtonLabel: CONSTANTS.NAO_CAIXA_ALTA,
      },
    });

    dialogRef.onPrimaryButtonClick.subscribe(() => {
      dialogRef.close();
      this.limpaInserir();
      this.inserirArquivo.deletaArquivo();
      this.trocaAba({ aba: ABA_TABS.ABA_TAB_CONSULTAR });
    });

    dialogRef.onSecondaryButtonClick.subscribe(() => {
      dialogRef.close();
    });
  }

  salva(): void {
    this.mensagemService.limpar();
    if (this.alterar) {
      this.bandeiraService.alteraBandeira(this.populaBandeira()).subscribe({
        next: () => {
          this.inserirArquivo.deletaArquivoOriginal();
          this.trataRetornoSucesso();
        },
        error: (error: ErrorMensagem) => {
          this.trataErroFuncional(error);
        },
      });
    } else {
      this.bandeiraService.incluiBandeira(this.populaBandeira()).subscribe({
        next: () => {
          this.trataRetornoSucesso();
        },
        error: (error: ErrorMensagem) => {
          this.trataErroFuncional(error);
        },
      });
    }
  }

  trataErroFuncional(error: ErrorMensagem): void {
    if (error.status === 400 && error.error.messages[0].text.includes(MENSAGENS.MENSAGEM_NOME_JA_CADASTRDO)) {
      this.nomeCadastrado = true;
      this.nome.markAsDirty();
    }
  }

  trataRetornoSucesso(): void {
    this.mensagemService.mensagemSucesso(this.alterar ? MENSAGENS.MENSAGEM_ALTERADO_COM_SUCESSO : MENSAGENS.MENSAGEM_INCLUIDO_COM_SUCESSO);
    this.limpaInserir();
    this.trocaAba({ aba: ABA_TABS.ABA_TAB_CONSULTAR });
  }

  populaFormulario(): void {
    this.codigo.setValue(this.bandeira.codigo);
    this.nome.setValue(this.bandeira.nome);
    this.situacao.setValue(this.bandeira.situacao ?? SituacaoAtivoEnum.ATIVO);
    this.arquivo.id = this.bandeira.codigoArquivo;
    this.codigoArquivoOrigin = this.bandeira.codigoArquivo;
  }

  populaBandeira(): Bandeira {
    let bandeira = new Bandeira();
    if (this.arquivo.id && this.nome.value && this.situacao.value) {
      bandeira = {
        codigo: this.codigo.value as number,
        nome: this.nome.value as string,
        situacao: this.situacao.value as SituacaoAtivoEnum,
        codigoArquivo: this.arquivo.id,
      };
    }
    return bandeira;
  }

  setFistColClass(): string {
    return this.alterar ? CLASS.COL_13 : CLASS.FIRST_COL;
  }

  limpaInserir(): void {
    this.formulario.reset();
    this.codigo.setValue(undefined);
    this.nome.setValue('');
    this.situacao.setValue(this.ATIVO);
    this.inserirArquivo.limpaUpload();
    this.arquivo = new Arquivo();
    this.arquivoValido = false;
    this.nomeCadastrado = false;
    this.codigoArquivoOrigin = undefined;
  }

  checarAlteracao(): void {
    this.alterado = this.alterar
      ? this.nome.value !== this.bandeira.nome ||
        this.situacao.value !== this.bandeira.situacao ||
        this.codigoArquivoOrigin !== this.arquivo.id
      : true;
  }

  onAlteraNome(): void {
    this.checarAlteracao();
    this.nomeCadastrado = false;
  }

  onArquivoStatus($event: { arquivo: Arquivo; valido: boolean }) {
    this.arquivoValido = $event.valido;
    this.arquivo = $event.arquivo;
    this.checarAlteracao();
  }

  trocaAba(abaEmit: AbaBandeiraEmit) {
    this.emitAba.emit(abaEmit);
  }

  validaCodigo(valor: string) {
    if (valor[0] === '0') {
      this.codigo.reset();
    }
  }
}
