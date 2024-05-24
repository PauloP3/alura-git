import { HttpRequest, HttpUrlEncodingCodec } from '@angular/common/http';
import { IPaginacaoLog } from 'src/app/models/IPaginacaoLog';

import OperacaoIIB from '../operacao-iib.service';
import { BandeirasService } from 'src/app/service/bandeiras/bandeiras.service';

import { IBBLogBandeira } from './IIBLogBandeira';
import { ILogBandeiraRetorno } from './ILogBandeiraRetorno';

export interface Op7659605v1Response {
  listaHistoricoBandeira?: IBBLogBandeira[];
  quantidadeOcorrenciaListaHistoricoBandeira: number;
  quantidadeTotalRegistro: number;
}

export interface Op7659605v1Request {
  codigoBandeiraCartao?: string;
  codigoTipoOrdem?: string;
  nomeOrdemColuna?: string;
  numeroPaginaTamanho?: number;
  numeroPaginaAtual?: number;
}

const httpUrlEncodeCodec = new HttpUrlEncodingCodec();

export class Op7659605v1 extends OperacaoIIB<Op7659605v1Request, Op7659605v1Response, IPaginacaoLog, ILogBandeiraRetorno> {
  public validaURL(request: HttpRequest<IPaginacaoLog>): boolean {
    return request.url === BandeirasService.URL_BANDEIRA_HISTORICO && request.method === 'GET';
  }

  mappingResponse(response: Op7659605v1Response): ILogBandeiraRetorno {
    return {
      listaRetorno: response.listaHistoricoBandeira
        ? response.listaHistoricoBandeira.map((item) => ({
            codigo: item.codigoBandeiraCartao,
            usuarioResponsavel: item.codigoUsuarioResponsavelAtualizacao,
            dataHora: item.dataAtualizacaoHistorico,
            tipoRegistro: item.textoTipoAtualizacaoHistorico,
          }))
        : [],
      quantidadeLogsBandeira: response.quantidadeOcorrenciaListaHistoricoBandeira,
      quantidadeTotalRegistro: response.quantidadeTotalRegistro,
    };
  }

  mappingRequest(request: HttpRequest<IPaginacaoLog>): Op7659605v1Request {
    const queryParams = this.extraiQueryParamsDaRequest(request);
    const codigoBandeiraCartao = httpUrlEncodeCodec.decodeValue(this.obtemParametro(queryParams, 'codigoBandeiraCartao'));
    const codigoTipoOrdem = this.obtemParametro(queryParams, 'codigoTipoOrdem');
    const nomeOrdemColuna = this.obtemParametro(queryParams, 'nomeOrdemColuna');
    const numeroPaginaTamanho = this.obtemParametroNumerico(queryParams, 'numeroPaginaTamanho');
    const numeroPaginaAtual = this.obtemParametroNumerico(queryParams, 'numeroPaginaAtual');
    return {
      codigoBandeiraCartao: codigoBandeiraCartao === 'undefined' || codigoBandeiraCartao === '' ? undefined : codigoBandeiraCartao,
      codigoTipoOrdem: codigoTipoOrdem === '' ? undefined : codigoTipoOrdem,
      nomeOrdemColuna: nomeOrdemColuna === '' ? undefined : nomeOrdemColuna,
      numeroPaginaTamanho: numeroPaginaTamanho < 10 ? 10 : numeroPaginaTamanho,
      numeroPaginaAtual: numeroPaginaAtual,
    };
  }
}
