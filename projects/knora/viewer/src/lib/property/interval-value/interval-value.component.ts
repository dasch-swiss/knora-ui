import { Component, Input, OnInit } from '@angular/core';
import { ReadIntervalValue } from '@knora/core';

@Component({
  selector: 'kui-interval-value',
  templateUrl: './interval-value.component.html',
  styleUrls: ['./interval-value.component.scss']
})
export class IntervalValueComponent implements OnInit {

  @Input() valueObject: ReadIntervalValue;

  constructor() { }

  ngOnInit() {
  }

}
