import { Component, OnInit } from '@angular/core';
import { KuiView } from '../kui-view';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  ApiServiceError,
  ExtendedSearchParams,
  GravsearchGenerationService,
  KnoraConstants,
  OntologyCacheService,
  OntologyInformation,
  ReadResource,
  ReadResourcesSequence,
  SearchParamsService,
  SearchService
} from '@knora/core';

@Component({
  selector: 'kui-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent extends KuiView {

  KnoraConstants = KnoraConstants;

  offset: number = 0;
  gravsearchGenerator: ExtendedSearchParams;

  result: ReadResource[] = [];
  ontologyInfo: OntologyInformation;
  rerender: boolean = false;

  searchQuery: string;
  searchMode: string;

  isLoading = true;
  errorMessage: any = undefined;
  navigationSubscription: Subscription;

  constructor(
    protected _route: ActivatedRoute,
    protected _searchService: SearchService,
    protected _searchParamsService: SearchParamsService,
    protected _router: Router
  ) {
    super(_route, _searchService, _searchParamsService, _router);
  }
}
