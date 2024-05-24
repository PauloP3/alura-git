import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Injectable, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BB_DOCUMENT,
  BbDialogModule,
  BbDialogRef,
  BbDialogService,
  BbSelectFieldModule,
  BbTabsModule,
  BbTextareaModule,
  BbViewportRulerAdapter,
} from 'dls-angular';
import { GAWTemplateBaseModule } from 'dls-base-components-gaw';
import { Observable, of, throwError } from 'rxjs';
import { ABA_TABS } from 'src/app/models/constants/aba-constants';
import { ARQUIVO_CONSTS } from 'src/app/models/constants/arquivo-constants';
import { CLASS } from 'src/app/models/constants/class-constants';
import { MENSAGENS } from 'src/app/models/constants/mensagens-constants';
import { SituacaoAtivoEnum } from 'src/app/models/enums/situacao-ativo';

import { BandeirasService } from 'src/app/service/bandeiras/bandeiras.service';
import { ErrorMensagem, MensagemService } from 'src/app/service/messages/mensagem.service';

import { InserirArquivosComponent } from './inserir-arquivos/inserir-arquivos.component';
import { InserirBandeirasComponent } from './inserir-bandeiras.component';

import { Arquivo } from 'src/app/models/arquivo.model';
import { Bandeira } from 'src/app/models/bandeira.model';
import Spy = jasmine.Spy;

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

const arquivoMock: Arquivo = {
  nome: 'documento.png',
  content: new File(['(⌐□_□)'], 'documento.png', { type: 'image/png' }),
  descricao: ARQUIVO_CONSTS.ARQUIVO_DESCRICAO,
  codigoTipo: ARQUIVO_CONSTS.NUMERO_TIPO_ARQUIVO,
};

const mockBandeira: Bandeira = {
  codigo: 1,
  nome: 'Teste',
  situacao: SituacaoAtivoEnum.ATIVO,
  codigoArquivo: 3,
};

const eventMock = { arquivo: arquivoMock, valido: true };

@Injectable()
export class BbViewportRulerMockAdapter extends BbViewportRulerAdapter {
  override getViewportSize(): Readonly<{ width: number; height: number }> {
    return { width: 1600, height: 900 };
  }
}

describe('InserirBandeirasComponent', () => {
  let component: InserirBandeirasComponent;
  let fixture: ComponentFixture<InserirBandeirasComponent>;
  let inserirArquivo: InserirArquivosComponent;
  let bandeiraService: BandeirasService;
  let mensagemService: MensagemService;
  let dialogService: BbDialogService;
  let diagRef: BbDialogRef;
  let limpaUploadSpy: Spy<() => void>;

  beforeEach(() => {
    diagRef = jasmine.createSpyObj(['close'], ['onPrimaryButtonClick', 'onSecondaryButtonClick']) as BbDialogRef;
    TestBed.configureTestingModule({
      imports: [
        GAWTemplateBaseModule,
        HttpClientTestingModule,
        BbTabsModule,
        BbDialogModule.forRoot(),
        BbSelectFieldModule,
        BbTextareaModule,
      ],
      declarations: [InserirBandeirasComponent],
      providers: [
        {
          provide: BbViewportRulerAdapter,
          useClass: BbViewportRulerMockAdapter,
        },
        { provide: BB_DOCUMENT, useExisting: DOCUMENT },
        {
          provide: BbDialogRef,
          useValue: diagRef,
        },
        InserirArquivosComponent,
        BbDialogService,
        MensagemService,
        BandeirasService,
        HttpClient,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InserirBandeirasComponent);
    bandeiraService = TestBed.inject(BandeirasService);
    mensagemService = TestBed.inject(MensagemService);
    dialogService = TestBed.inject(BbDialogService);
    inserirArquivo = TestBed.inject(InserirArquivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    limpaUploadSpy = spyOn(inserirArquivo, 'limpaUpload');
    component.inserirArquivo = inserirArquivo;
    component.bandeira = mockBandeira;
    component.populaFormulario();

    (Object.getOwnPropertyDescriptor(diagRef, 'onPrimaryButtonClick')?.get as Spy<() => Observable<MouseEvent>>).and.returnValue(
      of({} as MouseEvent)
    );

    (Object.getOwnPropertyDescriptor(diagRef, 'onSecondaryButtonClick')?.get as Spy<() => Observable<MouseEvent>>).and.returnValue(
      of({} as MouseEvent)
    );
  });

  it('Deve ser criado component', () => {
    expect(component).toBeTruthy();
  });

  it('Deve ser criado bandeiraService', () => {
    expect(bandeiraService).toBeTruthy();
  });

  it('deve ser executado cancelar', () => {
    spyOn(dialogService, 'open').and.returnValue(diagRef);
    component.cancela();
    component.trocaAba({ aba: 0 });
    expect(dialogService.open).toHaveBeenCalled();
  });

  it('Deve executar salvar e incluir com sucesso', () => {
    bandeiraService.incluiBandeira = jasmine.createSpy().and.returnValue(of(1));
    const spy = spyOn(mensagemService, 'mensagemSucesso');
    component.salva();
    expect(spy).toHaveBeenCalledWith(MENSAGENS.MENSAGEM_INCLUIDO_COM_SUCESSO);
  });

  it('Deve executar salvar e incluir retornar error', () => {
    spyOn(bandeiraService, 'incluiBandeira').and.returnValue(throwError(() => erroMock));
    component.salva();
    expect(component.nomeCadastrado).toBeTrue();
    expect(component.nome.dirty).toBeTrue();
  });

  it('Deve executar salvar e alterar com sucesso', () => {
    component.alterar = true;
    bandeiraService.alteraBandeira = jasmine.createSpy().and.returnValue(of(1));
    const spy = spyOn(mensagemService, 'mensagemSucesso');
    component.salva();
    expect(spy).toHaveBeenCalledWith(MENSAGENS.MENSAGEM_ALTERADO_COM_SUCESSO);
  });

  it('Deve executar salvar e alterar retornar error', () => {
    component.alterar = true;
    spyOn(bandeiraService, 'alteraBandeira').and.returnValue(throwError(() => erroMock));
    component.salva();
    expect(component.nomeCadastrado).toBeTrue();
    expect(component.nome.dirty).toBeTrue();
  });

  it('Deve limpar inserir', () => {
    component.limpaInserir();
    expect(component.nome.value).toEqual('');
    expect(component.situacao.value).toEqual(component.ATIVO);
    expect(limpaUploadSpy).toHaveBeenCalled();
    expect(component.arquivo.id).toBeUndefined();
  });

  it('Deve popular Bandeira', () => {
    component.nome.setValue('Teste');
    component.situacao.setValue(component.INATIVO);
    component.arquivo = new Arquivo();
    component.arquivo.id = 3;
    const retorno = component.populaBandeira();
    expect(retorno.nome).toEqual(component.nome.value as string);
    expect(retorno.situacao).toEqual(component.situacao.value as SituacaoAtivoEnum);
    expect(retorno.codigoArquivo).toEqual(component.arquivo.id);
  });

  it('Deve popular formulario', () => {
    component.bandeira = mockBandeira;
    component.populaFormulario();
    expect(component.codigo.value).toEqual(mockBandeira.codigo);
    expect(component.nome.value).toEqual(mockBandeira.nome);
    expect(component.situacao.value).toEqual(mockBandeira.situacao);
    expect(component.arquivo.id).toEqual(mockBandeira.codigoArquivo);

    component.bandeira.situacao = undefined;
    component.populaFormulario();
    expect(component.situacao.value).toEqual(SituacaoAtivoEnum.ATIVO);
  });

  it('Deve executar onArquivoStatus', () => {
    component.onArquivoStatus(eventMock);
    expect(component.arquivoValido).toEqual(eventMock.valido);
    expect(component.arquivo).toEqual(eventMock.arquivo);
  });

  it('deve ser executado ngOnChanges', () => {
    const changes: SimpleChanges = {
      abaAtual: {
        currentValue: ABA_TABS.ABA_TAB_ALTERAR,
        previousValue: ABA_TABS.ABA_TAB_ALTERAR,
        isFirstChange: () => true,
        firstChange: true,
      },
      bandeira: {
        currentValue: mockBandeira,
        previousValue: new Bandeira(),
        isFirstChange: () => true,
        firstChange: true,
      },
    };
    const spy = spyOn(component, 'populaFormulario');
    component.ngOnChanges(changes);
    expect(spy).toHaveBeenCalled();
  });

  it('Deve definir classes', () => {
    component.alterar = true;
    const retornoAlterar = component.setFistColClass();
    expect(retornoAlterar).toEqual(CLASS.COL_13);

    component.alterar = false;
    const retornoInserir = component.setFistColClass();
    expect(retornoInserir).toEqual(CLASS.FIRST_COL);
  });

  it('Deve checar alterado na condição de inserir', () => {
    component.alterar = false;
    expect(component.alterado).toBeFalse();
    component.checarAlteracao();
    expect(component.alterado).toBeTrue();
  });

  it('Deve checar nome alterado', () => {
    component.alterar = true;
    expect(component.alterado).toBeFalse();
    component.nome.setValue('Teste Alterado');
    component.checarAlteracao();
    expect(component.alterado).toBeTrue();
  });

  it('Deve checar situacao alterado', () => {
    component.alterar = true;
    expect(component.alterado).toBeFalse();
    component.nome.setValue(SituacaoAtivoEnum.INATIVO);
    component.checarAlteracao();
    expect(component.alterado).toBeTrue();
  });

  it('Deve checar arquivo alterado', () => {
    component.alterar = true;
    expect(component.alterado).toBeFalse();
    component.arquivo.id = 6;
    component.checarAlteracao();
    expect(component.alterado).toBeTrue();
  });

  it('Deve executar onAlteraNome', () => {
    component.onAlteraNome();
    expect(component.nomeCadastrado).toBeFalse();
  });

  it('deve validar se o primeiro digito for 0 e limpar o campo código', () => {
    component.codigo.setValue('012345');
    const spyCodigo = spyOn(component.codigo, 'reset');

    component.validaCodigo(component.codigo.value as string);

    expect(spyCodigo).toHaveBeenCalled();
  });
});
