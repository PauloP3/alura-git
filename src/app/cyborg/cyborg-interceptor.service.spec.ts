import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CyborgInterceptorService } from './cyborg-interceptor.service';

@Injectable()
class TestService {
  constructor(private readonly http: HttpClient) {}

  dumbGet() {
    return this.http.get('http://fakeurl.com');
  }
}

describe('Testes cyborg interceptor', () => {
  let httpTestingController: HttpTestingController;
  let service: TestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CyborgInterceptorService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: CyborgInterceptorService,
          multi: true,
        },
        TestService,
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TestService);
  });

  it('Não Deve interceptar operação desconhecida', () => {
    service.dumbGet().subscribe();

    const requestOperacao: TestRequest = httpTestingController.expectOne({
      method: 'GET',
    });

    expect(requestOperacao).toBeTruthy();
  });
});
