import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBandeiraRetorno } from 'src/app/cyborg/service/op6783648v2/IBandeirasRetorno';
import { ILogBandeiraRetorno } from 'src/app/cyborg/service/op7659605v1/ILogBandeiraRetorno';
import { IIBDetalheLogRetorno } from 'src/app/cyborg/service/op7669211v1/IIBDetalheLogRetorno';
import { ILogBandeira } from 'src/app/models/ILogBandeira';
import { IPaginacaoLog } from 'src/app/models/IPaginacaoLog';
import { IUsuarioResponsavel } from 'src/app/models/IUsuarioResponsavel';

import { Bandeira } from 'src/app/models/bandeira.model';
import { FiltrosConsultarBandeiras } from 'src/app/models/filtros-consultar-bandeiras.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BandeirasService {
  static readonly PARAM_CODIGO: string = '{codigo}';
  static readonly URL_BANDEIRAS_V1: string = `${environment.API}/v1/bandeiras`;
  static readonly URL_BANDEIRAS_ALTERAR_V1: string = `${BandeirasService.URL_BANDEIRAS_V1}/${BandeirasService.PARAM_CODIGO}`;
  static readonly URL_BANDEIRA: string = `${environment.API}/v1/bandeiras/lista`;
  static readonly URL_BANDEIRA_HISTORICO: string = `${environment.API}/v1/bandeiras/historico`;
  static readonly URL_BANDEIRA_POR_CODIGO: string = `${environment.API}/v2/bandeiras/vizualizar`;
  static readonly URL_BANDEIRA_DETALHE_HISTORICO: string = `${environment.API}/v1/bandeiras/historico/detalhe`;
  static readonly URL_BANDEIRA_USUARIO: string = `${environment.API}/v1/bandeiras/usuario`;

  constructor(private http: HttpClient) {}

  public incluiBandeira(bandeira: Bandeira): Observable<number> {
    return this.http.post<number>(`${BandeirasService.URL_BANDEIRAS_V1}`, bandeira);
  }

  public alteraBandeira(bandeira: Bandeira): Observable<number> {
    return this.http.put<number>(
      `${BandeirasService.URL_BANDEIRAS_ALTERAR_V1.replace(BandeirasService.PARAM_CODIGO, bandeira.codigo?.toString() as string)}`,
      bandeira
    );
  }

  public consultaBandeiras(filtro: FiltrosConsultarBandeiras): Observable<IBandeiraRetorno> {
    const params: HttpParams = new HttpParams()
      .append('codigoBandeiraCartao', filtro.codigo as number)
      .append('nomeBandeiraCartao', filtro.nome as string)
      .append('indicadorEstadoBandeira', filtro.situacao as string)
      .append('codigoTipoOrdem', filtro.sortOrder as string)
      .append('nomeOrdemColuna', filtro.sortField as string)
      .append('numeroPaginaTamanho', filtro.pageSize as number)
      .append('numeroPaginaAtual', filtro.pageIndex as number);
    return this.http.get<IBandeiraRetorno>(`${BandeirasService.URL_BANDEIRA}`, { params });
  }

  public consultaLogBandeiras(filtro: IPaginacaoLog): Observable<ILogBandeiraRetorno> {
    const params: HttpParams = new HttpParams()
      .append('codigoBandeiraCartao', filtro.codigo)
      .append('codigoTipoOrdem', filtro.sortOrder)
      .append('nomeOrdemColuna', filtro.sortField)
      .append('numeroPaginaTamanho', filtro.pageSize)
      .append('numeroPaginaAtual', filtro.pageIndex);
    return this.http.get<ILogBandeiraRetorno>(`${BandeirasService.URL_BANDEIRA_HISTORICO}`, { params });
  }

  public consultaDetalhesDoLog(filtro: ILogBandeira): Observable<IIBDetalheLogRetorno> {
    const params: HttpParams = new HttpParams()
      .append('codigoBandeiraCartao', filtro.codigo)
      .append('dataAtualizacaoHistorico', filtro.dataHora);
    return this.http.get<IIBDetalheLogRetorno>(`${BandeirasService.URL_BANDEIRA_DETALHE_HISTORICO}`, { params });
  }

  public consultaNomeDoUsuario(chaves: string[]): Observable<IUsuarioResponsavel[]> {
    let params: HttpParams = new HttpParams();
    chaves.forEach((c) => (params = params.append('listaPesquisa', c)));
    params = params.append('quantidadeOcorrencia', chaves.length);

    return this.http.get<IUsuarioResponsavel[]>(`${BandeirasService.URL_BANDEIRA_USUARIO}`, { params });
  }
}
