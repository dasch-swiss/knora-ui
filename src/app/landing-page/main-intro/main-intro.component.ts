import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-introduction',
  templateUrl: './main-intro.component.html',
  styleUrls: ['./main-intro.component.scss']
})
export class MainIntroComponent implements OnInit {

  title = 'test environment for the Knora ui modules';

  constructor() { }

  ngOnInit() {
  }

}
