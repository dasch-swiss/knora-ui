import { Component, OnInit } from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {

  constructor(private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'knora-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/knora-icon.svg')
    );
    iconRegistry.addSvgIcon(
      'github-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/github-icon.svg')
    );
  }

  ngOnInit() {

  }

}
