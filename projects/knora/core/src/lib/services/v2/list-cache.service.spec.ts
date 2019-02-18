import { TestBed } from '@angular/core/testing';

import { ListCacheService, ListNodeV2 } from './list-cache.service';
import { KuiCoreModule } from '../../core.module';
import { ListService } from './list.service';
import { of } from 'rxjs';

describe('ListCacheService', () => {

    let spyListService;

    let listCacheService: ListCacheService;

    beforeEach(() => {

        spyListService = jasmine.createSpyObj('ListService', ['getList', 'getListNode']);

        TestBed.configureTestingModule({
            imports: [
                KuiCoreModule.forRoot({name: '', api: 'http://0.0.0.0:3333', app: '', media: ''})
            ],
            providers: [
                ListCacheService,
                { provide: ListService, useValue: spyListService }
            ]
        })
            .compileComponents();

        const listExpanded = require('../../test-data/list/treeList-expanded.json');

        spyListService.getList.and.returnValue(of(listExpanded));

        const listNodeExpanded = require('../../test-data/list/treelistNode-expanded.json');

        spyListService.getListNode.and.returnValue(of(listNodeExpanded));

        listCacheService = TestBed.get(ListCacheService);


    });

    it('should be created', () => {
        expect(listCacheService).toBeTruthy();
    });

    it('should get a list from Knora and cache it', () => {
        const expectedList = require('../../test-data/list/treeList.json');

        listCacheService.getList('http://rdfh.ch/lists/0001/treeList').subscribe(
            (list: ListNodeV2) => {

                expect(list.id).toEqual('http://rdfh.ch/lists/0001/treeList');
                expect(list.label).toEqual('Tree list root');
                expect(list.children.length).toEqual(3);

                expect(list.children[2].id).toEqual('http://rdfh.ch/lists/0001/treeList03');
                expect(list.children[2].children.length).toEqual(2);

                expect(list.children[2].children[0].id).toEqual('http://rdfh.ch/lists/0001/treeList10');
                expect(list.children[2].children[1].id).toEqual('http://rdfh.ch/lists/0001/treeList11');

                expect(spyListService.getList).toHaveBeenCalledTimes(1);
                expect(spyListService.getList).toHaveBeenCalledWith('http://rdfh.ch/lists/0001/treeList');

                // do the same request again (should read from cache)
                // NOTE: the requests have to be chained and cannot be executed concurrently
                listCacheService.getList('http://rdfh.ch/lists/0001/treeList').subscribe(
                    (list2) => {
                        expect(list2.id).toEqual('http://rdfh.ch/lists/0001/treeList');
                        expect(list2.label).toEqual('Tree list root');

                        expect(spyListService.getList).toHaveBeenCalledTimes(1);
                    }
                );
            }
        );


    });


});
