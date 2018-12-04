import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


/**
 * Represents the parameters of an extended search.
 */
export class ExtendedSearchParams {

    /**
     *
     * @param generateGravsearch a function that generates a Gravsearch query.
     *
     *                           The function takes the offset
     *                           as a parameter and returns a Gravsearch query string.
     *                           Returns false if not set correctly.
     */
    constructor(public generateGravsearch: (offset: number) => string | boolean) {

    }

}

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
        this._currentSearchParams = new BehaviorSubject<ExtendedSearchParams>(new ExtendedSearchParams((offset: number) => false));
    }

    /**
     * Updates the parameters of an extended search.
     *
     * @param {ExtendedSearchParams} searchParams
     */
    changeSearchParamsMsg(searchParams: ExtendedSearchParams): void {
        this._currentSearchParams.next(searchParams);
    }

    /**
     * Gets the search params of an extended search.
     *
     * @returns {ExtendedSearchParams}
     */
    getSearchParams(): ExtendedSearchParams {
        return this._currentSearchParams.getValue();
    }

}
