import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { BaseElementComponent } from '../base-element/base-element.component';
import { Validators } from '@angular/forms';

@Component({
  selector: 'kui-text-element',
  templateUrl: './text-element.component.html',
  styleUrls: ['./text-element.component.scss']
})
export class TextElementComponent extends BaseElementComponent<string> implements OnInit, OnChanges, OnDestroy {

    @Input() htmlElement: 'input' | 'textarea' = 'input';

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
