import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  title = 'test environment for the Knora gui modules';

  constructor() {
  }

  ngOnInit() {
  }

}
