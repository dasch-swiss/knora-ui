import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

export class GNDConstants {
    public static GNDPrefix: string = '(DE-588)';
    public static GNDResolver: string = 'http://d-nb.info/gnd/';

    public static VIAFPrefix: string = '(VIAF)';
    public static VIAFResolver: string = 'https://viaf.org/viaf/';
}

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

            if (this._gnd.indexOf(GNDConstants.GNDPrefix) === 0) {
                // GND/IAF identifier
                this.el.nativeElement.innerHTML = `<a href="${GNDConstants.GNDResolver + this._gnd.replace(GNDConstants.GNDPrefix, '')}" target="_blank">${this._gnd}</a>`;
            } else if (this._gnd.indexOf(GNDConstants.VIAFPrefix) === 0) {
                // VIAF identifier
                this.el.nativeElement.innerHTML = `<a href="${GNDConstants.VIAFResolver + this._gnd.replace(GNDConstants.VIAFPrefix, '')}" target="_blank">${this._gnd}</a>`;
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
