import { SituacaoAtivoEnum } from './enums/situacao-ativo';

export class FiltrosConsultarBandeiras {
  codigo?: number;
  nome?: string;
  situacao?: SituacaoAtivoEnum;
  pageSize?: number;
  pageIndex?: number;
  sortField?: string;
  sortOrder?: string;
}
