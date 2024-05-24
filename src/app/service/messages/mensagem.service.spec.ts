import { TestBed } from '@angular/core/testing';
import { GAWMensagensService } from 'gaw-ng-lib';

import { MensagemService } from './mensagem.service';

describe('MensagemService', () => {
  let mensagemService: MensagemService;
  let gawMensagensService: GAWMensagensService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MensagemService, GAWMensagensService],
    });
    mensagemService = TestBed.inject(MensagemService);
    gawMensagensService = TestBed.inject(GAWMensagensService);
  });

  it('Deve Ser Criado mensagem service', () => {
    expect(mensagemService).toBeTruthy();
  });

  it('Deve Ser Criado gaw service', () => {
    expect(gawMensagensService).toBeTruthy();
  });

  it('Deve Ser Criado mensagem sucesso', () => {
    spyOn(gawMensagensService, 'incluir').and.callThrough();

    mensagemService.mensagemSucesso('sucesso');
    expect(gawMensagensService.incluir).toHaveBeenCalled();
  });

  it('Deve limpar mensagens', () => {
    spyOn(gawMensagensService, 'limpar').and.callThrough();

    mensagemService.limpar();

    expect(gawMensagensService.limpar).toHaveBeenCalled();
  });
});
