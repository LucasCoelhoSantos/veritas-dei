import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { AI_PROVIDER } from './application/ports/ai-provider.port';
import { environment } from '../environments/environment';
import { GeminiProvider } from './infrastructure/ai/gemini.provider';
import { OpenAIProvider } from './infrastructure/ai/openai.provider';
import { inject } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    {
      provide: AI_PROVIDER,
      useFactory: () => {
        const prov = environment.configuracao.provedorPadrao;
        return prov === 'chatgpt' ? inject(OpenAIProvider) : inject(GeminiProvider);
      }
    }
  ]
};
