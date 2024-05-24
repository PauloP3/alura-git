/* tslint:disable:no-unused-variable */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventEmitter, Injectable, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BbFileUploadComponent, BbFileUploadModule, BbViewportRulerAdapter, UploadInfo } from 'dls-angular';
import { GAWTemplateBaseModule } from 'dls-base-components-gaw';
import { of, throwError } from 'rxjs';
import { ARQUIVO_CONSTS } from 'src/app/models/constants/arquivo-constants';
import { MENSAGENS } from 'src/app/models/constants/mensagens-constants';

import { ArquivoService } from 'src/app/service/arquivo/arquivo.service';
import { ErrorMensagem, MensagemService } from 'src/app/service/messages/mensagem.service';

import { InserirArquivosComponent } from './inserir-arquivos.component';

import { Arquivo } from 'src/app/models/arquivo.model';

@Injectable()
export class BbViewportRulerMockAdapter extends BbViewportRulerAdapter {
  override getViewportSize(): Readonly<{ width: number; height: number }> {
    return { width: 1600, height: 900 };
  }
}

const fileMock: File = new File(['(⌐□_□)'], 'documento.png', { type: 'image/png' });
const notAllowedFileMock = {
  fileName: 'documento.pdf',
  fileSize: '2.30 MB',
  errorMsg: MENSAGENS.MENSAGEM_TAMANHO_INVALIDO,
  type: 'image/png',
};

const arquivoMock: Arquivo = {
  nome: 'documento.png',
  content: new File(['(⌐□_□)'], 'documento.png', { type: 'image/png' }),
  descricao: ARQUIVO_CONSTS.ARQUIVO_DESCRICAO,
  codigoTipo: ARQUIVO_CONSTS.NUMERO_TIPO_ARQUIVO,
};

const erroMock: ErrorMensagem = {
  status: 400,
  statusText: 'Bed Request',
  error: {
    messages: [
      {
        text: MENSAGENS.MENSAGEM_NOME_JA_CADASTRDO,
      },
    ],
  },
};

describe('InserirArquivosComponent', () => {
  let component: InserirArquivosComponent;
  let fixture: ComponentFixture<InserirArquivosComponent>;
  let bbFileUploadComponentMock: jasmine.SpyObj<BbFileUploadComponent>;
  let arquivoService: ArquivoService;
  let mensagemService: MensagemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InserirArquivosComponent, BbFileUploadComponent],
      imports: [GAWTemplateBaseModule, HttpClientTestingModule, BbFileUploadModule],
      providers: [
        {
          provide: BbViewportRulerAdapter,
          useClass: BbViewportRulerMockAdapter,
        },
        MensagemService,
        ArquivoService,
        BbFileUploadComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InserirArquivosComponent);
    arquivoService = TestBed.inject(ArquivoService);
    mensagemService = TestBed.inject(MensagemService);
    component = fixture.componentInstance;
    bbFileUploadComponentMock = jasmine.createSpyObj('BbFileUploadComponent', [
      'uploadFiles',
      'resetFileUpload',
    ]) as jasmine.SpyObj<BbFileUploadComponent>;
    const fileSelectedMock = Object.assign(new EventEmitter<UploadInfo[]>(), {});
    const deleteItemMock = Object.assign(new EventEmitter<unknown>(), {});

    bbFileUploadComponentMock.fileSelected = fileSelectedMock;
    bbFileUploadComponentMock.deleteItem = deleteItemMock;

    component.uploadBtn = bbFileUploadComponentMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Deve Popular Arquivo', () => {
    component.file = fileMock;

    const arquivo = component.populaArquivo();

    expect(arquivo.nome).toEqual(fileMock.name);
    expect(arquivo.content).toEqual(fileMock);
    expect(arquivo.descricao).toEqual(arquivoMock.descricao);
    expect(arquivo.codigoTipo).toEqual(arquivoMock.codigoTipo);
  });

  it('Deve Selecionar Arquivo Valido', () => {
    component.uploadBtn = bbFileUploadComponentMock;
    component.uploadBtn.allowedFiles = [fileMock];
    const spy = spyOn(component, 'uploadArquivo');
    component.selecionaArquivo();
    expect(spy).toHaveBeenCalled();
    expect(component.file).toEqual(fileMock);
  });

  it('Deve Selecionar Arquivo InValido', () => {
    component.uploadBtn = bbFileUploadComponentMock;
    component.uploadBtn.notAllowedFiles = [notAllowedFileMock];
    const spy = spyOn(mensagemService, 'limpar');
    component.selecionaArquivo();
    const errorMsg = component.uploadBtn.notAllowedFiles[0].errorMsg;
    expect(errorMsg).toEqual(MENSAGENS.MENSAGEM_ERROR_ARQUIVO_TAMANHO_MAXIMO);
    expect(spy).toHaveBeenCalled();
    expect(component.arquivoInvalido).toBeTrue();
  });

  it('Deve executar excruir arquivo com sucesso', () => {
    component.arquivo = arquivoMock;
    component.arquivo.id = 3;
    component.uploadBtn = bbFileUploadComponentMock;
    component.uploadBtn.disabled = true;
    arquivoService.exclui = jasmine.createSpy().and.returnValue(of({}));
    const spyMensagem = spyOn(mensagemService, 'limpar');
    const spydefineStatusArquivo = spyOn(component, 'defineStatusArquivo');
    component.onArquivoDelete();
    component.deletaArquivo();
    expect(spyMensagem).toHaveBeenCalled();
    expect(spydefineStatusArquivo).toHaveBeenCalled();
    expect(component.uploadBtn.disabled).toBeFalse();
  });

  it('Deve executar excluir arquivo e retornar error', () => {
    component.arquivo = arquivoMock;
    component.arquivo.id = 3;
    spyOn(arquivoService, 'exclui').and.returnValue(throwError(() => erroMock));
    const spyMensagem = spyOn(mensagemService, 'limpar');
    const spydefineStatusArquivo = spyOn(component, 'defineStatusArquivo');
    component.onArquivoDelete();
    component.deletaArquivo();
    expect(spyMensagem).toHaveBeenCalled();
    expect(spydefineStatusArquivo).toHaveBeenCalled();
  });

  it('Deve executar excruir arquivo com sucesso', () => {
    component.arquivo = arquivoMock;
    component.arquivo.id = 3;
    component.codigoArquivoOrigin = 4;
    arquivoService.exclui = jasmine.createSpy().and.returnValue(of({}));
    const spyMensagem = spyOn(mensagemService, 'limpar');
    component.deletaArquivoOriginal();
    expect(spyMensagem).toHaveBeenCalled();
  });

  it('Deve executar excluir arquivo original e retornar error', () => {
    component.arquivo = arquivoMock;
    component.arquivo.id = 3;
    component.codigoArquivoOrigin = 4;
    spyOn(arquivoService, 'exclui').and.returnValue(throwError(() => erroMock));
    const spyMensagem = spyOn(mensagemService, 'limpar');
    component.deletaArquivoOriginal();
    expect(spyMensagem).toHaveBeenCalled();
  });

  it('Deve executar upload de arquivo com sucesso', () => {
    const arquivoRetorno = arquivoMock;
    arquivoMock.id = 3;
    arquivoService.upload = jasmine.createSpy().and.returnValue(of(arquivoRetorno));
    const spyMensagem = spyOn(mensagemService, 'limpar');
    const spydefineStatusArquivo = spyOn(component, 'defineStatusArquivo');
    component.uploadArquivo(arquivoMock);
    component.executaUpload(arquivoMock);
    expect(spyMensagem).toHaveBeenCalled();
    expect(component.arquivo).toEqual(arquivoRetorno);
    expect(component.arquivoInvalido).toBeFalse();
    expect(spydefineStatusArquivo).toHaveBeenCalled();
  });

  it('Deve executar upload arquivo e retornar error', () => {
    component.arquivo = arquivoMock;
    component.uploadBtn = bbFileUploadComponentMock;
    component.uploadBtn.allowedFiles = [fileMock];
    component.uploadBtn.disabled = true;
    spyOn(arquivoService, 'upload').and.returnValue(throwError(() => erroMock));
    component.executaUpload(arquivoMock);
    expect(component.uploadBtn.disabled).toBeFalse();
    expect(component.arquivoInvalido).toBeTrue();
  });

  it('Deve limpar Upload com sucesso', () => {
    component.uploadBtn = bbFileUploadComponentMock;
    component.uploadBtn.allowedFiles = [fileMock];
    component.uploadBtn.notAllowedFiles = [notAllowedFileMock];
    component.uploadBtn.disabled = true;
    component.limpaUpload();
    expect(component.uploadBtn.allowedFiles.length).toEqual(0);
    expect(component.uploadBtn.notAllowedFiles.length).toEqual(0);
    expect(component.uploadBtn.disabled).toBeFalse();
    expect(component.arquivoInvalido).toBeFalse();
  });

  it('Deve executar download', () => {
    component.alterar = true;
    component.codigoArquivoOrigin = 3;
    component.uploadBtn = bbFileUploadComponentMock;
    component.uploadBtn.allowedFiles = [];
    arquivoService.metadado = jasmine.createSpy().and.returnValue(of(arquivoMock));
    component.download();
    expect(component.uploadBtn.disabled).toBeTrue();
    expect(component.uploadBtn.uploadPercent).toEqual(100);
    expect(component.uploadBtn.allowedFiles[0].name).toEqual(arquivoMock.nome as string);
  });

  it('Deve executar download e retornar error', () => {
    component.alterar = true;
    component.codigoArquivoOrigin = 3;
    component.uploadBtn = bbFileUploadComponentMock;
    component.uploadBtn.allowedFiles = [];
    spyOn(arquivoService, 'metadado').and.returnValue(throwError(() => erroMock));
    component.download();
    expect(component.arquivoInvalido).toBeTrue();
  });

  it('deve ser executado ngOnChanges', () => {
    component.alterar = true;
    const changes: SimpleChanges = {
      codigoArquivoOrigin: {
        currentValue: 3,
        previousValue: 3,
        isFirstChange: () => true,
        firstChange: true,
      },
    };
    const spy = spyOn(component, 'download');
    component.ngOnChanges(changes);
    expect(spy).toHaveBeenCalled();
  });
});
