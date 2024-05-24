import { Component } from '@angular/core';
import * as log from 'loglevel';

const TAG = 'AppComponent';

@Component({
  selector: 'pcb-app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor() {
    log.debug(TAG, 'Iniciando AppComponent');
  }
}
