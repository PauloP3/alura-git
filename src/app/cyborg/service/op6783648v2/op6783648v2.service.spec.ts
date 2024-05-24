/* tslint:disable:no-unused-variable */

import { HTTP_INTERCEPTORS, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SituacaoAtivoEnum } from 'src/app/models/enums/situacao-ativo';

import { CyborgInterceptorService } from '../../cyborg-interceptor.service';
import { Op6783648v2, Op6783648v2Request, Op6783648v2Response } from './op6783648v2.service';
import { BandeirasService } from 'src/app/service/bandeiras/bandeiras.service';

import { FiltrosConsultarBandeiras } from 'src/app/models/filtros-consultar-bandeiras.model';

import { URL_OPERACOES } from '../../operacoes-const';
import { IIBBandeira } from './IIBBandeira';

describe('Op6783648v2- Deve Consultar bandeira : Testes com Interceptor', () => {
  let operacao: Op6783648v2;
  let service: BandeirasService;
  let httpTestingController: HttpTestingController;

  const mockFiltro: FiltrosConsultarBandeiras = {
    codigo: 1,
    nome: 'visa',
    situacao: SituacaoAtivoEnum.ATIVO,
    pageSize: 10,
    pageIndex: 1,
    sortField: 'codigo',
    sortOrder: '-1',
  };

  const mockFiltroVazio: FiltrosConsultarBandeiras = {};

  const mockIIBBandeira: IIBBandeira[] = [
    {
      codigoBandeira: 1,
      nomeBandeira: 'Visa',
      indicadorEstadoBandeira: SituacaoAtivoEnum.ATIVO,
      listaArquivo: [
        {
          codigoArquivo: 1,
        },
      ],
    },
  ];

  const mockIIBBandeiraSemArquivo: IIBBandeira[] = [
    {
      codigoBandeira: 1,
      nomeBandeira: 'Visa',
      indicadorEstadoBandeira: SituacaoAtivoEnum.ATIVO,
      listaArquivo: undefined,
    },
  ];

  const mockBandeiraResposta: Op6783648v2Response = {
    listaBandeiraCartao: mockIIBBandeira,
    quantidadeBandeiraCartao: 10,
    quantidadeTotalRegistro: 100,
  };

  const mockBandeiraRespostaVazia: Op6783648v2Response = {
    listaBandeiraCartao: undefined,
    quantidadeBandeiraCartao: 0,
    quantidadeTotalRegistro: 0,
  };

  const mockBandeiraRespostaSemArquivo: Op6783648v2Response = {
    listaBandeiraCartao: mockIIBBandeiraSemArquivo,
    quantidadeBandeiraCartao: 0,
    quantidadeTotalRegistro: 0,
  };

  const mockRequisicao: Op6783648v2Request = {
    codigoBandeiraCartao: '1',
    nomeBandeiraCartao: 'visa',
    indicadorEstadoBandeira: SituacaoAtivoEnum.ATIVO,
    codigoTipoOrdem: '-1',
    nomeOrdemColuna: 'codigo',
    numeroPaginaTamanho: 10,
    numeroPaginaAtual: 1,
  };

  const mockRequisicaoVazio: Op6783648v2Request = {
    codigoBandeiraCartao: undefined,
    nomeBandeiraCartao: undefined,
    indicadorEstadoBandeira: undefined,
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
    operacao = new Op6783648v2(URL_OPERACOES.Op6783648v2);
  });

  it('Deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('Deve realizar a chamada da consulta e ser interceptada, convertida e enviada ao Cyborg', () => {
    const params = new HttpParams()
      .append('codigoBandeiraCartao', 1)
      .append('nomeBandeiraCartao', 'visa')
      .append('indicadorEstadoBandeira', 'ATIVO')
      .append('codigoTipoOrdem', '-1')
      .append('nomeOrdemColuna', 'codigo')
      .append('numeroPaginaTamanho', 10)
      .append('numeroPaginaAtual', 1);
    const request: HttpRequest<FiltrosConsultarBandeiras> = new HttpRequest('GET', BandeirasService.URL_BANDEIRA, { params });

    service.consultaBandeiras(mockFiltro).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toEqual(operacao.mappingResponse(mockBandeiraResposta));
      expect(true).toEqual(operacao.validaURL(request));
      expect(mockRequisicao).toEqual(operacao.mappingRequest(request));
    });

    const requestOperacao: TestRequest = httpTestingController.expectOne({
      method: 'POST',
      url: URL_OPERACOES.Op6783648v2,
    });

    expect(requestOperacao).toBeTruthy();

    const respostaEsperada = new HttpResponse({
      status: 200,
      statusText: 'Ok',
      body: mockBandeiraResposta,
    });
    requestOperacao.event(respostaEsperada);
  });

  it('Deve realizar a chamada da consulta sem filtros', () => {
    const params = new HttpParams();
    const request: HttpRequest<FiltrosConsultarBandeiras> = new HttpRequest('GET', BandeirasService.URL_BANDEIRA, { params });

    service.consultaBandeiras(mockFiltroVazio).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toEqual(operacao.mappingResponse(mockBandeiraRespostaSemArquivo));
      expect(true).toEqual(operacao.validaURL(request));
      expect(mockRequisicaoVazio).toEqual(operacao.mappingRequest(request));
    });

    const requestOperacao: TestRequest = httpTestingController.expectOne({
      method: 'POST',
      url: URL_OPERACOES.Op6783648v2,
    });

    expect(requestOperacao).toBeTruthy();

    const respostaEsperada = new HttpResponse({
      status: 200,
      statusText: 'Ok',
      body: mockBandeiraRespostaSemArquivo,
    });
    requestOperacao.event(respostaEsperada);
  });

  it('Deve realizar a chamada da consulta sem arquivos', () => {
    const params = new HttpParams();
    const request: HttpRequest<FiltrosConsultarBandeiras> = new HttpRequest('GET', BandeirasService.URL_BANDEIRA, { params });

    service.consultaBandeiras(mockFiltroVazio).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toEqual(operacao.mappingResponse(mockBandeiraRespostaVazia));
      expect(true).toEqual(operacao.validaURL(request));
      expect(mockRequisicaoVazio).toEqual(operacao.mappingRequest(request));
    });

    const requestOperacao: TestRequest = httpTestingController.expectOne({
      method: 'POST',
      url: URL_OPERACOES.Op6783648v2,
    });

    expect(requestOperacao).toBeTruthy();

    const respostaEsperada = new HttpResponse({
      status: 200,
      statusText: 'Ok',
      body: mockBandeiraRespostaVazia,
    });
    requestOperacao.event(respostaEsperada);
  });
});
