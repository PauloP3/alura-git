import { SituacaoAtivoEnum } from './enums/situacao-ativo';

export class Bandeira {
  codigo?: number;
  nome?: string;
  situacao?: SituacaoAtivoEnum;
  codigoArquivo?: number;
}
