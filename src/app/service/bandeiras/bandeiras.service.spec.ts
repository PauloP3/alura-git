import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { IBandeiraRetorno } from 'src/app/cyborg/service/op6783648v2/IBandeirasRetorno';
import { ILogBandeiraRetorno } from 'src/app/cyborg/service/op7659605v1/ILogBandeiraRetorno';
import { IIBDetalheLogRetorno } from 'src/app/cyborg/service/op7669211v1/IIBDetalheLogRetorno';
import { SituacaoAtivoEnum } from 'src/app/models/enums/situacao-ativo';
import { ILogBandeira } from 'src/app/models/ILogBandeira';
import { IPaginacaoLog } from 'src/app/models/IPaginacaoLog';
import { IUsuarioResponsavel } from 'src/app/models/IUsuarioResponsavel';

import { BandeirasService } from './bandeiras.service';

import { Bandeira } from 'src/app/models/bandeira.model';
import { FiltrosConsultarBandeiras } from 'src/app/models/filtros-consultar-bandeiras.model';

const mockBandeira: Bandeira = {
  nome: 'Teste',
  situacao: SituacaoAtivoEnum.ATIVO,
  codigoArquivo: 3,
};

const mockFiltro: FiltrosConsultarBandeiras = {
  codigo: 1,
  nome: 'Teste',
  situacao: SituacaoAtivoEnum.ATIVO,
  pageSize: 10,
  pageIndex: 1,
  sortField: 'Codigo',
  sortOrder: '-1',
};

const mockIBandeiraRetorno: IBandeiraRetorno = {
  listaRetorno: [mockBandeira],
  quantidadeBandeiraCartao: 10,
  quantidadeTotalRegistro: 100,
};

const mockLogBandeira: ILogBandeira = {
  codigo: 2,
  usuarioResponsavel: 'C1325000 - Teste Testando',
  dataHora: '2023-06-15T09:05:41.856828',
  tipoRegistro: 'ALTERACAO',
};

const mockLogBandeiraRetorno: ILogBandeiraRetorno = {
  listaRetorno: [mockLogBandeira],
  quantidadeLogsBandeira: 10,
  quantidadeTotalRegistro: 15,
};

const mockPaginacaoLog: IPaginacaoLog = {
  codigo: 3,
  pageIndex: 0,
  totalRegistros: 15,
  pageSize: 10,
  sortField: 'codigo',
  sortOrder: 'asc',
};

const mockDetalheLogRetorno: IIBDetalheLogRetorno = {
  codigo: 1,
  nomeBandeira: 'Teste visa',
  situacao: 'INATIVO',
  codigoArquivo: 4,
  nomeAlterado: 0,
  situacaoAlterada: 13,
  arquivoAlterado: 0,
};

const mockChaves: string[] = ['C1325000'];

const mockIUsuarioResponsavel: IUsuarioResponsavel[] = [
  {
    codigoFuncional: 'C1325000',
    nomeCompleto: 'Usuário Teste',
  },
];

describe('BandeirasService', () => {
  let httpClient: HttpClient;
  let service: BandeirasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BandeirasService, HttpClient],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(BandeirasService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('Deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('Deve retornar incluiBandeira', (done: DoneFn) => {
    spyOn(httpClient, 'post').and.returnValue(of(1));

    service.incluiBandeira(mockBandeira).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toEqual(1);
      done();
    });
  });

  it('Deve retornar bandeiras', (done: DoneFn) => {
    spyOn(httpClient, 'get').and.returnValue(of(mockIBandeiraRetorno));

    service.consultaBandeiras(mockFiltro).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toEqual(mockIBandeiraRetorno);
      done();
    });
  });

  it('Deve retornar log de bandeiras', (done: DoneFn) => {
    spyOn(httpClient, 'get').and.returnValue(of(mockLogBandeiraRetorno));

    service.consultaLogBandeiras(mockPaginacaoLog).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toEqual(mockLogBandeiraRetorno);
      done();
    });
  });

  it('Deve retornar detalhes do log', (done: DoneFn) => {
    spyOn(httpClient, 'get').and.returnValue(of(mockDetalheLogRetorno));

    service.consultaDetalhesDoLog(mockLogBandeira).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toEqual(mockDetalheLogRetorno);
      done();
    });
  });

  it('Deve retornar alterarBandeira', (done: DoneFn) => {
    spyOn(httpClient, 'put').and.returnValue(of(1));
    const requestBody = mockBandeira;
    requestBody.codigo = 1;
    service.alteraBandeira(requestBody).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toEqual(1);
      done();
    });
  });

  it('Deve retornar nome e codigo funcional do usuário', (done: DoneFn) => {
    spyOn(httpClient, 'get').and.returnValue(of(mockIUsuarioResponsavel));

    service.consultaNomeDoUsuario(mockChaves).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toEqual(mockIUsuarioResponsavel);
      done();
    });
  });
});
