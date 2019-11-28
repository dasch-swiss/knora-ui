import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { BaseElementComponent } from '../base-element/base-element.component';
import { Validators } from '@angular/forms';
import { Utils } from '@knora/core';

@Component({
    selector: 'kui-uri-element',
    templateUrl: './uri-element.component.html',
    styleUrls: ['./uri-element.component.scss']
})
export class UriElementComponent extends BaseElementComponent<string> implements OnInit, OnChanges, OnDestroy {

    validators = [Validators.required, Validators.pattern(Utils.RegexUrl)];

    placeholder = 'URI value';

    @Input() label?: string;

    displayString: string;

    initDisplayString() {

        if (this.label === undefined) {
            this.displayString = this.eleVal;
        } else {
            this.displayString = this.label;
        }

    }

    ngOnInit() {
        this.initialize();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.change(changes);

        this.initDisplayString();
    }

    ngOnDestroy() {
        this.destroy();
    }

}
