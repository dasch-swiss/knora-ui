import { Component, Input } from '@angular/core';
import { ReadUriValue } from '@knora/core';

@Component({
  selector: 'kui-uri-value',
  templateUrl: './uri-value.component.html',
  styleUrls: ['./uri-value.component.scss']
})
export class UriValueComponent {

  @Input()
  set valueObject(value: ReadUriValue) {
    this.__uriValueObj = value;
  }

  get valueObject() {
    return this.__uriValueObj;
  }

  private __uriValueObj: ReadUriValue;

  constructor() { }

}
