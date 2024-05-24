import { HttpRequest } from '@angular/common/http';

import OperacaoIIB from '../operacao-iib.service';
import { BandeirasService } from 'src/app/service/bandeiras/bandeiras.service';

import { Bandeira } from 'src/app/models/bandeira.model';

import { Op7628203v2Request } from './op7628203v2.request.interface';
import { Op7628203v2Response } from './op7628203v2.response.interface';

export class Op7628203v2 extends OperacaoIIB<Op7628203v2Request, Op7628203v2Response, Bandeira, number> {
  public validaURL(request: HttpRequest<Bandeira>): boolean {
    return request.url === BandeirasService.URL_BANDEIRAS_V1 && request.method === 'POST';
  }

  mappingResponse(response: Op7628203v2Response): number {
    return response.codigoBandeiraCartao;
  }

  mappingRequest(request: HttpRequest<Bandeira>): Op7628203v2Request {
    return {
      nomeBandeiraCartao: request.body?.nome as string,
      indicadorEstadoBandeiraCartao: request.body?.situacao as string,
      codigoArquivoBandeiraCartao: request.body?.codigoArquivo as number,
      codigoBandeiraCartao: request.body?.codigo as number,
    };
  }
}
