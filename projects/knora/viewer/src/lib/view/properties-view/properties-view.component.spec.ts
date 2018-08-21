import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesViewComponent } from './properties-view.component';

describe('PropertiesViewComponent', () => {
  let component: PropertiesViewComponent;
  let fixture: ComponentFixture<PropertiesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PropertiesViewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
