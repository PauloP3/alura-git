import { TestBed } from '@angular/core/testing';
import { GAWHubClientService, IAmbiente } from 'gaw-ng-lib';
import { of } from 'rxjs';

import { UsuarioService } from './usuario.service';

import { Usuario } from 'src/app/models/usuario.model';

const mockAmbiente: IAmbiente = {
  localizacao: 'pt_BR',
  gatAtivo: false,
  codigoModoDeUso: 1,
  modosDeUso: [],
  ambienteExecucao: 'DESENVOLVIMENTO',
  funci: {
    acessos:
      'BB29#BB2A#V100#V101#V103#BB2C#BB2D#BB2E#BB2K#BB2L#BIC1#BIC6#HC11#NEG1#NEG2#NEG3#NEG4#NEG5#NEG6#NEG7#NEGI#NEGZ#OPR3#OPR4#PC45#PC46#PC47#PCC1#PTV1#PTV2#PTV3#PTV4#PTV5#PTV6#PTV7#PTV8#PTV9#PTVC#PTVD#PTVL#PTVM#PTVN#PTVP#PTVQ#PTVR#PTVS#PTVT#PTVV#PTVW#PTVX#PTVZ#RAO4#RC6A#RC70#RC71#RCA1#RCA2#RCA3#RCA4#RCA5#RCA6#RCA9#RCAB#RCAC#RCAD#RCAK#RCE1#REN5#TT05#pcbnon01#pcbnon02#pcbnon03#',
    chave: 'F1694892',
    codCargo: '12381',
    codDependencia: '9880',
    codDiretoria: '9880',
    codInstituicao: '1',
    grupamento: '5',
    nome: 'BRUNO SERGIO FAGUNDES OLIVEIRA',
    nomeReduzido: 'BRUNO SERGIO',
    pilar: '22',
    rf: '8',
    superEstadual: '0',
    timestampLogin: 1632921352285,
    tipoDependencia: '2',
    uf: '',
    foto: '',
    enderecoDependencia: {
      codigoMunicipioUor: 2000,
      nomeBairroUorBrasil: 'A NORTE',
      nomeLogradouroUorBrasil: 'SAUN QUADRA 5, BLOCO B, - TORRE SUL, 2º  ANDAR,',
      nomeMunicipioUor: 'BRASILIA',
      numeroCepUorBrasil: '70040-912',
      siglaUfUor: 'DF',
      textoComplementoLogradouroBrasil: 'ED. BANCO DO BRASIL, ASA NORTE-DF',
      textoReferenciaEnderecoUorBrasil: '',
      dependenciaAtendimento: false,
      codigoDependenciaUor: 9880,
      codigoNomeDependencia: '9880 DIMEP-MEIOS PAGAMEN.',
    },
  },
  ticketCNL: '005500142mMmugKfRJg3DESA00000000',
  gslAtivo: false,
  agenciaTMF: 9880,
  subAgenciaTMF: 0,
  infoTerminalDisponivel: true,
  dependenciaTMF: 29373,
};

const mockUsuario: Usuario = new Usuario(mockAmbiente.funci?.acessos.split('#') ?? [], mockAmbiente.funci);

describe('UsuarioService', () => {
  let service: UsuarioService;
  let spyGAWHubClientService: jasmine.SpyObj<GAWHubClientService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: GAWHubClientService,
          useValue: jasmine.createSpyObj('GAWHubClientService', ['getAmbiente$']) as unknown,
        },
      ],
    });
    spyGAWHubClientService = TestBed.inject(GAWHubClientService) as jasmine.SpyObj<GAWHubClientService>;
    spyGAWHubClientService.getAmbiente$.and.returnValue(of(mockAmbiente));

    service = TestBed.inject(UsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    service.usuario.subscribe((usuario) => {
      expect(usuario).toEqual(mockUsuario);
    });
  });
});
