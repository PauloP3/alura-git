import { SituacaoAtivoEnum } from 'src/app/models/enums/situacao-ativo';

export interface Op7662244v1Request {
  codigoBandeiraCartao: number;
  nomeBandeiraCartao: string;
  indicadorEstadoBandeiraCartao: string | SituacaoAtivoEnum;
  codigoArquivoBandeiraCartao: number;
}
