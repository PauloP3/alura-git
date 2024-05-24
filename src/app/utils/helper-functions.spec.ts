import { map } from 'rxjs';
import { convertToBase64, formataAcaoLog, formataSituacao } from 'src/app/utils/helper-functions';

import { AcaoLogEnum } from '../models/enums/acao-log.enum';
import { SituacaoAtivoEnum } from '../models/enums/situacao-ativo';

const fileMock: File = new File(['(⌐□_□)'], 'documento.png', { type: 'image/png' });

describe('helper-functions', () => {
  it('Deve converter File para base 64', () => {
    convertToBase64(fileMock).pipe(
      map((base64: string) => {
        expect(base64).toBeTruthy();
        return base64;
      })
    );
  });
});

it('deve formatar situacao', () => {
  expect(formataSituacao(SituacaoAtivoEnum.ATIVO)).toEqual('Ativo');
  expect(formataSituacao(SituacaoAtivoEnum.INATIVO)).toEqual('Inativo');
});

it('deve formatar acao', () => {
  expect(formataAcaoLog(AcaoLogEnum.ALTERACAO)).toEqual('Alteração');
  expect(formataAcaoLog(AcaoLogEnum.INSERCAO)).toEqual('Inclusão');
});
