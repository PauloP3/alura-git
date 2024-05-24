import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { OPERACOES } from './operacoes-const';

@Injectable()
export class CyborgInterceptorService implements HttpInterceptor {
  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    for (const operacao of OPERACOES) {
      if (operacao.validaURL(request)) {
        return operacao.executa(request, next);
      }
    }
    return next.handle(request);
  }
}
