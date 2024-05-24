import { HttpRequest } from '@angular/common/http';

import OperacaoIIB from '../operacao-iib.service';
import { BandeirasService } from 'src/app/service/bandeiras/bandeiras.service';

import { Bandeira } from 'src/app/models/bandeira.model';

import { Op7662244v1Request } from './op7662244v1.request.interface';
import { Op7662244v1Response } from './op7662244v1.response.interface';

export class Op7662244v1 extends OperacaoIIB<Op7662244v1Request, Op7662244v1Response, Bandeira, number> {
  public validaURL(request: HttpRequest<Bandeira>): boolean {
    const url = BandeirasService.URL_BANDEIRAS_ALTERAR_V1.replace(
      BandeirasService.PARAM_CODIGO,
      request.body?.codigo?.toString() as string
    );
    return request.url === url && request.method === 'PUT';
  }

  mappingResponse(response: Op7662244v1Response): number {
    return response.codigoBandeiraCartao;
  }

  mappingRequest(request: HttpRequest<Bandeira>): Op7662244v1Request {
    return {
      codigoBandeiraCartao: request.body?.codigo as number,
      nomeBandeiraCartao: request.body?.nome as string,
      indicadorEstadoBandeiraCartao: request.body?.situacao as string,
      codigoArquivoBandeiraCartao: request.body?.codigoArquivo as number,
    };
  }
}
