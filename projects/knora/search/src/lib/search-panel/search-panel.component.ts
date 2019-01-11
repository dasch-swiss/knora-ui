import { Component, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'kui-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss'],
  animations: [
    trigger('extendedSearchMenu',
      [
        state('inactive', style({ display: 'none' })),
        state('active', style({ display: 'block' })),
        transition('inactive => active', animate('100ms ease-in')),
        transition('active => inactive', animate('100ms ease-out'))
      ]
    )
  ]
})
export class SearchPanelComponent {

  @Input() route: string = '/search';
  showMenu: boolean = false;
  focusOnExtended: string = 'inactive';

  constructor() { }

  /**
   * Show or hide the extended search menu
   *
   * @returns void
   */
  toggleMenu(): void {
    this.showMenu = !this.showMenu;
    this.focusOnExtended = (this.focusOnExtended === 'active' ? 'inactive' : 'active');
  }
}
