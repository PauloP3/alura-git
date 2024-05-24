import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BbPaginatorEvent, BbSort, BbViewportRulerAdapter } from 'dls-angular';
import { GAWTemplateBaseModule } from 'dls-base-components-gaw';
import { of, throwError } from 'rxjs';
import { IBandeiraRetorno } from 'src/app/cyborg/service/op6783648v2/IBandeirasRetorno';
import { ABA_TABS } from 'src/app/models/constants/aba-constants';
import { MENSAGENS } from 'src/app/models/constants/mensagens-constants';
import { SituacaoAtivoEnum } from 'src/app/models/enums/situacao-ativo';
import { AbaBandeiraEmit } from 'src/app/models/interface/aba.bandeira.interface';

import { ArquivoService } from 'src/app/service/arquivo/arquivo.service';
import { BandeirasService } from 'src/app/service/bandeiras/bandeiras.service';
import { ErrorMensagem, MensagemService } from 'src/app/service/messages/mensagem.service';
import { UsuarioService } from 'src/app/service/usuario/usuario.service';

import { ConsultarBandeirasComponent } from '../consultar-bandeiras.component';
import { FiltroBandeirasComponent } from '../filtro-bandeiras/filtro-bandeiras.component';
import { TabelaBandeirasComponent } from './tabela-bandeiras.component';

import { Bandeira } from 'src/app/models/bandeira.model';
import { Usuario } from 'src/app/models/usuario.model';

@Injectable()
export class BbViewportRulerMockAdapter extends BbViewportRulerAdapter {
  override getViewportSize(): Readonly<{ width: number; height: number }> {
    return { width: 1600, height: 900 };
  }
}

describe('TabelaBandeirasComponent', () => {
  let component: TabelaBandeirasComponent;
  let fixture: ComponentFixture<TabelaBandeirasComponent>;
  let bandeiraService: BandeirasService;
  let arquivoService: ArquivoService;
  let mensagemService: MensagemService;
  let mensagemLimparSpy: jasmine.Spy;
  let router: Router;
  let route: ActivatedRoute;

  const mockBandeira: Bandeira = {
    codigo: 1,
    nome: 'Teste',
    situacao: SituacaoAtivoEnum.ATIVO,
    codigoArquivo: 3,
  };

  const mockIBandeiraRetorno: IBandeiraRetorno = {
    listaRetorno: [mockBandeira],
    quantidadeBandeiraCartao: 10,
    quantidadeTotalRegistro: 100,
  };

  const erroMock: ErrorMensagem = {
    status: 400,
    statusText: 'Bed Request',
    error: {
      messages: [
        {
          text: MENSAGENS.MENSAGEM_ERROR_AO_CONSULTAR,
        },
      ],
    },
  };

  const mockAbaBandeiraEmit: AbaBandeiraEmit = { aba: ABA_TABS.ABA_TAB_ALTERAR, bandeira: mockBandeira };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabelaBandeirasComponent, ConsultarBandeirasComponent, FiltroBandeirasComponent],
      imports: [GAWTemplateBaseModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: BbViewportRulerAdapter,
          useClass: BbViewportRulerMockAdapter,
        },
        {
          provide: UsuarioService,
          useValue: jasmine.createSpyObj('UsuarioService', [], {
            usuario: of(new Usuario(['pcbdrta1', 'pcbdrta2'])),
          }) as unknown,
        },
        MensagemService,
        BandeirasService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TabelaBandeirasComponent);
    component = fixture.componentInstance;
    mensagemService = TestBed.inject(MensagemService);
    mensagemLimparSpy = spyOn(mensagemService, 'limpar');
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();

    bandeiraService = TestBed.inject(BandeirasService);
    arquivoService = TestBed.inject(ArquivoService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve ser executado ngOnChanges filtro', () => {
    const changes: SimpleChanges = {
      filtro: { currentValue: 'novoFiltro', previousValue: 'filtroAnterior', isFirstChange: () => false, firstChange: false },
    };

    component.ngOnChanges(changes);
    expect(mensagemLimparSpy).toHaveBeenCalled();
  });

  it('deve ser executado carregaBandeiras', () => {
    spyOn(bandeiraService, 'consultaBandeiras').and.returnValue(of(mockIBandeiraRetorno));

    component.carregaBandeiras();

    const totalRegistros: number = mockIBandeiraRetorno.quantidadeTotalRegistro ? mockIBandeiraRetorno.quantidadeTotalRegistro : 0;

    expect(component.bandeiras).toBeTruthy();
    expect(component.totalRegistros).toEqual(totalRegistros);
  });

  it('deve ser executado carregaBandeiras e retornar error', () => {
    spyOn(bandeiraService, 'consultaBandeiras').and.returnValue(throwError(() => erroMock));
    const mesagemSpy = spyOn(mensagemService, 'mensagemErro');
    component.carregaBandeiras();
    expect(mesagemSpy).toHaveBeenCalledWith(MENSAGENS.MENSAGEM_ERROR_AO_CONSULTAR);
  });

  it('deve ser executado onPageChange', () => {
    spyOn(bandeiraService, 'consultaBandeiras').and.returnValue(of(mockIBandeiraRetorno));

    const bbPaginatorEvent: BbPaginatorEvent = {
      length: 1,
      pageIndex: 0,
      pageSize: 10,
      previousPageIndex: 0,
    };

    component.onPageChange(bbPaginatorEvent);

    const totalRegistros: number = mockIBandeiraRetorno.quantidadeTotalRegistro ? mockIBandeiraRetorno.quantidadeTotalRegistro : 0;

    expect(component.bandeiras).toBeTruthy();
    expect(component.totalRegistros).toEqual(totalRegistros);
  });

  it('deve ser executado onSortChange', () => {
    const bbSorteEvent: BbSort = {
      active: '',
      direction: 'asc',
    };

    component.onSortChange(bbSorteEvent);

    expect(component.filtro.sortOrder).toEqual('asc');
  });

  it('deve formatar situacao', () => {
    expect(component.formataSituacao(SituacaoAtivoEnum.ATIVO)).toEqual('Ativo');
    expect(component.formataSituacao(SituacaoAtivoEnum.INATIVO)).toEqual('Inativo');
  });

  it('Deve obter url', () => {
    const url = component.obtemUrlImagemBandeira(11);
    const lista = spyOn(arquivoService, 'obterUrlDownload').and.returnValue(
      '/pcb-embossing-arquivo-plt-api/v3/api/v1/arquivos/downloads/11'
    );
    expect(url).toEqual('/pcb-embossing-arquivo-plt-api/v3/api/v1/arquivos/downloads/11');
    expect(lista).toBeDefined();
  });

  it('deve ser executado abreLog', () => {
    const bandeira = mockBandeira;

    spyOn(router, 'navigate');

    component.abreLog(bandeira);

    expect(router.navigate).toHaveBeenCalledWith(['../log-bandeiras'], {
      state: bandeira,
      relativeTo: route,
    });
  });

  it('deve abrir Alterar', () => {
    const spy = spyOn(component, 'trocaAba');
    component.abrirAlterar(mockBandeira);
    expect(spy).toHaveBeenCalledWith(mockAbaBandeiraEmit);
  });

  it('deve trocarAba', () => {
    const spy = spyOn(component.emitAba, 'emit');
    component.trocaAba(mockAbaBandeiraEmit);
    expect(spy).toHaveBeenCalledWith(mockAbaBandeiraEmit);
  });
});
