import { TestBed } from '@angular/core/testing';
import { KnoraApiConfig, KnoraApiConnection } from '@knora/api';
import { of } from 'rxjs';

import { KnoraApiConfigToken, KnoraApiConnectionToken, KuiCoreModule } from '../../core.module';

import { ListCacheService, ListNodeV2 } from './list-cache.service';
import { ListService } from './list.service';

describe('ListCacheService', () => {

    let spyListService;

    let listCacheService: ListCacheService;

    beforeEach(() => {

        spyListService = jasmine.createSpyObj('ListService', ['getList', 'getListNode']);

        TestBed.configureTestingModule({
            imports: [
                KuiCoreModule.forRoot({
                    knora: {
                        apiProtocol: 'http',
                        apiHost: '0.0.0.0',
                        apiPort: 3333,
                        apiUrl: '',
                        apiPath: '',
                        jsonWebToken: '',
                        logErrors: true
                    },
                    app: {
                        name: 'Knora-UI-APP',
                        url: 'localhost:4200'
                    }
                })
            ],
            providers: [
                ListCacheService,
                { provide: ListService, useValue: spyListService },
                {
                    provide: KnoraApiConfigToken,
                    useValue: KnoraApiConfig
                },
                {
                    provide: KnoraApiConnectionToken,
                    useValue: KnoraApiConnection
                }
            ]
        })
            .compileComponents();

        const listExpanded = require('../../test-data/list/treeList-expanded.json');

        spyListService.getList.and.returnValue(of(listExpanded));

        const listNodeExpanded = require('../../test-data/list/treeListNode-expanded.json');

        spyListService.getListNode.and.returnValue(of(listNodeExpanded));

        listCacheService = TestBed.get(ListCacheService);


    });

    it('should be created', () => {
        expect(listCacheService).toBeTruthy();
    });

    it('should get a list from Knora and cache it', () => {

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

    it('should get a list node and cache it', () => {

        listCacheService.getListNode('http://rdfh.ch/lists/0001/treeList11').subscribe(
            (listNode: ListNodeV2) => {

                expect(listNode.id).toEqual('http://rdfh.ch/lists/0001/treeList11');
                expect(listNode.label).toEqual('Tree list node 11');
                expect(listNode.position).toEqual(1);
                expect(listNode.hasRootNode).toEqual('http://rdfh.ch/lists/0001/treeList');

                expect(spyListService.getListNode).toHaveBeenCalledTimes(1);
                expect(spyListService.getListNode).toHaveBeenCalledWith('http://rdfh.ch/lists/0001/treeList11');

                expect(spyListService.getList).toHaveBeenCalledTimes(1);
                expect(spyListService.getList).toHaveBeenCalledWith('http://rdfh.ch/lists/0001/treeList');

                // do the same request again (should read from cache)
                // NOTE: the requests have to be chained and cannot be executed concurrently
                listCacheService.getListNode('http://rdfh.ch/lists/0001/treeList11').subscribe(
                    (list2) => {

                        expect(spyListService.getListNode).toHaveBeenCalledTimes(1);
                        expect(spyListService.getList).toHaveBeenCalledTimes(1);
                    }
                );


            }
        );


    });


});
