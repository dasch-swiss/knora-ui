import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { KnoraConstants } from '@knora/core';

@Component({
    selector: 'kui-list-view',
    templateUrl: './list-view.component.html',
    styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent {

    @Input() result;
    @Input() ontologyInfo;
    @Input() rerender;
    @Input() isLoading;

    KnoraConstants = KnoraConstants;

    constructor() { }

}
