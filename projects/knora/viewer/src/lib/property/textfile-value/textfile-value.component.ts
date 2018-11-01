import { Component, Input } from '@angular/core';
import { ReadTextFileValue } from '@knora/core';

@Component({
  selector: 'kui-textfile-value',
  templateUrl: './textfile-value.component.html',
  styleUrls: ['./textfile-value.component.scss']
})
export class TextfileValueComponent {

  @Input()
  set valueObject(value: ReadTextFileValue) {
    this._textfileValueObj = value;
  }

  get valueObject() {
    return this._textfileValueObj;
  }

  private _textfileValueObj: ReadTextFileValue;

  constructor() { }

}
