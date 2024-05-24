import { SituacaoAtivoEnum } from 'src/app/models/enums/situacao-ativo';

export interface IIBDetalheLogRetorno {
  codigo: number;
  nomeBandeira: string;
  situacao: SituacaoAtivoEnum | string;
  codigoArquivo: number;
  nomeAlterado: number;
  situacaoAlterada: number;
  arquivoAlterado: number;
}
