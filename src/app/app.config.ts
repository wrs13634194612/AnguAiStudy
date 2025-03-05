import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideIndexedDb } from 'ngx-indexed-db';
import { DB_CONFIG } from './db.config';

import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';



export const appConfig: ApplicationConfig = {
  providers: [provideIndexedDb(DB_CONFIG),provideHttpClient(),provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),provideAnimations(), provideAnimationsAsync()]
};
