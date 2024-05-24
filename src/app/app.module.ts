// Dependências Angular
import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { APP_INITIALIZER, NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Dependências GAW
import {
  BbLayoutModule,
  BbThemeModule,
  BbButtonModule,
  BbCardModule,
  BbLinkNavModule,
  BbIconModule,
  BbTabsModule,
  BbBreadcrumbsModule,
  BbTagModule,
  BbTextFieldModule,
  BbTableModule,
  BbPaginatorModule,
  BbDialogModule,
  BbErrorModule,
  BbProgressBarModule,
  BbSearchFieldModule,
  BbSelectFieldModule,
  BbSpinnerModule,
  BbTextChipModule,
  BbTooltipModule,
  BbDateFieldModule,
  BbInlineMessageModule,
  BbFilterModule,
  BbFileUploadModule,
  BbRadioButtonModule,
} from 'dls-angular';
import { GAWPaginaNaoEncontradaModule, GAWTemplateBaseModule } from 'dls-base-components-gaw';
import { GAWHttpInterceptor, GAWHubClientService, GAWPipesModule, IOpenAjaxHubClient } from 'gaw-ng-lib';
import * as log from 'loglevel';

// Dependências internas da aplicação

import { AppRoutingModule } from './app-routing.module';
import { CyborgInterceptorModule } from './cyborg/cyborg-interceptor.module';

import { AppComponent } from './app.component';
import { BandeirasComponent } from './bandeiras/bandeiras.component';
import { ConsultarBandeirasComponent } from './bandeiras/consultar-bandeiras/consultar-bandeiras.component';
import { FiltroBandeirasComponent } from './bandeiras/consultar-bandeiras/filtro-bandeiras/filtro-bandeiras.component';
import { TabelaBandeirasComponent } from './bandeiras/consultar-bandeiras/tabela-bandeiras/tabela-bandeiras.component';
import { InserirArquivosComponent } from './bandeiras/inserir-bandeiras/inserir-arquivos/inserir-arquivos.component';
import { InserirBandeirasComponent } from './bandeiras/inserir-bandeiras/inserir-bandeiras.component';
import { DetalharLogBandeirasComponent } from './bandeiras/log-bandeiras/detalhar-log-bandeiras/detalhar-log-bandeiras.component';
import { LogBandeirasComponent } from './bandeiras/log-bandeiras/log-bandeiras.component';

// Dependências dls-angular

registerLocaleData(localePt);
@NgModule({
  declarations: [
    AppComponent,
    BandeirasComponent,
    InserirBandeirasComponent,
    InserirArquivosComponent,
    ConsultarBandeirasComponent,
    FiltroBandeirasComponent,
    TabelaBandeirasComponent,
    LogBandeirasComponent,
    DetalharLogBandeirasComponent,
  ],
  imports: [
    // Angular
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // GAW
    GAWTemplateBaseModule,
    GAWPaginaNaoEncontradaModule,
    GAWPipesModule,

    // DLS-ANGULAR
    BbThemeModule.forRoot({ name: 'corporativo' }),
    BbDialogModule.forRoot(),
    BbLayoutModule,
    BbButtonModule,
    BbCardModule,
    BbErrorModule,
    BbSearchFieldModule,
    BbSelectFieldModule,
    BbTabsModule,
    BbTagModule,
    BbTextChipModule,
    BbProgressBarModule,
    BbPaginatorModule,
    BbSpinnerModule,
    BbTableModule,
    BbTextFieldModule,
    BbTooltipModule,
    BbLinkNavModule,
    BbIconModule,
    BbBreadcrumbsModule,
    BbDateFieldModule,
    BbInlineMessageModule,
    BbFilterModule,
    BbFileUploadModule,
    BbRadioButtonModule,
    // CYBORG
    CyborgInterceptorModule,
  ],
  providers: [
    // Efetua a conexão com o OpenAjaxHub durante a inicialização da aplicação

    {
      provide: APP_INITIALIZER,
      // eslint-disable-next-line @typescript-eslint/unbound-method, no-use-before-define
      useFactory: AppModule.initializeApp,
      deps: [GAWHubClientService],
      multi: true,
    },

    // Provê tratamentos genéricos de erros como por exemplo falha no login
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GAWHttpInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'pt' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  public static initializeApp(gawHubClientService: GAWHubClientService): () => Promise<IOpenAjaxHubClient | undefined> {
    return () =>
      // A promessa deve sempre ser resolvida, caso contrário, aplicação não é inicializada
      new Promise((resolve) =>
        gawHubClientService.init().subscribe({
          next: (hubClient) => resolve(hubClient),
          error: (err) => {
            log.error(`Erro ao inicializar o Hub Clent Service: ${String(err)}`);
            resolve(undefined);
          },
        })
      );
  }
}
