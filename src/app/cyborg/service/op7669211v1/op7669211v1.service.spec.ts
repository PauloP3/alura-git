import { HTTP_INTERCEPTORS, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ILogBandeira } from 'src/app/models/ILogBandeira';

import { CyborgInterceptorService } from '../../cyborg-interceptor.service';
import { Op7669211v1, Op7669211v1Request, Op7669211v1Response } from './op7669211v1.service';
import { BandeirasService } from 'src/app/service/bandeiras/bandeiras.service';

import { URL_OPERACOES } from '../../operacoes-const';
import { IIBDetalheLog } from './IIBDetalheLog';

describe('Op7669211v1 - Deve Consultar detalhes do log : Testes com Interceptor', () => {
  let operacao: Op7669211v1;
  let service: BandeirasService;
  let httpTestingController: HttpTestingController;

  const mockLogBandeira: ILogBandeira = {
    codigo: 1,
    usuarioResponsavel: 'C1325000 - Teste Testando',
    dataHora: '2023-06-15T09:05:41.856828',
    tipoRegistro: 'ALTERACAO',
  };

  const mockLogBandeiraVazio: ILogBandeira = {
    codigo: 'undefined',
    usuarioResponsavel: '',
    dataHora: '',
    tipoRegistro: '',
  };

  const mockDetalheLog: IIBDetalheLog = {
    nomeBandeira: 0,
    indicadorEstadoBandeira: 0,
    codigoArquivo: 0,
  };

  const mockDetalheLogResposta: Op7669211v1Response = {
    codigoBandeiraCartao: 1,
    nomeBandeiraCartao: 'Teste visa',
    codigoArquivoEmbossamento: 4,
    indicadorEstadoBandeira: 'INATIVO',
    indicadorComparativoHistorico: mockDetalheLog,
  };

  const mockDetalheLogRespostaSemComparativo: Op7669211v1Response = {
    codigoBandeiraCartao: 1,
    nomeBandeiraCartao: 'Teste visa',
    codigoArquivoEmbossamento: 4,
    indicadorEstadoBandeira: 'INATIVO',
  };

  const mockDetalheLogRequisicao: Op7669211v1Request = {
    codigoBandeiraCartao: '1',
    dataAtualizacaoHistorico: '2023-06-15T09:05:41.856828',
  };

  const mockDetalheLogRequisicaoVazio: Op7669211v1Request = {
    codigoBandeiraCartao: undefined,
    dataAtualizacaoHistorico: undefined,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BandeirasService,
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
    service = TestBed.inject(BandeirasService);
    operacao = new Op7669211v1(URL_OPERACOES.Op7669211v1);
  });

  it('should be created', () => {
    expect(operacao).toBeTruthy();
  });

  it('Deve realizar a chamada da consulta do log e ser interceptada, convertida e enviada ao Cyborg', () => {
    const params = new HttpParams().append('codigoBandeiraCartao', 1).append('dataAtualizacaoHistorico', '2023-06-15T09:05:41.856828');
    const request: HttpRequest<ILogBandeira> = new HttpRequest('GET', BandeirasService.URL_BANDEIRA_DETALHE_HISTORICO, { params });

    service.consultaDetalhesDoLog(mockLogBandeira).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toEqual(operacao.mappingResponse(mockDetalheLogResposta));
      expect(true).toEqual(operacao.validaURL(request));
      expect(mockDetalheLogRequisicao).toEqual(operacao.mappingRequest(request));
    });

    const requestOperacao: TestRequest = httpTestingController.expectOne({
      method: 'POST',
      url: URL_OPERACOES.Op7669211v1,
    });

    expect(requestOperacao).toBeTruthy();

    const respostaEsperada = new HttpResponse({
      status: 200,
      statusText: 'Ok',
      body: mockDetalheLogResposta,
    });
    requestOperacao.event(respostaEsperada);
  });

  it('Deve realizar a chamada da consulta do log sem comparativo', () => {
    const params = new HttpParams();
    const request: HttpRequest<ILogBandeira> = new HttpRequest('GET', BandeirasService.URL_BANDEIRA_DETALHE_HISTORICO, { params });

    service.consultaDetalhesDoLog(mockLogBandeiraVazio).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toEqual(operacao.mappingResponse(mockDetalheLogRespostaSemComparativo));
      expect(true).toEqual(operacao.validaURL(request));
      expect(mockDetalheLogRequisicaoVazio).toEqual(operacao.mappingRequest(request));
    });

    const requestOperacao: TestRequest = httpTestingController.expectOne({
      method: 'POST',
      url: URL_OPERACOES.Op7669211v1,
    });

    expect(requestOperacao).toBeTruthy();

    const respostaEsperada = new HttpResponse({
      status: 200,
      statusText: 'Ok',
      body: mockDetalheLogRespostaSemComparativo,
    });
    requestOperacao.event(respostaEsperada);
  });
});
