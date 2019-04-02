import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { KnoraConstants } from '@knora/core';
import { Router } from '@angular/router';

@Component({
    selector: 'kui-list-view',
    templateUrl: './list-view.component.html',
    styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent {

    @Input() result;
    @Input() ontologyInfo;
    @Input() isLoading;

    KnoraConstants = KnoraConstants;

    constructor(
        private _router: Router
    ) { }

    openResource(id: string) {
        const url: string = '/resource/' + encodeURIComponent(id);
        this._router.navigate([url]);
    }

}
