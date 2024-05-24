import { HTTP_INTERCEPTORS, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BandeirasService } from '../../../service/bandeiras/bandeiras.service';
import { CyborgInterceptorService } from '../../cyborg-interceptor.service';
import { Op7688496v1, Op7688496v1Request, Op7688496v1Response } from './op7688496v1.service';

import { IUsuarioResponsavel } from '../../../models/IUsuarioResponsavel';
import { URL_OPERACOES } from '../../operacoes-const';
import { IIBUsuarioResponsavel } from './IIBUsuarioResponsavel';

describe('Op7688496v1 - Deve retornar nome e codigo funcional do usuário : Testes com Interceptor', () => {
  let operacao: Op7688496v1;
  let service: BandeirasService;
  let httpTestingController: HttpTestingController;

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
    operacao = new Op7688496v1(URL_OPERACOES.Op7688496v1);
  });

  it('should be created', () => {
    expect(operacao).toBeTruthy();
  });

  const mockChaves: string[] = ['C1325000'];
  const mockIUsuarioResponsavel: IUsuarioResponsavel[] = [
    {
      codigoFuncional: 'C1325000',
      nomeCompleto: 'Usuário Teste',
    },
  ];

  const mockUsuarioResposta: Op7688496v1Response = {
    quantidadeOcorrencia: 1,
    listaRetorno: mockIUsuarioResponsavel,
  };

  const mockUsuarioRequisicao: Op7688496v1Request = {
    quantidadeOcorrencia: 1,
    listaPesquisa: [
      {
        codigoFuncional: 'C1325000',
      },
    ],
  };

  it('Deve realizar a chamada da consulta do usuário e ser interceptada, convertida e enviada ao Cyborg', () => {
    let params = new HttpParams();
    mockChaves.forEach((c) => (params = params.append('listaPesquisa', c)));
    params = params.append('quantidadeOcorrencia', mockChaves.length);

    const request: HttpRequest<IIBUsuarioResponsavel> = new HttpRequest('GET', BandeirasService.URL_BANDEIRA_USUARIO, { params });

    service.consultaNomeDoUsuario(mockChaves).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toEqual(operacao.mappingResponse(mockUsuarioResposta));
      expect(true).toEqual(operacao.validaURL(request));
      expect(mockUsuarioRequisicao).toEqual(operacao.mappingRequest(request));
    });

    const requestOperacao: TestRequest = httpTestingController.expectOne({
      method: 'POST',
      url: URL_OPERACOES.Op7688496v1,
    });

    expect(requestOperacao).toBeTruthy();

    const respostaEsperada = new HttpResponse({
      status: 200,
      statusText: 'Ok',
      body: mockUsuarioResposta,
    });
    requestOperacao.event(respostaEsperada);
  });
});
