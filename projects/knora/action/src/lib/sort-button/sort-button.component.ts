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
     * @ignore {string} sortKeyChange
     * @emits TODO: this would be the correct syntax for Output eventEmitter
     *
     * EventEmitter when a user selected a sort property;
     * This is the selected key
     */
    @Output() sortKeyChange: EventEmitter<string> = new EventEmitter<string>();


    menuXPos: string = 'after';

    activeKey: string;

    /**
     * @param {SortProp[]} sortProps
     * An array of SortProp objects for the selection menu:
     * SortProp: { key: string, label: string }
     */
    @Input() sortProps: SortProp[];

    /**
     * @param {string} [position='left']
     * Optional position of the sort menu: right or left
     */
    @Input() position?: string = 'left';


    /**
     * Default icon is "sort" from material design.
     * But you can replace it with another one
     * e.g. sort_by_alpha
     *
     * @param  {string} [icon='sort']
     */
    @Input() icon?: string = 'sort';

    /**
     * @param {string} sortKey
     * set and get (two-way data binding) of current sort key
     */
    @Input() sortKey(sortKey: string) {
        this.activeKey = sortKey;
    }

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
