import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocIntroComponent } from './doc-intro.component';

describe('DocIntroComponent', () => {
  let component: DocIntroComponent;
  let fixture: ComponentFixture<DocIntroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocIntroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
