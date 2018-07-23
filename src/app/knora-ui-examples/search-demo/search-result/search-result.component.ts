import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AppDemo } from '../../../app.config';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiServiceError, ApiServiceResult, ConvertJSONLD, OntologyCacheService, OntologyInformation, ReadResource, ReadResourcesSequence, SearchService } from '@knora/core';

export interface ListData {
    title: string;
    description: string;
    content: string;
    showAs: string;
    restrictedBy: string;
    searchMode?: string;
}

declare let require: any;
const jsonld = require('jsonld');

@Component({
    selector: 'app-search-result',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

    @Output() change: EventEmitter<any> = new EventEmitter<any>();

    partOf = AppDemo.searchModule;
    resourceSearch: ReadResource; // the resource to be displayed
    ontologyInfo: OntologyInformation;
    public selectedView: string = 'list';

    list: ListData = <ListData>{
        title: 'Results: ',
        description: 'Looked for: ',
        content: 'resource',
        showAs: this.selectedView,
        restrictedBy: ''
    };

    constructor(
        private _route: ActivatedRoute,
        private _searchService: SearchService,
        private _cacheService: OntologyCacheService) {
    }

    ngOnInit() {
        this._route.params.subscribe((params: Params) => {
            this.list.searchMode = params['mode'];
            this.list.restrictedBy = params['q'];

            this.getResult(this.list);

        });
    }

    /**
     * Convert the jsonld body result
     * @param list
     */
    private getResult(list: ListData): any {

        this._searchService.doFulltextSearch(this.list.restrictedBy)
            .subscribe(
                (result: ApiServiceResult) => {
                    // the jsonld converter is needed... e.g. resource.component in demo app
                    const promises = jsonld.promises;
                    const promise = promises.compact(result.body, {});

                    promise.then((compacted) => {
                        const searchResource: ReadResourcesSequence = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(compacted);

                        if (searchResource.resources.length === 1) {
                            const resourceClassIris: string[] = ConvertJSONLD.getResourceClassesFromJsonLD(compacted);

                            this._cacheService.getResourceClassDefinitions(resourceClassIris).subscribe(
                                (resourceClassInfos: any) => {

                                    this.ontologyInfo = resourceClassInfos;

                                    // Exactly one resource was expected, but0resource(s) given
                                    this.resourceSearch = searchResource.resources[0];
                                    console.log('this.resourceSearch ', this.resourceSearch);

                                },
                                (err) => {
                                    console.error('cache request failed: ' + err);
                                });
                        } else {
                            console.log('Exactly one resource was expected, but' + searchResource.resources.length + 'resource(s) given');
                        }
                    }, function (err) {
                        console.error('JSONLD of full resource request could not be expanded:' + err);
                    }
                    );
                },
                (error: ApiServiceError) => {
                    console.error(error);
                }
            );
    }

}
