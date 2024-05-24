import { HTTP_INTERCEPTORS, HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SituacaoAtivoEnum } from 'src/app/models/enums/situacao-ativo';

import { CyborgInterceptorService } from '../../cyborg-interceptor.service';
import { Op7662244v1 } from './op7662244v1.service';
import { BandeirasService } from 'src/app/service/bandeiras/bandeiras.service';

import { Bandeira } from 'src/app/models/bandeira.model';

import { URL_OPERACOES } from '../../operacoes-const';
import { Op7662244v1Request } from './op7662244v1.request.interface';
import { Op7662244v1Response } from './op7662244v1.response.interface';

const bandeiraMock: Bandeira = {
  codigo: 1,
  nome: 'Teste',
  situacao: SituacaoAtivoEnum.ATIVO,
  codigoArquivo: 3,
};
const requestMock: Op7662244v1Request = {
  codigoBandeiraCartao: 1,
  nomeBandeiraCartao: 'Teste',
  indicadorEstadoBandeiraCartao: 'ATIVO',
  codigoArquivoBandeiraCartao: 3,
};

const responseMock: Op7662244v1Response = {
  codigoBandeiraCartao: 1,
};

describe('Op7662244v1- Deve Inserir bandeira : Testes com Interceptor', () => {
  let operacao: Op7662244v1;
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
    operacao = new Op7662244v1(URL_OPERACOES.Op7662244v1);
  });

  it('Deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('Deve realizar a chamada de inclusao de parametrizacao e ser interceptada, convertida e enviada ao Cyborg', () => {
    const request: HttpRequest<Bandeira> = new HttpRequest(
      'PUT',
      BandeirasService.URL_BANDEIRAS_ALTERAR_V1.replace(BandeirasService.PARAM_CODIGO, bandeiraMock.codigo?.toString() as string),
      bandeiraMock
    );

    service.alteraBandeira(bandeiraMock).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toEqual(operacao.mappingResponse(responseMock));
      expect(true).toEqual(operacao.validaURL(request));
      expect(requestMock).toEqual(operacao.mappingRequest(request));
    });
    const requestOperacao: TestRequest = httpTestingController.expectOne({
      method: 'POST',
      url: URL_OPERACOES.Op7662244v1,
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
