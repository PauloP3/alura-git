import { Injectable } from '@angular/core';
import { GAWHubClientService, IAmbiente } from 'gaw-ng-lib';
import { Observable, ReplaySubject, Subject } from 'rxjs';

import { Usuario } from 'src/app/models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly _usuario: Subject<Usuario>;

  public constructor(private readonly gawHubClientService: GAWHubClientService) {
    this._usuario = new ReplaySubject<Usuario>();

    this.gawHubClientService.getAmbiente$().subscribe((amb: IAmbiente) => {
      let acessos: Array<string> = [];
      if (amb.funci) {
        acessos = amb.funci.acessos.split('#');
      }

      this._usuario.next(new Usuario(acessos, amb.funci));
    });
  }

  public get usuario(): Observable<Usuario> {
    return this._usuario.asObservable();
  }
}
