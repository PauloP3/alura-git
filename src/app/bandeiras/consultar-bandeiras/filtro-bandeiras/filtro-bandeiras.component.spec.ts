import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroBandeirasComponent } from './filtro-bandeiras.component';

describe('FiltroBandeirasComponent', () => {
  let component: FiltroBandeirasComponent;
  let fixture: ComponentFixture<FiltroBandeirasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FiltroBandeirasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltroBandeirasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve ser executado validaCodigoPacote', () => {
    component.filtros.codigo = 0;
    component.validaCodigo();

    expect(component.filtros.codigo).toBeUndefined();
  });

  it('deve ser executado consultaBandeiras', () => {
    component.consultaBandeiras();
    expect(component.filtros).toBeTruthy();
  });

  it('deve ser executado limparFiltros', () => {
    component.filtros.codigo = 0;
    component.limpaFiltros();
    expect(component.filtros.codigo).toBeUndefined();
  });
});
