import { IFunci } from 'gaw-ng-lib';

export type Acessos = 'pcbdrta1' | 'pcbdrta2' | string;

export class Usuario {
  private _funcionario?: IFunci;
  private _acessos: Array<Acessos>;

  constructor(acessos: Array<Acessos>, funci?: IFunci) {
    this._funcionario = funci;
    this._acessos = acessos;
  }

  get funcionario(): IFunci | undefined {
    return this._funcionario;
  }

  get acessos(): Array<Acessos> {
    return this._acessos;
  }

  public podeConsultar(): boolean {
    return this._acessos.includes('pcbdrta1');
  }

  public podeAdministrar(): boolean {
    return this._acessos.includes('pcbdrta2');
  }
}
