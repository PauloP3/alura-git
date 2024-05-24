import { HttpRequest, HttpUrlEncodingCodec } from '@angular/common/http';
import { SituacaoAtivoEnum } from 'src/app/models/enums/situacao-ativo';

import OperacaoIIB from '../operacao-iib.service';
import { BandeirasService } from 'src/app/service/bandeiras/bandeiras.service';

import { FiltrosConsultarBandeiras } from 'src/app/models/filtros-consultar-bandeiras.model';

import { IBandeiraRetorno } from './IBandeirasRetorno';
import { IIBArquivo, IIBBandeira } from './IIBBandeira';

export interface Op6783648v2Response {
  listaBandeiraCartao?: IIBBandeira[];
  quantidadeBandeiraCartao: number;
  quantidadeTotalRegistro: number;
}

export interface Op6783648v2Request {
  codigoBandeiraCartao?: string;
  nomeBandeiraCartao?: string;
  indicadorEstadoBandeira?: string | SituacaoAtivoEnum;
  codigoTipoOrdem?: string;
  nomeOrdemColuna?: string;
  numeroPaginaTamanho?: number;
  numeroPaginaAtual?: number;
}

const httpUrlEncodeCodec = new HttpUrlEncodingCodec();

export class Op6783648v2 extends OperacaoIIB<Op6783648v2Request, Op6783648v2Response, FiltrosConsultarBandeiras, IBandeiraRetorno> {
  public validaURL(request: HttpRequest<FiltrosConsultarBandeiras>): boolean {
    return request.url === BandeirasService.URL_BANDEIRA && request.method === 'GET';
  }

  mappingResponse(response: Op6783648v2Response): IBandeiraRetorno {
    return {
      listaRetorno: response.listaBandeiraCartao
        ? response.listaBandeiraCartao.map((item) => ({
            codigo: item.codigoBandeira,
            nome: item.nomeBandeira,
            situacao: item.indicadorEstadoBandeira,
            codigoArquivo: this.converteArquivo(item.listaArquivo ? item.listaArquivo : []),
          }))
        : [],
      quantidadeBandeiraCartao: response.quantidadeBandeiraCartao,
      quantidadeTotalRegistro: response.quantidadeTotalRegistro,
    };
  }

  private converteArquivo(arquivo: IIBArquivo[]): number {
    return arquivo[0] ? arquivo[0].codigoArquivo : 0;
  }

  mappingRequest(request: HttpRequest<FiltrosConsultarBandeiras>): Op6783648v2Request {
    const queryParams = this.extraiQueryParamsDaRequest(request);
    const codigoBandeiraCartao = httpUrlEncodeCodec.decodeValue(this.obtemParametro(queryParams, 'codigoBandeiraCartao'));
    const nomeBandeiraCartao = httpUrlEncodeCodec.decodeValue(this.obtemParametro(queryParams, 'nomeBandeiraCartao'));
    const indicadorEstadoBandeira = this.obtemParametro(queryParams, 'indicadorEstadoBandeira');
    const codigoTipoOrdem = this.obtemParametro(queryParams, 'codigoTipoOrdem');
    const nomeOrdemColuna = this.obtemParametro(queryParams, 'nomeOrdemColuna');
    const numeroPaginaTamanho = this.obtemParametroNumerico(queryParams, 'numeroPaginaTamanho');
    const numeroPaginaAtual = this.obtemParametroNumerico(queryParams, 'numeroPaginaAtual');
    return {
      codigoBandeiraCartao: codigoBandeiraCartao === 'undefined' || codigoBandeiraCartao === '' ? undefined : codigoBandeiraCartao,
      nomeBandeiraCartao: nomeBandeiraCartao === 'undefined' || nomeBandeiraCartao === '' ? undefined : nomeBandeiraCartao,
      indicadorEstadoBandeira:
        indicadorEstadoBandeira === 'undefined' || indicadorEstadoBandeira === '' ? undefined : indicadorEstadoBandeira,
      codigoTipoOrdem: codigoTipoOrdem === '' ? undefined : codigoTipoOrdem,
      nomeOrdemColuna: nomeOrdemColuna === '' ? undefined : nomeOrdemColuna,
      numeroPaginaTamanho: numeroPaginaTamanho < 10 ? 10 : numeroPaginaTamanho,
      numeroPaginaAtual: numeroPaginaAtual,
    };
  }
}
