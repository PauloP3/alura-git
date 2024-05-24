import { SituacaoAtivoEnum } from 'src/app/models/enums/situacao-ativo';

export interface IIBArquivo {
  codigoArquivo: number;
}

export interface IIBBandeira {
  codigoBandeira: number;
  nomeBandeira: string;
  indicadorEstadoBandeira: SituacaoAtivoEnum;
  listaArquivo?: IIBArquivo[];
}
