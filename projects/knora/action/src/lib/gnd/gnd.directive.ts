import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { KnoraConstants } from '@knora/core';

/**
 * This directive renders a GND/IAF or a VIAF identifier as a link to the respective resolver.
 */
@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[kuiGnd]'
})
export class GndDirective implements OnChanges {

    @Input()
    set kuiGnd(value: string) {
        this._gnd = value;
    }

    get kuiGnd() {
        return this._gnd;
    }


    // the GND identifier to be rendered
    private _gnd: string;

    constructor (private el: ElementRef) {

    }

    ngOnChanges() {
        if (this._gnd.length < 30) {

            if (this._gnd.indexOf(KnoraConstants.GNDPrefix) === 0) {
                // GND/IAF identifier
                this.el.nativeElement.innerHTML = `<a href="${KnoraConstants.GNDResolver + this._gnd.replace(KnoraConstants.GNDPrefix, '')}" target="_blank">${this._gnd}</a>`;
            } else if (this._gnd.indexOf(KnoraConstants.VIAFPrefix) === 0) {
                // VIAF identifier
                this.el.nativeElement.innerHTML = `<a href="${KnoraConstants.VIAFResolver + this._gnd.replace(KnoraConstants.VIAFPrefix, '')}" target="_blank">${this._gnd}</a>`;
            } else {
                // no identifier, leave unchanged
                this.el.nativeElement.innerHTML = this._gnd;
            }

        } else {
            // no identifier, leave unchanged
            this.el.nativeElement.innerHTML = this._gnd;
        }

    }


}
