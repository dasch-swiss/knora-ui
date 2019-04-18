import {
    animate,
    state,
    style,
    transition,
    trigger
} from '@angular/animations';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceError, Project, ProjectsService } from '@knora/core';
import { MatMenuTrigger } from '@angular/material';

export interface PrevSearchItem {
    projectIri?: string;
    projectLabel?: string;
    query: string;
}

/**
 * Full-text search performs queries including one or more terms or phrases and returns data that
 match search conditions. The asterisk * can be used as a wildcard symbol.
 */
@Component({
    selector: 'kui-fulltext-search',
    templateUrl: './fulltext-search.component.html',
    styleUrls: ['./fulltext-search.component.scss'],
    animations: [
        trigger('fulltextSearchMenu', [
            state('inactive', style({ display: 'none' })),
            state('active', style({ display: 'block' })),
            transition('inactive => active', animate('100ms ease-in')),
            transition('active => inactive', animate('100ms ease-out'))
        ])
    ]
})
export class FulltextSearchComponent implements OnInit {
    /**
     *
     * @param  {string} route Route to navigate after search. This route path should contain a component for search results.
     */
    @Input() route: string = '/search';

    /**
     *
     * @param  {boolean} [projectfilter] If true it shows the selection of projects to filter by one of them
     */
    @Input() projectfilter?: boolean = false;

    /**
     *
     * @param  {string} [filterbyproject] If your full-text search should be filtered by one project, you can define it with project iri in the parameter filterbyproject.
     */
    @Input() filterbyproject?: string;

    /**
     * @ignore
     * input field for full-text search
     *
     * @param  {} 'search'
     * @param  {ElementRef} searchField
     */
    @ViewChild('search') searchField: ElementRef;

    /**
     * @ignore
     * mat menu: after select a project, the focus should switch to the input field
     *
     * @param  {} 'btnToSelectProject'
     * @param  {MatMenuTrigger} selectProject
     */
    @ViewChild('btnToSelectProject') selectProject: MatMenuTrigger;

    searchQuery: string;

    showSimpleSearch: boolean = true;

    searchPanelFocus: boolean = false;

    prevSearch: PrevSearchItem[] = JSON.parse(localStorage.getItem('prevSearch'));

    focusOnSimple: string = 'inactive';

    searchLabel: string = 'Search';

    projects: Project[];
    projectLabel: string = 'Filter project';
    projectIri: string;

    error: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _projectsService: ProjectsService
    ) {}

    ngOnInit() {
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

    /**
     * Do search on press Enter, close search menu on Escape
     * @ignore
     *
     * @param search_ele
     * @param event
     */
    onKey(search_ele: HTMLElement, event): void {
        this.focusOnSimple = 'active';
        this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
        if (
            this.searchQuery &&
            (event.key === 'Enter' ||
                event.keyCode === 13 ||
                event.which === 13)
        ) {
            this.doSearch();
        }
        if (
            event.key === 'Escape' ||
            event.keyCode === 27 ||
            event.which === 27
        ) {
            this.resetSearch(search_ele);
        }
    }

    /**
     * Realise a simple search
     * @ignore
     *
     */
    doSearch(): void {
        if (this.searchQuery !== undefined && this.searchQuery !== null) {
            this.toggleMenu();

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

            // this._router.navigate(['/search/fulltext/' + this.searchQuery], { relativeTo: this._route });

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

        } else {
            // search_ele.focus();
            this.searchField.nativeElement.focus();
            this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
        }
    }

    /**
     * Reset the search: close the search menu; clean the input field
     * @ignore
     *
     * @param {HTMLElement} search_ele
     */
    resetSearch(search_ele: HTMLElement): void {
        this.searchQuery = null;
        search_ele.focus();
        this.focusOnSimple = 'inactive';
        this.searchPanelFocus = !this.searchPanelFocus;
    }

    /**
     * Switch according to the focus between simple or extended search
     * @ignore
     *
     */
    toggleMenu(): void {
        this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
        this.focusOnSimple =
            this.focusOnSimple === 'active' ? 'inactive' : 'active';
        this.showSimpleSearch = true;
    }

    /**
     * Set simple focus to active
     * @ignore
     *
     */
    setFocus(): void {
        this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
        this.focusOnSimple = 'active';
        this.searchPanelFocus = !this.searchPanelFocus;
    }

    /**
     * Realise a previous search
     * @ignore
     *
     * @param {string} prevSearch
     */
    doPrevSearch(prevSearch: PrevSearchItem): void {

        this.searchQuery = prevSearch.query;

        if (prevSearch.projectIri !== undefined) {
            this.projectIri = prevSearch.projectIri;
            this.projectLabel = prevSearch.projectLabel;
            this._router.navigate([
                this.route +
                    '/fulltext/' +
                    this.searchQuery +
                    '/' +
                    encodeURIComponent(prevSearch.projectIri)
            ]);
        } else {
            this.projectIri = undefined;
            this.projectLabel = 'Filter project';
            this._router.navigate([
                this.route + '/fulltext/' + this.searchQuery
            ]);
        }

        this.toggleMenu();
    }

    /**
     * Reset previous searches - the whole previous search or specific item by name
     * @ignore
     *
     * @param {string} prevSearch term of the search
     */
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

    /**
     * get all projects for "filter by project" selection
     * @ignore
     */
    getAllProjects() {
        this._projectsService.getAllProjects().subscribe(
            (projects: Project[]) => {
                this.projects = projects;
                // this.loadSystem = false;
                if (localStorage.getItem('currentProject') !== null) {
                    this.projectLabel = JSON.parse(
                        localStorage.getItem('currentProject')
                    ).shortname;
                }
            },
            (error: ApiServiceError) => {
                console.error(error);
                this.error = error;
            }
        );
    }

    /**
     * get project information in case of @Input project
     * @ignore
     *
     * @param {string} iri
     */
    getProject(iri: string) {
        this._projectsService.getProjectByIri(iri).subscribe(
            (project: Project) => {
                this.setProject(project);
            },
            (error: ApiServiceError) => {
                console.error(error);
            }
        );
    }

    /**
     * set the project to use and store it in the local storage
     * @ignore
     *
     * @param {Project} project
     */
    setProject(project?: Project) {
        if (!project) {
            // set default project: all
            this.projectLabel = 'Filter project';
            this.projectIri = undefined;
            localStorage.removeItem('currentProject');
        } else {
            // set current project shortname and id
            this.projectLabel = project.shortname;
            this.projectIri = project.id;
            localStorage.setItem('currentProject', JSON.stringify(project));
        }
    }

    /**
     * switch focus from select-project-menu to input field
     * @ignore
     */
    changeFocus() {
        this.selectProject.closeMenu();
        this.searchField.nativeElement.focus();
    }
}
