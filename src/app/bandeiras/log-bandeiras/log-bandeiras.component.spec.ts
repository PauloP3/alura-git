import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BbPaginatorEvent, BbSort, BbViewportRulerAdapter } from 'dls-angular';
import { GAWTemplateBaseModule } from 'dls-base-components-gaw';
import { of } from 'rxjs';
import { ILogBandeiraRetorno } from 'src/app/cyborg/service/op7659605v1/ILogBandeiraRetorno';
import { ILogBandeira } from 'src/app/models/ILogBandeira';
import { IUsuarioResponsavel } from 'src/app/models/IUsuarioResponsavel';

import { BandeirasService } from 'src/app/service/bandeiras/bandeiras.service';

import { LogBandeirasComponent } from './log-bandeiras.component';

import { Bandeira } from 'src/app/models/bandeira.model';

@Injectable()
export class BbViewportRulerMockAdapter extends BbViewportRulerAdapter {
  override getViewportSize(): Readonly<{ width: number; height: number }> {
    return { width: 1600, height: 900 };
  }
}

describe('LogBandeirasComponent', () => {
  let component: LogBandeirasComponent;
  let fixture: ComponentFixture<LogBandeirasComponent>;
  let bandeiraService: BandeirasService;
  let router: Router;
  let route: ActivatedRoute;

  const mockLogBandeira: ILogBandeira = {
    codigo: 1,
    usuarioResponsavel: 'C1325000',
    dataHora: '2023-06-15T09:05:41.856828',
    tipoRegistro: 'ALTERACAO',
  };

  const mockLogBandeira2: ILogBandeira = {
    codigo: 1,
    usuarioResponsavel: 'C1325001',
    dataHora: '2023-06-15T09:05:41.856828',
    tipoRegistro: 'ALTERACAO',
  };

  const mockLogBandeiraRetorno: ILogBandeiraRetorno = {
    listaRetorno: [mockLogBandeira],
    quantidadeLogsBandeira: 10,
    quantidadeTotalRegistro: 15,
  };

  const mockBandeira: Bandeira = {
    codigo: 1,
  };

  const mockIUsuarioResponsavel: IUsuarioResponsavel[] = [
    {
      codigoFuncional: 'C1325000',
      nomeCompleto: 'Usuário Teste',
    },
  ];

  const mockIUsuarioResponsavelSemNome: IUsuarioResponsavel[] = [
    {
      codigoFuncional: 'C1325001',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GAWTemplateBaseModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [LogBandeirasComponent],
      providers: [
        {
          provide: BbViewportRulerAdapter,
          useClass: BbViewportRulerMockAdapter,
        },
        { provide: Window, useValue: window },
        BandeirasService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LogBandeirasComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    window.history.pushState(mockBandeira, '', '');
    fixture.detectChanges();

    bandeiraService = TestBed.inject(BandeirasService);
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should create window vazio', () => {
    component.bandeira = { codigo: 0 };
    window.history.pushState(undefined, '', '');
    component.ngOnInit();
    expect(component.bandeira.codigo).toEqual(0);
    expect(component).toBeTruthy();
  });

  it('deve ser executado listaLog', () => {
    spyOn(bandeiraService, 'consultaLogBandeiras').and.returnValue(of(mockLogBandeiraRetorno));

    component.listaLog();

    const totalRegistros: number = mockLogBandeiraRetorno.quantidadeTotalRegistro ? mockLogBandeiraRetorno.quantidadeTotalRegistro : 0;

    expect(component.logBandeira).toBeTruthy();
    expect(component.paginacao.totalRegistros).toEqual(totalRegistros);
  });

  it('deve ser executado onPageChange', () => {
    spyOn(bandeiraService, 'consultaLogBandeiras').and.returnValue(of(mockLogBandeiraRetorno));

    const bbPaginatorEvent: BbPaginatorEvent = {
      length: 1,
      pageIndex: 0,
      pageSize: 10,
      previousPageIndex: 0,
    };

    component.onPageChange(bbPaginatorEvent);

    const totalRegistros: number = mockLogBandeiraRetorno.quantidadeTotalRegistro ? mockLogBandeiraRetorno.quantidadeTotalRegistro : 0;

    expect(component.logBandeira).toBeTruthy();
    expect(component.paginacao.totalRegistros).toEqual(totalRegistros);
  });

  it('deve ser executado onSortChange', () => {
    const bbSorteEvent: BbSort = {
      active: '',
      direction: 'asc',
    };

    component.onSortChange(bbSorteEvent);

    expect(component.paginacao.sortOrder).toEqual('asc');
  });

  it('deve ser executado abreDetalhe', () => {
    const logBandeira = mockLogBandeira;

    spyOn(router, 'navigate');

    component.abreDetalhe(logBandeira);

    expect(router.navigate).toHaveBeenCalledWith(['../detalhar-log-bandeiras'], {
      state: logBandeira,
      relativeTo: route,
    });
  });

  it('deve ser executado fecharLog', () => {
    spyOn(router, 'navigate');

    component.fecharLog();

    expect(router.navigate).toHaveBeenCalledWith([''], {
      relativeTo: route,
    });
  });

  it('deve ser executado buscaNomesDosUsuarios', () => {
    spyOn(bandeiraService, 'consultaNomeDoUsuario').and.returnValue(of(mockIUsuarioResponsavel));

    component.buscaNomesDosUsuarios(['C1325000']);

    expect(component.chavesENomesDeUsuarios).toEqual(mockIUsuarioResponsavel);
  });

  it('deve ser executado juntaNomeEChaveNoUsuario', () => {
    component.logBandeira = [mockLogBandeira];
    component.juntaNomeEChaveNoUsuario(mockIUsuarioResponsavel);
    expect(component.logBandeira[0].usuarioResponsavel).toEqual('C1325000 - Usuário Teste');
  });

  it('deve ser executado juntaNomeEChaveNoUsuario sem nome', () => {
    component.logBandeira = [mockLogBandeira2];
    console.log('Bandeira', component.logBandeira);
    component.juntaNomeEChaveNoUsuario(mockIUsuarioResponsavelSemNome);
    expect(component.logBandeira[0].usuarioResponsavel).toEqual('C1325001 - Nome não cadastrado');
  });
});
