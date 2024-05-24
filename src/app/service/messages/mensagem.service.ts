import { Injectable } from '@angular/core';
import { GAWMensagensService } from 'gaw-ng-lib';

export interface ErrorMensagem {
  status: number;
  statusText: string;
  error: {
    messages: [
      {
        text: string;
      }
    ];
  };
}
@Injectable({
  providedIn: 'root',
})
export class MensagemService {
  constructor(private gawMensagensService: GAWMensagensService) {}

  mensagemSucesso(mensagem: string): void {
    this.enviarMensagem(mensagem, 'SUCCESS');
  }

  mensagemErro(mensagem: string): void {
    this.enviarMensagem(mensagem, 'ERROR');
  }

  private enviarMensagem(mensagem: string, tipo: 'SUCCESS' | 'WARN' | 'ERROR'): void {
    if (mensagem) {
      this.gawMensagensService.incluir({
        type: tipo,
        text: mensagem,
      });
    }
  }

  limpar() {
    this.gawMensagensService.limpar();
  }
}
