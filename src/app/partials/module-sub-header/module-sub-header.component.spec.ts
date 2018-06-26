import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleSubHeaderComponent } from './module-sub-header.component';

describe('ModuleSubHeaderComponent', () => {
  let component: ModuleSubHeaderComponent;
  let fixture: ComponentFixture<ModuleSubHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleSubHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleSubHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
