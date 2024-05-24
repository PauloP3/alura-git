import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarBandeirasComponent } from './consultar-bandeiras.component';

import { FiltrosConsultarBandeiras } from 'src/app/models/filtros-consultar-bandeiras.model';

describe('ConsultarBandeirasComponent', () => {
  let component: ConsultarBandeirasComponent;
  let fixture: ComponentFixture<ConsultarBandeirasComponent>;

  const mockFiltro: FiltrosConsultarBandeiras = {
    pageSize: 10,
    pageIndex: 1,
    sortField: 'codigo',
    sortOrder: '0',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultarBandeirasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultarBandeirasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve executar onFilterEmitter', () => {
    component.onFilterEmitter(mockFiltro);
    expect(sessionStorage.getItem('filtros')).toEqual(JSON.stringify(mockFiltro));
  });
});
