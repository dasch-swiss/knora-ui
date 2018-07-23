import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AppDemo } from '../../../app.config';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiServiceError, ApiServiceResult, SearchService } from '@knora/core';

export interface ListData {
    title: string;
    description: string;
    content: string;
    showAs: string;
    restrictedBy: string;
    searchMode?: string;
}

@Component({
    selector: 'app-search-result',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

    @Output() change: EventEmitter<any> = new EventEmitter<any>();

    partOf = AppDemo.searchModule;

    public selectedView: string = 'list';

    list: ListData = <ListData>{
        title: 'Results: ',
        description: 'Looked for: ',
        content: 'resource',
        showAs: this.selectedView,
        restrictedBy: ''
    };

    constructor(private _route: ActivatedRoute,
                private _searchService: SearchService) {
    }

    ngOnInit() {
        this._route.params.subscribe((params: Params) => {
            this.list.searchMode = params['mode'];
            this.list.restrictedBy = params['q'];
            console.log(params['q']);

            this._searchService.doFulltextSearch(this.list.restrictedBy)
                .subscribe(
                    (result: ApiServiceResult) => {
                        // converter is needed... s. example in resource.component in demo app
                        console.log(result);
                    },
                    (error: ApiServiceError) => {
                        console.error(error);
                    }
                );
        });
    }

}
