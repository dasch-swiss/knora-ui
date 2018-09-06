import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkObjComponent } from './link-obj.component';

describe('LinkObjComponent', () => {
  let component: LinkObjComponent;
  let fixture: ComponentFixture<LinkObjComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkObjComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkObjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
