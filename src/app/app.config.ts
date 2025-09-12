import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LucideAngularModule, Home, List, ArrowDownToLine, ArrowUpToLine, Send, UserCog } from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    importProvidersFrom(LucideAngularModule.pick({ Home, List, ArrowDownToLine, ArrowUpToLine, Send, UserCog }))
  ]
};
