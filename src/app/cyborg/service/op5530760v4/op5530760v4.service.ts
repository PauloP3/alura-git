import { HttpRequest } from '@angular/common/http';

import OperacaoIIB from '../operacao-iib.service';
import { ArquivoService } from 'src/app/service/arquivo/arquivo.service';

import { Arquivo } from 'src/app/models/arquivo.model';

export interface Op5530760v4Response {
  codigoArquivoEmbossamento: number;
  nomeArquivoEmbossamento: string;
  codigoTipoArquivoEmbossamento: number;
  textoDescricaoArquivoEmbossamento: string;
}

export interface Op5530760v4Request {
  nomeArquivoEmbossamento: string;
  blobBinarioArquivoEmbossamento: string;
  codigoTipoArquivoEmbossamento: number;
  textoDescricaoArquivoEmbossamento: string;
  quantidadeDescricaoArquivoEmbossamento: number;
  quantidadeTamanhoBlobBinarioArquivoEmbossamento: number;
}

export class Op5530760v4 extends OperacaoIIB<Op5530760v4Request, Op5530760v4Response, Arquivo, Arquivo> {
  public validaURL(request: HttpRequest<Arquivo>): boolean {
    return request.url === ArquivoService.URL_ARQUIVO_UPLOAD && request.method === 'POST';
  }

  mappingResponse(response: Op5530760v4Response): Arquivo {
    return {
      id: response.codigoArquivoEmbossamento,
      nome: response.nomeArquivoEmbossamento,
      codigoTipo: response.codigoTipoArquivoEmbossamento,
      descricao: response.textoDescricaoArquivoEmbossamento,
    };
  }

  mappingRequest(request: HttpRequest<Arquivo>): Op5530760v4Request {
    return {
      nomeArquivoEmbossamento: request.body?.nome as string,
      blobBinarioArquivoEmbossamento: request.body?.content as string,
      textoDescricaoArquivoEmbossamento: request.body?.descricao as string,
      codigoTipoArquivoEmbossamento: request.body?.codigoTipo as number,
      quantidadeDescricaoArquivoEmbossamento: request.body?.descricao?.length as number,
      quantidadeTamanhoBlobBinarioArquivoEmbossamento: request.body?.content?.toString().length as number,
    };
  }
}
