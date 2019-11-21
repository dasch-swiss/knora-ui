import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { BaseElementComponent } from '../base-element/base-element.component';
import { Validators } from '@angular/forms';

@Component({
  selector: 'kui-string-element',
  templateUrl: './string-element.component.html',
  styleUrls: ['./string-element.component.scss']
})
export class StringElementComponent extends BaseElementComponent<string> implements OnInit, OnChanges, OnDestroy {

    validators = [Validators.required];

    placeholder = 'String value';

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
