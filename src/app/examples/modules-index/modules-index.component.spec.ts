import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {ModulesIndexComponent} from './modules-index.component';
import {KnoraProgressIndicatorModule} from '@knora/progress-indicator';
import {ProgressIndicatorDemoComponent} from '../modules-demo/progress-indicator-demo/progress-indicator-demo.component';
import {HeaderComponent} from '../../framework/header/header.component';
import {MatListModule, MatSidenavModule} from '@angular/material';


describe('ModulesIndexComponent', () => {
  let component: ModulesIndexComponent;
  let fixture: ComponentFixture<ModulesIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatListModule,
        MatSidenavModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [ModulesIndexComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
