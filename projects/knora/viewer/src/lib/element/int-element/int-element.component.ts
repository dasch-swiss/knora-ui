import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BaseElementComponent } from '../base-element/base-element.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'kui-int-element',
    templateUrl: './int-element.component.html',
    styleUrls: ['./int-element.component.scss']
})
export class IntElementComponent extends BaseElementComponent<number> implements OnInit, OnChanges, OnDestroy {

    // only allow for integer values (no fractions)
    validators = [Validators.required, Validators.pattern(/^-?\d+$/)];

    ngOnInit() {
        this.initialize();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.change(changes);
    }


    ngOnDestroy() {
        this.destroy();
    }

}
