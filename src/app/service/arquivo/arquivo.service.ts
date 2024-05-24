import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Arquivo } from 'src/app/models/arquivo.model';

@Injectable({
  providedIn: 'root',
})
export class ArquivoService {
  static readonly URL_ARQUIVO = `${environment.PLT_ARQUIVO}/v1/arquivos`;
  static readonly URL_ARQUIVO_UPLOAD: string = `${environment.API}/v1/arquivos/upload`;
  static readonly URL_ARQUIVO_DOWNLOAD: string = `${environment.PLT_ARQUIVO}/v1/arquivos/downloads`;
  static readonly URL_ARQUIVO_METADADO: string = `${environment.PLT_ARQUIVO}/v1/arquivos/metadados`;

  constructor(private http: HttpClient) {}

  public exclui(id: number): Observable<void> {
    return this.http.delete<void>(`${ArquivoService.URL_ARQUIVO}/${id}`);
  }

  public upload(arquivo: Arquivo): Observable<Arquivo> {
    return this.http.post<Arquivo>(`${ArquivoService.URL_ARQUIVO_UPLOAD}`, arquivo);
  }

  public metadado(id: number): Observable<Arquivo> {
    return this.http.get<Arquivo[]>(`${ArquivoService.URL_ARQUIVO_METADADO}?ids=${id}`).pipe(
      map((retorno) => {
        return retorno.shift() as Arquivo;
      })
    );
  }

  public obterUrlDownload(id: number): string {
    return `${ArquivoService.URL_ARQUIVO_DOWNLOAD}/${id}`;
  }
}
