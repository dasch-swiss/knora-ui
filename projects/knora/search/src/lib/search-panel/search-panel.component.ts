import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'kui-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss']
})
export class SearchPanelComponent implements OnInit {

  showMenu: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  openMenu() {
    console.log('open menu');
    this.showMenu = !this.showMenu;
    // https://angular.io/guide/animations
  }
}
