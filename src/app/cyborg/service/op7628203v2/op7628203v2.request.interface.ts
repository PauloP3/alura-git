import { SituacaoAtivoEnum } from 'src/app/models/enums/situacao-ativo';

export interface Op7628203v2Request {
  nomeBandeiraCartao: string;
  indicadorEstadoBandeiraCartao: string | SituacaoAtivoEnum;
  codigoArquivoBandeiraCartao: number;
  codigoBandeiraCartao: number;
}
