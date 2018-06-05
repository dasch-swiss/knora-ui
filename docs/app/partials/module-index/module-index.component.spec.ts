import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ModuleIndexComponent} from './module-index.component';
import {MatIconModule, MatListModule, MatSidenavModule} from '@angular/material';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('ModuleIndexComponent', () => {
  let component: ModuleIndexComponent;
  let fixture: ComponentFixture<ModuleIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [ModuleIndexComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
