import { Component, Input, OnInit } from '@angular/core';
import { ReadBooleanValue } from '@knora/core';

@Component({
  selector: 'kui-boolean-value',
  templateUrl: './boolean-value.component.html',
  styleUrls: ['./boolean-value.component.scss']
})
export class BooleanValueComponent implements OnInit {

  @Input() valueObject: ReadBooleanValue;

  constructor() { }

  ngOnInit() {
  }

}
