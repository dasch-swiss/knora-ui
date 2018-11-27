import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


/**
 * Represents teh parameters of an extended search.
 */
export class ExtendedSearchParams {

    /**
     *
     * @param generateGravsearch a function the generates KnarQL.
     *                       The function is expected to take the offset
     *                       as a parameter and return a KnarQL query string.
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

    // init with a dummy function
    private searchParamsMessage = new BehaviorSubject<ExtendedSearchParams>(new ExtendedSearchParams((offset: number) => ''));
    currentSearchParams = this.searchParamsMessage.asObservable();

    constructor() {
    }

    /**
     * Update the parameters of an extended seacrh.
     *
     * @param {ExtendedSearchParams} searchParams
     */
    changeSearchParamsMsg(searchParams: ExtendedSearchParams): void {
        this.searchParamsMessage.next(searchParams);
    }

}
