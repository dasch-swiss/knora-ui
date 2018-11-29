import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


/**
 * Represents teh parameters of an extended search.
 */
export class ExtendedSearchParams {

    /**
     *
     * @param generateGravsearch a function the generates Gravsearch.
     *                       The function is expected to take the offset
     *                       as a parameter and return a Gravsearch query string.
     */
    constructor(public generateGravsearch: (offset: number) => string) {

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
        // init with a dummy function
        this._currentSearchParams = new BehaviorSubject<ExtendedSearchParams>(new ExtendedSearchParams((offset: number) => 'empty'));
    }

    /**
     * Update the parameters of an extended search.
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
