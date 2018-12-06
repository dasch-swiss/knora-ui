import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * A component with a list of properties to sort a list by them.
 */
@Component({
    selector: 'kui-sort-button',
    templateUrl: './sort-button.component.html',
    styleUrls: ['./sort-button.component.scss']
})
export class SortButtonComponent implements OnInit {

    /**
     *
     */
    @Output() sortKeyChange: EventEmitter<string> = new EventEmitter<string>();

    menuXPos: string = 'after';

    activeKey: string;

    /**
     *
     */
    @Input() sortProps: any;

    /**
     *
     */
    @Input() position: string = 'left';

    /**
     *
     * @param value
     */
    @Input() sortKey(value) {
        this.activeKey = value;
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
