import { Op5530760v4 } from './service/op5530760v4/op5530760v4.service';
import { Op6783648v2 } from './service/op6783648v2/op6783648v2.service';
import { Op7628203v2 } from './service/op7628203v2/op7628203v2.service';
import { Op7659605v1 } from './service/op7659605v1/op7659605v1.service';
import { Op7662244v1 } from './service/op7662244v1/op7662244v1.service';
import { Op7669211v1 } from './service/op7669211v1/op7669211v1.service';
import { Op7688496v1 } from './service/op7688496v1/op7688496v1.service';
import OperacaoIIB from './service/operacao-iib.service';

import { environment } from './../../environments/environment';

export const URL_OPERACOES: Record<string, string> = {
  Op7628203v2: `${environment.CYBORG}/op7628203v2-4.7.0-SNAPSHOT`,
  Op5530760v4: `${environment.CYBORG}/op5530760v3-4.7.4`,
  Op6783648v2: `${environment.CYBORG}/op6783648v2-4.7.1`,
  Op7659605v1: `${environment.CYBORG}/op7659605v1-4.7.0`,
  Op7662244v1: `${environment.CYBORG}/op7662244v1-4.7.0`,
  Op7669211v1: `${environment.CYBORG}/op7669211v1-4.7.0`,
  Op7688496v1: `${environment.CYBORG}/op7688496v1-4.7.0`,
};

export const OPERACOES: OperacaoIIB<unknown, unknown, unknown>[] = [
  new Op7628203v2(URL_OPERACOES.Op7628203v2),
  new Op5530760v4(URL_OPERACOES.Op5530760v4),
  new Op6783648v2(URL_OPERACOES.Op6783648v2),
  new Op7659605v1(URL_OPERACOES.Op7659605v1),
  new Op7662244v1(URL_OPERACOES.Op7662244v1),
  new Op7669211v1(URL_OPERACOES.Op7669211v1),
  new Op7688496v1(URL_OPERACOES.Op7688496v1),
];
