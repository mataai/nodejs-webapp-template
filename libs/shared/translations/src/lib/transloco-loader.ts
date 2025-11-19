import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Translation, TranslocoLoader } from '@jsverse/transloco';

import { environment } from '@webapp-template/shared-environments';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  public getTranslation(lang: string): Observable<Translation> {
    return this.http.get<Translation>(
      `${environment.baseUrl}/assets/i18n/${lang}.json`,
    );
  }
}
