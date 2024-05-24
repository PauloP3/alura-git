import { HttpRequest, HttpUrlEncodingCodec } from '@angular/common/http';
import { ILogBandeira } from 'src/app/models/ILogBandeira';

import OperacaoIIB from '../operacao-iib.service';
import { BandeirasService } from 'src/app/service/bandeiras/bandeiras.service';

import { IIBDetalheLog } from './IIBDetalheLog';
import { IIBDetalheLogRetorno } from './IIBDetalheLogRetorno';

export interface Op7669211v1Response {
  codigoBandeiraCartao: number;
  nomeBandeiraCartao: string;
  codigoArquivoEmbossamento: number;
  indicadorEstadoBandeira: string;
  indicadorComparativoHistorico?: IIBDetalheLog;
}

export interface Op7669211v1Request {
  codigoBandeiraCartao?: string;
  dataAtualizacaoHistorico?: string;
}

const httpUrlEncodeCodec = new HttpUrlEncodingCodec();

export class Op7669211v1 extends OperacaoIIB<Op7669211v1Request, Op7669211v1Response, ILogBandeira, IIBDetalheLogRetorno> {
  validaURL(request: HttpRequest<ILogBandeira>): boolean {
    return request.url === BandeirasService.URL_BANDEIRA_DETALHE_HISTORICO && request.method === 'GET';
  }

  mappingResponse(response: Op7669211v1Response): IIBDetalheLogRetorno {
    return {
      codigo: response.codigoBandeiraCartao,
      nomeBandeira: response.nomeBandeiraCartao,
      situacao: response.indicadorEstadoBandeira,
      codigoArquivo: response.codigoArquivoEmbossamento,
      nomeAlterado: response.indicadorComparativoHistorico?.nomeBandeira ?? 0,
      situacaoAlterada: response.indicadorComparativoHistorico?.indicadorEstadoBandeira ?? 0,
      arquivoAlterado: response.indicadorComparativoHistorico?.codigoArquivo ?? 0,
    };
  }

  mappingRequest(request: HttpRequest<ILogBandeira>): Op7669211v1Request {
    const queryParams = this.extraiQueryParamsDaRequest(request);
    const codigoBandeiraCartao = httpUrlEncodeCodec.decodeValue(this.obtemParametro(queryParams, 'codigoBandeiraCartao'));
    const dataAtualizacaoHistorico = this.obtemParametro(queryParams, 'dataAtualizacaoHistorico');
    return {
      codigoBandeiraCartao: codigoBandeiraCartao === 'undefined' || codigoBandeiraCartao === '' ? undefined : codigoBandeiraCartao,
      dataAtualizacaoHistorico: dataAtualizacaoHistorico === '' ? undefined : dataAtualizacaoHistorico,
    };
  }
}
