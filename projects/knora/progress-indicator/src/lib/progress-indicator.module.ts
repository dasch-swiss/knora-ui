/* Copyright © 2018 Digital Humanities Lab, University of Basel
 * in cooperation with the Data and Service Center for the Humanities (DaSCH)
 * This file is part of the Knora ui modules: https://www.npmjs.com/~knora
 * Knora is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * Knora is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * You should have received a copy of the GNU Affero General Public
 * License along with SALSAH modules.  If not, see <http://www.gnu.org/licenses/>.
 * */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {KuiProgressIndicatorComponent} from './progress-indicator.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule
  ],
  declarations: [
    KuiProgressIndicatorComponent
  ],
  exports: [
      KuiProgressIndicatorComponent
  ]
})
export class KuiProgressIndicatorModule {
}
