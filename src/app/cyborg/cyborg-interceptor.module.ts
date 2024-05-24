import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { CyborgInterceptorService } from './cyborg-interceptor.service';

@NgModule({
  providers: [
    CyborgInterceptorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CyborgInterceptorService,
      multi: true,
    },
  ],
})
export class CyborgInterceptorModule {}
