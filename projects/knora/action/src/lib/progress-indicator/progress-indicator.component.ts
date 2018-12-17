import { Component, Input, OnInit } from '@angular/core';

/**
 * The progress indicator can be used to show the status of loading something.
 * This can be the simple loader or in case of submitting data it can show the status (not ready, loading, done or error).
 *
 */
@Component({
    selector: 'kui-progress-indicator',
    templateUrl: './progress-indicator.component.html',
    styleUrls: ['./progress-indicator.component.scss']
})
export class ProgressIndicatorComponent implements OnInit {

    /**
     * @param {number} [status]
     *
     * [status] is a number and can be used when submitting form data:
     *
     * - not ready:    -1
     * - loading:       0
     * - done:          1
     *
     * - error:       400
     */
    @Input() status?: number;

    /**
     * @param {string} [color=primary]
     *
     * Parameter to customize the appearance of the loader.
     * Hexadecimal color value e.g. #00ff00 or similar color values 'red', 'green' etc.
     */
    @Input() color?: string = 'primary';


    /**
     * @ignore
     */
    constructor() {
    }

    ngOnInit() {
    }

}
