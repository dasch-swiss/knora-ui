import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface SortProp {
    key: string;
    label: string;
}

/**
 * A component with a list of properties to sort a list by one of them.
 * It can be used together with the KuiSortBy pipe.
 */
@Component({
    selector: 'kui-sort-button',
    templateUrl: './sort-button.component.html',
    styleUrls: ['./sort-button.component.scss']
})
export class SortButtonComponent implements OnInit {

    /**
     *
     * @param {string} sortKeyChange (output)
     *     EventEmitter when a user selected a sort property;
     *     This is the selected key
     */
    @Output() sortKeyChange: EventEmitter<string> = new EventEmitter<string>();


    menuXPos: string = 'after';

    activeKey: string;

    /**
     * List of properties to sort by;
     *
     * @param {SortProp[]} sortProps
     * An array of SortProp objects: { key: <string>, label: <string> }
     */
    @Input() sortProps: SortProp[];

    /**
     * Optional position of the sort menu: right or left
     *
     * @param {string} position
     * default value is 'left'
     */
    @Input() position?: string = 'left';

    /**
     * Active / current sort property
     *
     * @param {string} sortKey
     */
    @Input() sortKey(sortKey: string) {
        this.activeKey = sortKey;
    }

    /**
     * @ignore
     */
    constructor() {
    }

    ngOnInit() {
        if (this.position === 'right') {
            this.menuXPos = 'before';
        }

    }

    /**
     * @ignore
     *
     * @param {string} key
     */
    sortBy(key: string) {
        this.sortKeyChange.emit(key);
    }

}
