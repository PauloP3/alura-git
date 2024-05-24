import { HttpRequest } from '@angular/common/http';

import { BandeirasService } from '../../../service/bandeiras/bandeiras.service';
import OperacaoIIB from '../operacao-iib.service';

import { IUsuarioResponsavel } from '../../../models/IUsuarioResponsavel';
import { IIBUsuarioResponsavel } from '../op7688496v1/IIBUsuarioResponsavel';

export interface Op7688496v1Response {
  quantidadeOcorrencia: number;
  listaRetorno: IUsuarioResponsavel[];
}

export interface Op7688496v1Request {
  quantidadeOcorrencia?: number;
  listaPesquisa?: IUsuarioResponsavel[];
}

export class Op7688496v1 extends OperacaoIIB<Op7688496v1Request, Op7688496v1Response, IIBUsuarioResponsavel, IUsuarioResponsavel[]> {
  validaURL(request: HttpRequest<IIBUsuarioResponsavel>): boolean {
    return request.url === BandeirasService.URL_BANDEIRA_USUARIO && request.method === 'GET';
  }

  mappingResponse(response: Op7688496v1Response): IUsuarioResponsavel[] {
    return response.listaRetorno;
  }

  mappingRequest(request: HttpRequest<IIBUsuarioResponsavel>): Op7688496v1Request {
    const queryParams = this.extraiQueryParamsDaRequest(request);
    const listaPesquisa: { codigoFuncional: string }[] = queryParams
      ?.filter((queryParam) => queryParam.key === 'listaPesquisa')
      ?.map((queryParam) => {
        return { codigoFuncional: queryParam.value };
      });
    const quantidadeOcorrencia = this.obtemParametroNumerico(queryParams, 'quantidadeOcorrencia');

    return {
      quantidadeOcorrencia: quantidadeOcorrencia,
      listaPesquisa: listaPesquisa as IUsuarioResponsavel[],
    };
  }
}
