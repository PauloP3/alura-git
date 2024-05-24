import { Bandeira } from 'src/app/models/bandeira.model';

export interface IBandeiraRetorno {
  listaRetorno: Bandeira[];
  quantidadeBandeiraCartao: number;
  quantidadeTotalRegistro: number;
}
