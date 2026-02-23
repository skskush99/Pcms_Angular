import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../auth.interceptor';
import { encodeDecodeInterceptor } from '../encode-decode.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DatePipe } from '@angular/common';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader , TRANSLATE_HTTP_LOADER_CONFIG } from '@ngx-translate/http-loader'
import { HttpClient } from '@angular/common/http';
import { NgSelectConfig } from '@ng-select/ng-select';


export function configureNgSelect() {
  return () => {
    // Patch the NgSelectComponent prototype
    import('@ng-select/ng-select').then((module) => {
      const originalNgOnInit = module.NgSelectComponent.prototype.ngOnInit;
      module.NgSelectComponent.prototype.ngOnInit = function() {
        this.appendTo = 'body';
        if (originalNgOnInit) {
          originalNgOnInit.call(this);
        }
      };
    });
  };
}

// ,
//     {
//       provide: APP_INITIALIZER,
//       useFactory: configureNgSelect,
//       multi: true
//     }


// encodeDecodeInterceptor

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes) 
    , provideHttpClient(
    withInterceptors([authInterceptor ] ,)
  ) , provideAnimations(), DatePipe , provideAnimationsAsync() ,
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: {
        prefix: './assets/i18n/',
        suffix: '.json'
      }
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (config: NgSelectConfig) => () => {
        config.appendTo = 'body';
      },
      deps: [NgSelectConfig],
      multi: true,
    },
  importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateHttpLoader,
          deps: [HttpClient]
        }
      })
    )]
};
