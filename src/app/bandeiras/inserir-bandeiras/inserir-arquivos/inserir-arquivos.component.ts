import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { BbFileUploadComponent, FileUploadConfig } from 'dls-angular';
import { ARQUIVO_CONSTS } from 'src/app/models/constants/arquivo-constants';
import { MENSAGENS } from 'src/app/models/constants/mensagens-constants';
import { convertToBase64 } from 'src/app/utils/helper-functions';

import { ArquivoService } from './../../../service/arquivo/arquivo.service';
import { MensagemService } from 'src/app/service/messages/mensagem.service';

import { Arquivo } from './../../../models/arquivo.model';

@Component({
  selector: 'pcb-inserir-arquivos',
  templateUrl: './inserir-arquivos.component.html',
  styleUrls: ['./inserir-arquivos.component.scss'],
})
export class InserirArquivosComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild('uploadBtn') uploadBtn?: BbFileUploadComponent;
  @Output() arquivoStatus = new EventEmitter<{ arquivo: Arquivo; valido: boolean }>();
  @Input() alterar = false;
  @Input() codigoArquivoOrigin: number | undefined;

  public desabilitado = false;
  public arquivoInvalido = false;
  public hintArquivoValido = MENSAGENS.MENSAGEM_ARQUIVO_VALIDO;
  public arquivo!: Arquivo;
  public file!: File | undefined;

  constructor(private arquivoService: ArquivoService, private mensagemService: MensagemService) {}

  config: FileUploadConfig = {
    multiple: false,
    formatsAllowed: ARQUIVO_CONSTS.EXTENCOES_PERMITIDAS,
    maxSize: ARQUIVO_CONSTS.MAX_FILE_SIZE,
    uploadAPI: { url: '' },
  };

  ngAfterViewInit(): void {
    this.onArquivoSelect();
    this.onArquivoDelete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.codigoArquivoOrigin) {
      this.download();
    }
  }

  onArquivoSelect(): void {
    this.uploadBtn?.fileSelected.subscribe(() => {
      this.selecionaArquivo();
    });
  }

  onArquivoDelete(): void {
    this.uploadBtn?.deleteItem.subscribe(() => {
      this.deletaArquivo();
    });
  }

  selecionaArquivo(): void {
    this.arquivo = new Arquivo();
    if (this.uploadBtn) {
      const allowedFiles = this.uploadBtn.allowedFiles;
      const notAllowedFiles = this.uploadBtn.notAllowedFiles;
      if (allowedFiles && allowedFiles.length > 0) {
        this.file = allowedFiles[0];
        const arquivo = this.populaArquivo();
        this.uploadArquivo(arquivo);
      } else {
        if (notAllowedFiles[0] && notAllowedFiles[0].errorMsg === MENSAGENS.MENSAGEM_TAMANHO_INVALIDO) {
          notAllowedFiles[0].errorMsg = MENSAGENS.MENSAGEM_ERROR_ARQUIVO_TAMANHO_MAXIMO;
        }
        this.arquivoInvalido = true;
        this.mensagemService.limpar();
      }
    }
    this.defineStatusArquivo();
  }

  deletaArquivo(): void {
    if (this.arquivo?.id && this.arquivo.id !== this.codigoArquivoOrigin)
      this.arquivoService.exclui(this.arquivo.id).subscribe({
        next: () => this.mensagemService.limpar(),
        error: () => this.mensagemService.limpar(),
      });
    if (this.uploadBtn) this.uploadBtn.disabled = false;
    this.arquivo = new Arquivo();
    this.defineStatusArquivo();
  }

  deletaArquivoOriginal() {
    if (this.codigoArquivoOrigin && this.arquivo?.id !== this.codigoArquivoOrigin)
      this.arquivoService.exclui(this.codigoArquivoOrigin).subscribe({
        next: () => this.mensagemService.limpar(),
        error: () => this.mensagemService.limpar(),
      });
  }

  uploadArquivo(arquivo: Arquivo): void {
    convertToBase64(arquivo.content as File).subscribe((base64) => {
      arquivo.content = base64;
      this.executaUpload(arquivo);
    });
  }

  executaUpload(arquivo: Arquivo): void {
    this.arquivoService.upload(arquivo).subscribe({
      next: (retorno) => {
        this.mensagemService.limpar();
        if (this.uploadBtn) {
          this.uploadBtn.disabled = true;
          this.uploadBtn.uploadPercent = 100;
        }
        this.arquivo = retorno;
        this.arquivoInvalido = false;
        this.defineStatusArquivo();
      },
      error: () => {
        this.arquivoInvalido = true;
        if (this.uploadBtn) {
          this.uploadBtn.allowedFiles = [];
          this.uploadBtn.disabled = false;
        }
        this.mensagemService.limpar();
        this.mensagemService.mensagemErro(MENSAGENS.MENSAGEM_ERRO_UPLOAD);
      },
    });
  }

  download(): void {
    if (this.codigoArquivoOrigin && this.alterar) {
      this.arquivoService.metadado(this.codigoArquivoOrigin).subscribe({
        next: (arquivo) => {
          const file: File = new File([arquivo.content as string], arquivo.nome as string);
          this.arquivo = arquivo;
          this.arquivo.id = this.codigoArquivoOrigin;
          if (this.uploadBtn) {
            this.uploadBtn?.allowedFiles.push(file);
            this.uploadBtn.uploadPercent = 100;
            this.uploadBtn.disabled = true;
          }
          this.arquivoInvalido = false;
          this.defineStatusArquivo();
        },
        error: () => {
          this.arquivoInvalido = true;
        },
      });
    }
  }

  populaArquivo(): Arquivo {
    return {
      nome: this.file?.name,
      content: this.file,
      descricao: ARQUIVO_CONSTS.ARQUIVO_DESCRICAO,
      codigoTipo: ARQUIVO_CONSTS.NUMERO_TIPO_ARQUIVO,
    };
  }

  limpaUpload(): void {
    if (this.uploadBtn) {
      this.uploadBtn.allowedFiles = [];
      this.uploadBtn.notAllowedFiles = [];
      this.uploadBtn.disabled = false;
      this.arquivoInvalido = false;
    }
  }

  defineStatusArquivo(): void {
    this.arquivoStatus.emit({
      arquivo: this.arquivo,
      valido: !this.arquivoInvalido && this.arquivo?.id !== undefined,
    });
  }

  ngOnDestroy(): void {
    this.uploadBtn?.fileSelected.unsubscribe();
    this.uploadBtn?.deleteItem.unsubscribe();
  }
}
