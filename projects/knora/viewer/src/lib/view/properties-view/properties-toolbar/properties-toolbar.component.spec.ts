import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesToolbarComponent } from './properties-toolbar.component';

describe('PropertiesToolbarComponent', () => {
  let component: PropertiesToolbarComponent;
  let fixture: ComponentFixture<PropertiesToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertiesToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
