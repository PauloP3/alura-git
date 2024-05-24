import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, ElementRef, NO_ERRORS_SCHEMA, QueryList } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BbDialogService, BbSelectFieldModule, BbTabComponent, BbTabGroupComponent, BbTabsModule, BbTextareaModule } from 'dls-angular';
import { GAWTemplateBaseModule } from 'dls-base-components-gaw';
import { of } from 'rxjs';

import { UsuarioService } from '../service/usuario/usuario.service';

import { BandeirasComponent } from './bandeiras.component';
import { ConsultarBandeirasComponent } from './consultar-bandeiras/consultar-bandeiras.component';
import { TabelaBandeirasComponent } from './consultar-bandeiras/tabela-bandeiras/tabela-bandeiras.component';
import { InserirBandeirasComponent } from './inserir-bandeiras/inserir-bandeiras.component';

import { Usuario } from '../models/usuario.model';
import { Bandeira } from './../models/bandeira.model';

import { ABA_TABS } from '../models/constants/aba-constants';

describe('BandeirasComponent', () => {
  let component: BandeirasComponent;
  let fixture: ComponentFixture<BandeirasComponent>;

  const mockBbTabConsultar = new BbTabComponent();
  const mockBbTabInserir = new BbTabComponent();
  const mockBbTabAlterar = new BbTabComponent();

  const mockBbTabGroup = new BbTabGroupComponent(new ElementRef<BbTabComponent[]>([mockBbTabConsultar, mockBbTabInserir]));

  mockBbTabConsultar.tabIndex = ABA_TABS.ABA_TAB_CONSULTAR;
  mockBbTabInserir.tabIndex = ABA_TABS.ABA_TAB_INSERIR;
  mockBbTabAlterar.tabIndex = ABA_TABS.ABA_TAB_ALTERAR;

  const tabsMock = Object.assign(new QueryList(), {
    _results: [mockBbTabConsultar, mockBbTabInserir],
  }) as QueryList<BbTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InserirBandeirasComponent, BbTabComponent, BbTabGroupComponent],
      imports: [
        GAWTemplateBaseModule,
        HttpClientTestingModule,
        BbTabsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        BbSelectFieldModule,
        BbTextareaModule,
      ],
      providers: [
        FormBuilder,
        BbDialogService,
        UsuarioService,
        ConsultarBandeirasComponent,
        TabelaBandeirasComponent,
        ChangeDetectorRef,
        {
          provide: UsuarioService,
          useValue: jasmine.createSpyObj('UsuarioService', [], {
            usuario: of(new Usuario(['pcbdrta1', 'pcbdrta2'])),
          }) as unknown,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandeirasComponent);
    component = fixture.componentInstance;
    mockBbTabGroup.tabs = tabsMock;
    component.tabs = tabsMock;
    component.tabGroup = mockBbTabGroup;
    component.abaAtual = mockBbTabConsultar;
    component.consultaComponent = TestBed.inject(ConsultarBandeirasComponent);
    component.consultaComponent.tabelaComponent = TestBed.inject(TabelaBandeirasComponent);
    component.abaAlterar = mockBbTabAlterar;
    component.abaInserir = mockBbTabInserir;
    component.abaConsultar = mockBbTabConsultar;
    fixture.detectChanges();
  });

  it('Deve criar', () => {
    spyOn(component, 'ngAfterViewInit').and.returnValue();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('Deve Excutar OnChange', () => {
    const consultar = TestBed.inject(ConsultarBandeirasComponent);
    const tabela = TestBed.inject(TabelaBandeirasComponent);
    consultar.tabelaComponent = tabela;
    component.consultaComponent = consultar;
    component.abaAlterar = mockBbTabAlterar;
    component.abaInserir = mockBbTabInserir;
    component.abaConsultar = mockBbTabConsultar;

    const consultarSpy = spyOn(consultar.tabelaComponent, 'carregaBandeiras');
    component.onChange(ABA_TABS.ABA_TAB_CONSULTAR);
    expect(component.abaAtual).toEqual(mockBbTabConsultar);
    expect(component.abaAtual).toEqual(mockBbTabConsultar);
    expect(consultarSpy).toHaveBeenCalled();

    component.onChange(ABA_TABS.ABA_TAB_INSERIR);
    expect(component.abaAtual).toEqual(mockBbTabInserir);

    component.onChange(ABA_TABS.ABA_TAB_ALTERAR);
    expect(component.abaAtual).toEqual(mockBbTabAlterar);
  });

  it('Deve Executar OnTrocaAba()', () => {
    const spy = spyOn(component, 'selecionaAba').and.returnValue();
    component.onTrocaAba({ aba: ABA_TABS.ABA_TAB_INSERIR, bandeira: new Bandeira() });
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(ABA_TABS.ABA_TAB_INSERIR);
  });

  it('Deve Selecionar Aba', () => {
    const bbTabGroupMock = jasmine.createSpyObj('BbTabGroupComponent', ['select']) as jasmine.SpyObj<BbTabGroupComponent>;
    const spyOnChange = spyOn(component, 'onChange');

    component.tabGroup = bbTabGroupMock;
    component.selecionaAba(ABA_TABS.ABA_TAB_INSERIR);
    fixture.detectChanges();
    expect(bbTabGroupMock.select).toHaveBeenCalled();
    expect(spyOnChange).toHaveBeenCalledOnceWith(ABA_TABS.ABA_TAB_INSERIR);
  });

  it('Deve desativar inserir ', () => {
    component.abaAtual = mockBbTabAlterar;
    component.abaAtual.tabIndex = component.ABA_TAB_ALTERAR;
    const desativado = component.desabilitaInserir();
    expect(desativado).toBeTrue();
  });

  it('Deve desativar consultar ', () => {
    component.abaAtual = mockBbTabAlterar;
    component.abaAtual.tabIndex = component.ABA_TAB_ALTERAR;
    const desativado = component.desabilitaConsultar();
    expect(desativado).toBeTrue();
  });
});
