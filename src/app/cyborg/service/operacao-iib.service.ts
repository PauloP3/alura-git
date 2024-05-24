import { HttpRequest, HttpHandler, HttpEvent, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export default abstract class OperacaoIIB<OpRequest, OpResponse, Requisicao = unknown, Resposta = unknown> {
  constructor(private url: string) {}

  abstract validaURL(request: HttpRequest<Requisicao>): boolean;

  abstract mappingResponse(response: OpResponse): Resposta;

  abstract mappingRequest(request: HttpRequest<Requisicao>): OpRequest;

  executa(request: HttpRequest<Requisicao>, next: HttpHandler): Observable<HttpEvent<Resposta>> {
    const newRequest: HttpRequest<OpRequest> = request.clone({
      headers: request.headers,
      url: this.url,
      method: 'POST',
      body: this.mappingRequest(request),
      params: new HttpParams(),
    });
    return next.handle(newRequest).pipe(
      map((event: HttpEvent<OpResponse>) => {
        if (event instanceof HttpResponse && event.status === 200) {
          return event.clone({
            body: this.mappingResponse(event.body as OpResponse),
          });
        }
        return event;
      })
    ) as Observable<HttpEvent<Resposta>>;
  }

  protected extraiQueryParamsDaRequest(request: HttpRequest<unknown>): { key: string; value: string }[] {
    const partesUrlPorBarra: string[] = request.urlWithParams.split('/');
    const urlParams: string[] = partesUrlPorBarra[partesUrlPorBarra.length - 1].split('?');

    return (
      urlParams[1]?.split('&').map((queryParam) => ({
        key: queryParam.split('=')[0],
        value: queryParam.split('=')[1],
      })) ?? []
    );
  }

  protected obtemParametroNumerico(queryParams: { key: string; value: string }[], key: string): number {
    const valor: number = +(queryParams.find((queryParam) => queryParam.key === key)?.value ?? 0);

    return valor;
  }

  protected obtemParametro(queryParams: { key: string; value: string }[], key: string): string {
    const valor: string = queryParams.find((queryParam) => queryParam.key === key)?.value ?? '';
    return valor;
  }
}
