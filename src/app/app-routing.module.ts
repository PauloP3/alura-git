import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { GAWPaginaNaoEncontradaComponent } from 'dls-base-components-gaw';

import { BandeirasComponent } from './bandeiras/bandeiras.component';
import { InserirArquivosComponent } from './bandeiras/inserir-bandeiras/inserir-arquivos/inserir-arquivos.component';
import { DetalharLogBandeirasComponent } from './bandeiras/log-bandeiras/detalhar-log-bandeiras/detalhar-log-bandeiras.component';
import { LogBandeirasComponent } from './bandeiras/log-bandeiras/log-bandeiras.component';

const routes: Routes = [
  {
    path: '',
    component: BandeirasComponent,
  },
  {
    path: '/arquivo',
    component: InserirArquivosComponent,
  },
  {
    path: 'log-bandeiras',
    component: LogBandeirasComponent,
  },
  {
    path: 'detalhar-log-bandeiras',
    component: DetalharLogBandeirasComponent,
  },
  {
    // Dá match com url vazia e rpctoken que é adicionada automaticamente ao abrir em iframe do GAW - Defeito 1322617
    matcher: gawFallbackMatcher,
    redirectTo: '/',
    pathMatch: 'full',
  },
  { path: '**', component: GAWPaginaNaoEncontradaComponent },
];

function gawFallbackMatcher(url: UrlSegment[]): { consumed: UrlSegment[] } | null {
  const isPathEmptyOrRPCToken = url.length === 0 || (url.length === 1 && url[0].path === 'rpctoken');

  return isPathEmptyOrRPCToken ? { consumed: url } : null;
}

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
