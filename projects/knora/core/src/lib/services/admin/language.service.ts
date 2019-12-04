import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/**
 * @deprecated since v9.5.0
 * Request information about the future of this service on the repository `@knora/api` (github:dasch-swiss/knora-api-js-lib).
 */
@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private subject = new Subject<any>();

  /**
   * @deprecated since v9.5.0
   * @param lang
   */
  setLanguage(lang: string) {
    this.subject.next({ var: lang });
  }

  /**
   * @deprecated since v9.5.0
   */
  getLanguage(): Observable<any> {
    return this.subject.asObservable();
  }

}
