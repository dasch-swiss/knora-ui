import { TestBed } from '@angular/core/testing';

import { ExtendedSearchParams, SearchParamsService } from './search-params.service';

describe('SearchParamsService', () => {
    let searchParamsService: SearchParamsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SearchParamsService
            ]
        });

        searchParamsService = TestBed.get(SearchParamsService);

    });

    it('should be created', () => {
        expect(searchParamsService).toBeDefined();
    });

    it('should return false when initialized', () => {
        const searchParams: ExtendedSearchParams = searchParamsService.getSearchParams();

        expect(searchParams.generateGravsearch(0)).toBeFalsy();
    });

    it('should set the parameters of an extended search', () => {
        const testMethod1 = (offset: number) => {
            return 'test1';
        };

        searchParamsService.changeSearchParamsMsg(new ExtendedSearchParams(testMethod1));

        const searchParams: ExtendedSearchParams = searchParamsService.getSearchParams();

        expect(searchParams.generateGravsearch(0)).toEqual('test1');

        // check if value is still present
        expect(searchParams.generateGravsearch(0)).toEqual('test1');

        const testMethod2 = (offset: number) => {
            return 'test2';
        };

        searchParamsService.changeSearchParamsMsg(new ExtendedSearchParams(testMethod2));

        const searchParams2: ExtendedSearchParams = searchParamsService.getSearchParams();

        expect(searchParams2.generateGravsearch(0)).toEqual('test2');

        // check if value is still present
        expect(searchParams2.generateGravsearch(0)).toEqual('test2');

    });

});
