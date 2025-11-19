import { EnvironmentProviders, isDevMode } from '@angular/core';

import { provideTransloco } from '@jsverse/transloco';

import { TranslocoHttpLoader } from './transloco-loader';

export function translocoLoaderFactory(): EnvironmentProviders[] {
  return provideTransloco({
    config: {
      defaultLang: 'fr',
      availableLangs: ['fr', 'en'],
      // Remove this option if your application doesn't support changing language in runtime.
      reRenderOnLangChange: true,
      prodMode: !isDevMode(),
    },
    loader: TranslocoHttpLoader,
  });
}
