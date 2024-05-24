import { HTTP_INTERCEPTORS, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IPaginacaoLog } from 'src/app/models/IPaginacaoLog';

import { CyborgInterceptorService } from '../../cyborg-interceptor.service';
import { Op7659605v1, Op7659605v1Request, Op7659605v1Response } from './op7659605v1.service';
import { BandeirasService } from 'src/app/service/bandeiras/bandeiras.service';

import { URL_OPERACOES } from '../../operacoes-const';
import { IBBLogBandeira } from './IIBLogBandeira';

describe('Op7659605v1 - Deve Consultar log de Bandeiras : Testes com Interceptor', () => {
  let operacao: Op7659605v1;
  let service: BandeirasService;
  let httpTestingController: HttpTestingController;

  const mockPaginacaoLog: IPaginacaoLog = {
    codigo: 3,
    pageIndex: 0,
    totalRegistros: 15,
    pageSize: 10,
    sortField: 'data',
    sortOrder: 'asc',
  };

  const mockPaginacaoLogVazia: IPaginacaoLog = {
    codigo: '',
    pageIndex: 0,
    totalRegistros: 0,
    pageSize: 0,
    sortField: '',
    sortOrder: '',
  };

  const mockIIBLogBandeira: IBBLogBandeira = {
    textoTipoAtualizacaoHistorico: 'ALTERACAO',
    codigoUsuarioResponsavelAtualizacao: 'C1325000 - Teste Testando',
    dataAtualizacaoHistorico: '2023-06-15T09:05:41.856828',
    codigoBandeiraCartao: 1,
  };

  const mockLogBandeiraResposta: Op7659605v1Response = {
    listaHistoricoBandeira: [mockIIBLogBandeira],
    quantidadeOcorrenciaListaHistoricoBandeira: 10,
    quantidadeTotalRegistro: 15,
  };

  const mockLogBandeiraRespostaVazia: Op7659605v1Response = {
    listaHistoricoBandeira: undefined,
    quantidadeOcorrenciaListaHistoricoBandeira: 10,
    quantidadeTotalRegistro: 15,
  };

  const mockRequisicao: Op7659605v1Request = {
    codigoBandeiraCartao: '1',
    codigoTipoOrdem: '-1',
    nomeOrdemColuna: 'data',
    numeroPaginaTamanho: 10,
    numeroPaginaAtual: 0,
  };

  const mockRequisicaoVazio: Op7659605v1Request = {
    codigoBandeiraCartao: undefined,
    codigoTipoOrdem: undefined,
    nomeOrdemColuna: undefined,
    numeroPaginaTamanho: 10,
    numeroPaginaAtual: 0,
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
    operacao = new Op7659605v1(URL_OPERACOES.Op7659605v1);
  });

  it('should be created', () => {
    expect(operacao).toBeTruthy();
  });

  it('Deve realizar a chamada da consulta do log e ser interceptada, convertida e enviada ao Cyborg', () => {
    const params = new HttpParams()
      .append('codigoBandeiraCartao', 1)
      .append('codigoTipoOrdem', '-1')
      .append('nomeOrdemColuna', 'data')
      .append('numeroPaginaTamanho', 10)
      .append('numeroPaginaAtual', 0);
    const request: HttpRequest<IPaginacaoLog> = new HttpRequest('GET', BandeirasService.URL_BANDEIRA_HISTORICO, { params });

    service.consultaLogBandeiras(mockPaginacaoLog).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toEqual(operacao.mappingResponse(mockLogBandeiraResposta));
      expect(true).toEqual(operacao.validaURL(request));
      expect(mockRequisicao).toEqual(operacao.mappingRequest(request));
    });

    const requestOperacao: TestRequest = httpTestingController.expectOne({
      method: 'POST',
      url: URL_OPERACOES.Op7659605v1,
    });

    expect(requestOperacao).toBeTruthy();

    const respostaEsperada = new HttpResponse({
      status: 200,
      statusText: 'Ok',
      body: mockLogBandeiraResposta,
    });
    requestOperacao.event(respostaEsperada);
  });

  it('Deve realizar a chamada da consulta do log sem filtro', () => {
    const params = new HttpParams();
    const request: HttpRequest<IPaginacaoLog> = new HttpRequest('GET', BandeirasService.URL_BANDEIRA_HISTORICO, { params });

    service.consultaLogBandeiras(mockPaginacaoLogVazia).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toEqual(operacao.mappingResponse(mockLogBandeiraRespostaVazia));
      expect(true).toEqual(operacao.validaURL(request));
      expect(mockRequisicaoVazio).toEqual(operacao.mappingRequest(request));
    });

    const requestOperacao: TestRequest = httpTestingController.expectOne({
      method: 'POST',
      url: URL_OPERACOES.Op7659605v1,
    });

    expect(requestOperacao).toBeTruthy();

    const respostaEsperada = new HttpResponse({
      status: 200,
      statusText: 'Ok',
      body: mockLogBandeiraRespostaVazia,
    });
    requestOperacao.event(respostaEsperada);
  });
});
