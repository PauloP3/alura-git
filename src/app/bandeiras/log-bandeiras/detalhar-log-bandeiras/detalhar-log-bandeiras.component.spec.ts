import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BbViewportRulerAdapter } from 'dls-angular';
import { GAWTemplateBaseModule } from 'dls-base-components-gaw';
import { of } from 'rxjs';
import { IIBDetalheLogRetorno } from 'src/app/cyborg/service/op7669211v1/IIBDetalheLogRetorno';
import { SituacaoAtivoEnum } from 'src/app/models/enums/situacao-ativo';
import { ILogBandeira } from 'src/app/models/ILogBandeira';

import { ArquivoService } from 'src/app/service/arquivo/arquivo.service';
import { BandeirasService } from 'src/app/service/bandeiras/bandeiras.service';

import { DetalharLogBandeirasComponent } from './detalhar-log-bandeiras.component';

import { Bandeira } from 'src/app/models/bandeira.model';

@Injectable()
export class BbViewportRulerMockAdapter extends BbViewportRulerAdapter {
  override getViewportSize(): Readonly<{ width: number; height: number }> {
    return { width: 1600, height: 900 };
  }
}

describe('DetalharLogBandeirasComponent', () => {
  let component: DetalharLogBandeirasComponent;
  let fixture: ComponentFixture<DetalharLogBandeirasComponent>;
  let router: Router;
  let route: ActivatedRoute;
  let bandeiraService: BandeirasService;
  let arquivoService: ArquivoService;

  const mockLogBandeira: ILogBandeira = {
    codigo: 1,
    usuarioResponsavel: 'C1325000 - Teste Testando',
    dataHora: '2023-06-15T09:05:41.856828',
    tipoRegistro: 'ALTERACAO',
  };

  const mockBandeira: Bandeira = {
    codigo: 3,
    nome: 'MasterCard',
    situacao: SituacaoAtivoEnum.ATIVO,
    codigoArquivo: 5,
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GAWTemplateBaseModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [DetalharLogBandeirasComponent],
      providers: [
        {
          provide: BbViewportRulerAdapter,
          useClass: BbViewportRulerMockAdapter,
        },
        { provide: Window, useValue: window },
        DatePipe,
        BandeirasService,
        ArquivoService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalharLogBandeirasComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    window.history.pushState(mockLogBandeira, '', '');
    arquivoService = TestBed.inject(ArquivoService);
    bandeiraService = TestBed.inject(BandeirasService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create window vazio', () => {
    component.logBandeira = { codigo: 0, usuarioResponsavel: '', dataHora: '', tipoRegistro: '' };
    window.history.pushState(undefined, '', '');
    component.ngOnInit();
    expect(component.logBandeira.codigo).toEqual(0);
    expect(component).toBeTruthy();
  });

  it('deve ser executado buscaDetalhes', () => {
    spyOn(bandeiraService, 'consultaDetalhesDoLog').and.returnValue(of(mockDetalheLogRetorno));
    component.buscaDetalhes();
    expect(component.detalhesDoLog).toBeTruthy();
    expect(component.bandeira.codigo).toEqual(1);
  });

  it('deve ser executado formataCamposAlterados', () => {
    component.detalhesDoLog = mockDetalheLogRetorno;
    component.formataCamposAlterados();

    expect(component.camposAlterados.situacao).toBeFalse();
  });

  it('Deve obter url', () => {
    const url = component.obtemUrlImagemBandeira(1);
    const lista = spyOn(arquivoService, 'obterUrlDownload').and.returnValue(
      '/pcb-embossing-arquivo-plt-api/v3/api/v1/arquivos/downloads/1'
    );
    expect(url).toEqual('/pcb-embossing-arquivo-plt-api/v3/api/v1/arquivos/downloads/1');
    expect(lista).toBeDefined();
  });

  it('deve ser executado fecharDetalhe', () => {
    component.bandeira = mockBandeira;

    spyOn(router, 'navigate');

    component.fecharDetalhe();

    expect(router.navigate).toHaveBeenCalledWith(['../log-bandeiras'], {
      state: component.bandeira,
      relativeTo: route,
    });
  });
});
