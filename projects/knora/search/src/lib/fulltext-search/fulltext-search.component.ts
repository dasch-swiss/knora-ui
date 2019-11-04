import { ConnectionPositionPair, Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { Router } from '@angular/router';
import { ApiResponseData, ApiResponseError, KnoraApiConnection, ProjectResponse, ProjectsResponse, ReadProject } from '@knora/api';
import { KnoraApiConnectionToken, KnoraConstants } from '@knora/core';

export interface PrevSearchItem {
    projectIri?: string;
    projectLabel?: string;
    query: string;
}

/**
 *
 */
@Component({
    selector: 'kui-fulltext-search',
    templateUrl: './fulltext-search.component.html',
    styleUrls: ['./fulltext-search.component.scss']
})
export class FulltextSearchComponent implements OnInit {

    /**
     *
     * @param  {string} route Route to navigate after search.
     * This route path should contain a component for search results.
     */
    @Input() route: string = '/search';

    /**
     *
     * @param  {boolean} [projectfilter] If true it shows the selection
     * of projects to filter by one of them
     */
    @Input() projectfilter?: boolean = false;

    /**
     *
     * @param  {string} [filterbyproject] If the full-text search should be
     * filtered by one project, you can define it with project iri.
     */
    @Input() filterbyproject?: string;
    @Input() show: boolean;
    @Output() showState = new EventEmitter();

    @ViewChild('fulltextSearchPanel', { static: false }) searchPanel: ElementRef;
    @ViewChild('fulltextSearchInput', { static: false }) searchInput: ElementRef;
    @ViewChild('fulltextSearchMenu', { static: false }) searchMenu: TemplateRef<any>;

    @ViewChild('btnToSelectProject', { static: false }) selectProject: MatMenuTrigger;

    // search query
    searchQuery: string;

    // previous search = full-text search history
    prevSearch: PrevSearchItem[] = JSON.parse(localStorage.getItem('prevSearch'));

    // list of projects, in case of filterproject is true
    projects: ReadProject[];

    // selected project, in case of filterbyproject and/or projectfilter is true
    project: ReadProject;
    defaultProjectLabel: string = 'All projects';
    projectLabel: string = this.defaultProjectLabel;
    projectIri: string;

    // in case of an (api) error
    error: any;

    // is search panel focused?
    searchPanelFocus: boolean = false;

    // overlay reference
    overlayRef: OverlayRef;

    // do not show the following projects: default system projects from knora
    doNotDisplay: string[] = [
        KnoraConstants.SystemProjectIRI,
        KnoraConstants.DefaultSharedOntologyIRI
    ];

    constructor(
        @Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection,
        private _overlay: Overlay,
        private _router: Router,
        private _viewContainerRef: ViewContainerRef
    ) { }

    ngOnInit() {

        // this.setFocus();

        if (this.filterbyproject) {
            this.getProject(this.filterbyproject);
        }

        if (this.projectfilter) {
            this.getAllProjects();

            if (localStorage.getItem('currentProject') !== null) {
                this.setProject(
                    JSON.parse(localStorage.getItem('currentProject'))
                );
            }
        }
    }

    openPanelWithBackdrop() {
        const config = new OverlayConfig({
            hasBackdrop: true,
            backdropClass: 'cdk-overlay-transparent-backdrop',
            // backdropClass: 'cdk-overlay-dark-backdrop',
            positionStrategy: this.getOverlayPosition(),
            scrollStrategy: this._overlay.scrollStrategies.block()
        });

        this.overlayRef = this._overlay.create(config);
        this.overlayRef.attach(new TemplatePortal(this.searchMenu, this._viewContainerRef));
        this.overlayRef.backdropClick().subscribe(() => {
            this.searchPanelFocus = false;
            this.overlayRef.detach();
        });
    }

    getOverlayPosition(): PositionStrategy {
        const positions = [
            new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }),
            new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' })
        ];

        const overlayPosition = this._overlay.position().flexibleConnectedTo(this.searchPanel).withPositions(positions).withLockedPosition(false);

        return overlayPosition;
    }

    getAllProjects(): void {
        this.knoraApiConnection.admin.projectsEndpoint.getProjects().subscribe(
            (response: ApiResponseData<ProjectsResponse>) => {
                this.projects = response.body.projects;
                // this.loadSystem = false;
                if (localStorage.getItem('currentProject') !== null) {
                    this.project = JSON.parse(
                        localStorage.getItem('currentProject')
                    );
                }
            },
            (error: ApiResponseError) => {
                console.error(error);
                this.error = error;
            }
        );
    }

    getProject(id: string): void {
        this.knoraApiConnection.admin.projectsEndpoint.getProjectByIri(id).subscribe(
            (project: ApiResponseData<ProjectResponse>) => {
                this.setProject(project.body.project);
            },
            (error: ApiResponseError) => {
                console.error(error);
            }
        );
    }

    // set current project and switch focus to input field
    setProject(project?: ReadProject): void {
        if (!project) {
            // set default project: all
            this.projectLabel = this.defaultProjectLabel;
            this.projectIri = undefined;
            localStorage.removeItem('currentProject');
        } else {
            // set current project shortname and id
            this.projectLabel = project.shortname;
            this.projectIri = project.id;
            localStorage.setItem('currentProject', JSON.stringify(project));
        }
    }

    doSearch(): void {
        if (this.searchQuery !== undefined && this.searchQuery !== null) {
            if (this.projectIri !== undefined) {
                this._router.navigate([
                    this.route +
                    '/fulltext/' +
                    this.searchQuery +
                    '/' +
                    encodeURIComponent(this.projectIri)
                ]);
            } else {
                this._router.navigate([
                    this.route + '/fulltext/' + this.searchQuery
                ]);
            }
            // push the search query into the local storage prevSearch array (previous search)
            // to have a list of recent search requests
            let existingPrevSearch: PrevSearchItem[] = JSON.parse(
                localStorage.getItem('prevSearch')
            );
            if (existingPrevSearch === null) {
                existingPrevSearch = [];
            }
            let i: number = 0;
            for (const entry of existingPrevSearch) {
                // remove entry, if exists already
                if (this.searchQuery === entry.query && this.projectIri === entry.projectIri) {
                    existingPrevSearch.splice(i, 1);
                }
                i++;
            }

            // A search value is expected to have at least length of 3
            if (this.searchQuery.length > 2) {
                let currentQuery: PrevSearchItem = {
                    query: this.searchQuery
                };

                if (this.projectIri) {
                    currentQuery = {
                        projectIri: this.projectIri,
                        projectLabel: this.projectLabel,
                        query: this.searchQuery
                    };
                }

                existingPrevSearch.push(currentQuery);

                localStorage.setItem(
                    'prevSearch',
                    JSON.stringify(existingPrevSearch)
                );
            }
        }
        this.resetSearch();
        this.overlayRef.detach();

        this.show = false;
        this.showState.emit(this.show);
    }

    resetSearch(): void {
        this.searchPanelFocus = false;
        this.searchInput.nativeElement.blur();
        this.overlayRef.detach();
    }

    setFocus(): void {
        this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
        this.searchPanelFocus = true;
        this.openPanelWithBackdrop();
    }

    doPrevSearch(prevSearch: PrevSearchItem): void {
        this.searchQuery = prevSearch.query;

        if (prevSearch.projectIri !== undefined) {
            this.projectIri = prevSearch.projectIri;
            this.projectLabel = prevSearch.projectLabel;
            this._router.navigate([this.route + '/fulltext/' + this.searchQuery + '/' + encodeURIComponent(prevSearch.projectIri)]);
        } else {
            this.projectIri = undefined;
            this.projectLabel = this.defaultProjectLabel;
            this._router.navigate([this.route + '/fulltext/' + this.searchQuery]);
        }

        this.resetSearch();
        this.overlayRef.detach();
    }

    resetPrevSearch(prevSearch?: PrevSearchItem): void {
        if (prevSearch) {
            // delete only this item with the name ...
            const i: number = this.prevSearch.indexOf(prevSearch);
            this.prevSearch.splice(i, 1);
            localStorage.setItem('prevSearch', JSON.stringify(this.prevSearch));
        } else {
            // delete the whole "previous search" array
            localStorage.removeItem('prevSearch');
        }
        this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
    }

    changeFocus() {
        this.selectProject.closeMenu();
        this.searchInput.nativeElement.focus();
        this.setFocus();
    }


}
