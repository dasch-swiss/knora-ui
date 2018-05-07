import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-index',
  templateUrl: './main-index.component.html',
  styleUrls: ['./main-index.component.scss']
})
export class MainIndexComponent implements OnInit {

  title = 'test environment for the Knora gui modules';

  constructor() { }

  ngOnInit() {
  }

}
