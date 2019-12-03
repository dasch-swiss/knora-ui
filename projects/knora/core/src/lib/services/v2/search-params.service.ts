import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


/**
 * @deprecated since v9.5.0
 * Represents the parameters of an extended search.
 */
export class ExtendedSearchParams {

    /**
     *
     * @param generateGravsearch a function that generates a Gravsearch query.
     *
     *                           The function takes the offset
     *                           as a parameter and returns a Gravsearch query string.
     *                           Returns false if not set correctly (init state).
     */
    constructor(public generateGravsearch: (offset: number) => string | boolean) {

    }

}

/**
 * @deprecated since v9.5.0
 * Request information about the future of this service on the repository `@knora/api` (github:dasch-swiss/knora-api-js-lib).
 */
@Injectable({
    providedIn: 'root'
})
/**
 * Temporarily stores the parameters of an extended search.
 */
export class SearchParamsService {

    private _currentSearchParams;

    constructor() {
        // init with a dummy function that returns false
        // if the application is reloaded, this will be returned
        this._currentSearchParams = new BehaviorSubject<ExtendedSearchParams>(new ExtendedSearchParams((offset: number) => false));
    }

    /**
     * @deprecated since v9.5.0
     *
     * Updates the parameters of an extended search.
     *
     * @param {ExtendedSearchParams} searchParams
     * @returns void
     */
    changeSearchParamsMsg(searchParams: ExtendedSearchParams): void {
        this._currentSearchParams.next(searchParams);
    }

    /**
     * @deprecated since v9.5.0
     *
     * Gets the search params of an extended search.
     *
     * @returns ExtendedSearchParams - search parameters
     */
    getSearchParams(): ExtendedSearchParams {
        return this._currentSearchParams.getValue();
    }

}
