import { from, Observable } from 'rxjs';

import { AcaoLogEnum, listAcaoLogEnum } from '../models/enums/acao-log.enum';
import { listSituacaoAtivoEnum, SituacaoAtivoEnum } from '../models/enums/situacao-ativo';

export function convertToBase64(file: File): Observable<string> {
  const promise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => resolve(btoa(reader.result as string));
    reader.onerror = (error) => reject(error);
  });

  return from(promise);
}

export function formataAcaoLog(acaoLog: AcaoLogEnum | string): string {
  const listaAcaoLog = listAcaoLogEnum.filter((s) => s.value === acaoLog);
  let retorno = '';
  listaAcaoLog.forEach((acao) => {
    retorno = acao.label;
  });

  return retorno;
}

export function formataSituacao(situacao: SituacaoAtivoEnum | string): string {
  const listaSituacao = listSituacaoAtivoEnum.filter((s) => s.value === situacao);
  let retorno = '';
  listaSituacao.forEach((sit) => {
    retorno = sit.label;
  });

  return retorno;
}
