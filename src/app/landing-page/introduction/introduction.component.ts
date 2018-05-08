import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})
export class IntroductionComponent implements OnInit {

  title = 'test environment for the Knora gui modules';

  constructor() { }

  ngOnInit() {
  }

}
