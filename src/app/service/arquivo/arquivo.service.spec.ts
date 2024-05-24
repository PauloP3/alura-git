import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ArquivoService } from './arquivo.service';

import { Arquivo } from 'src/app/models/arquivo.model';

const arquivoMock: Arquivo = {
  nome: 'documento.png',
  content: new File(['(⌐□_□)'], 'documento.png', { type: 'image/png' }),
  descricao: 'descricao',
  codigoTipo: 12,
};

describe('ArquivoService', () => {
  let service: ArquivoService;
  let httpMock: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArquivoService, HttpClient],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ArquivoService);
    httpMock = TestBed.inject(HttpClient);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve excluir arquivo', () => {
    spyOn(httpMock, 'delete').and.returnValue(of());
    service.exclui(1).subscribe(() => {
      expect(httpMock.delete).toHaveBeenCalledWith(`${ArquivoService.URL_ARQUIVO}/1`);
    });
  });

  it('deve obter url download', () => {
    expect(service.obterUrlDownload(2)).toBe(`${ArquivoService.URL_ARQUIVO_DOWNLOAD}/2`);
  });

  it('deve chamar metadados', () => {
    spyOn(httpMock, 'get').and.returnValue(of([arquivoMock]));
    service.metadado(2).subscribe((rest) => {
      expect(rest.nome).toEqual(arquivoMock.nome);
    });
  });

  it('deve chamar upload', () => {
    spyOn(httpMock, 'post').and.returnValue(of(arquivoMock));
    service.upload(arquivoMock).subscribe((res) => {
      expect(res).toBe(arquivoMock);
    });
  });
});
