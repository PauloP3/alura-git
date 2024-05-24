import { HTTP_INTERCEPTORS, HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CyborgInterceptorService } from '../../cyborg-interceptor.service';
import { Op5530760v4, Op5530760v4Request, Op5530760v4Response } from './op5530760v4.service';
import { ArquivoService } from 'src/app/service/arquivo/arquivo.service';

import { Arquivo } from 'src/app/models/arquivo.model';

import { URL_OPERACOES } from '../../operacoes-const';

const arquivoMock: Arquivo = {
  id: 1,
  nome: 'Teste',
  content: 'Teste File',
  codigoTipo: 12,
  descricao: 'Log de bandeira - Teste',
};

const requestMock: Op5530760v4Request = {
  nomeArquivoEmbossamento: 'Teste',
  blobBinarioArquivoEmbossamento: 'Teste File',
  codigoTipoArquivoEmbossamento: 12,
  textoDescricaoArquivoEmbossamento: 'Log de bandeira - Teste',
  quantidadeDescricaoArquivoEmbossamento: 23,
  quantidadeTamanhoBlobBinarioArquivoEmbossamento: 10,
};

const responseMock: Op5530760v4Response = {
  codigoArquivoEmbossamento: 1,
  nomeArquivoEmbossamento: 'Teste',
  codigoTipoArquivoEmbossamento: 12,
  textoDescricaoArquivoEmbossamento: 'Log de bandeira - Teste',
};

describe('Op5530760v4- Cyborg Upload de Arquivo: Testes com Interceptor', () => {
  let operacao: Op5530760v4;
  let service: ArquivoService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ArquivoService,
        CyborgInterceptorService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: CyborgInterceptorService,
          multi: true,
        },
      ],
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ArquivoService);
    operacao = new Op5530760v4(URL_OPERACOES.Op5530760v4);
  });

  it('Deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('Deve realizar a chamada de inclusao de parametrizacao e ser interceptada, convertida e enviada ao Cyborg', () => {
    const request: HttpRequest<Arquivo> = new HttpRequest('POST', ArquivoService.URL_ARQUIVO_UPLOAD, arquivoMock);

    service.upload(arquivoMock).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toEqual(operacao.mappingResponse(responseMock));
      expect(true).toEqual(operacao.validaURL(request));
      expect(requestMock).toEqual(operacao.mappingRequest(request));
    });

    const requestOperacao: TestRequest = httpTestingController.expectOne({
      method: 'POST',
      url: URL_OPERACOES.Op5530760v4,
    });

    expect(requestOperacao).toBeTruthy();

    const respostaEsperada = new HttpResponse({
      status: 200,
      statusText: 'Ok',
      body: responseMock,
    });
    requestOperacao.event(respostaEsperada);
  });
});
