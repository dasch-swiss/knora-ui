import { Component, Input, OnInit } from '@angular/core';

/**
 *
 *
 * @example
 * // default progress indicator
 * <kui-progress-indicator color="#ff00aa"></kui-progress-indicator>
 *
 * @example
 * // submit progress indicator: html
 * <mat-list>
 *                 <mat-list-item *ngFor="let item of examples">
 *                     <kui-progress-indicator mat-list-avatar [status]="item.status"></kui-progress-indicator>
 *                     <p mat-line><strong><span>{{item.label}}</span></strong></p>
 *                     <p mat-line>status: {{item.status}}</p>
 *                 </mat-list-item>
 * </mat-list>
 *
 * @example
 * // instead of [color]: overwrite the progress indicator color in a global scss file in the app.
 *
 * .kui-progress-indicator {
 *                .line > div {
 *                     background-color: #ff0000 !important;
 *                 }
 * }
 *
 *
 */
@Component({
    selector: 'kui-progress-indicator',
    templateUrl: './progress-indicator.component.html',
    styleUrls: ['./progress-indicator.component.scss']
})
export class ProgressIndicatorComponent implements OnInit {

    /**
     * status is a number and can be used when submitting form data:
     *
     * - not ready:    -1
     * - loading:       0
     * - done:          1
     *
     * - error:       400
     */
    @Input() status?: number;

    /**
     * With [color] you can customize the appearance of the loader.
     * You can define the color with the hexadecimal value e.g. #00ff00.
     *
     */
    @Input() color?: string = 'primary';

    constructor() {
    }

    ngOnInit() {
    }

}
