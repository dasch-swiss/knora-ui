import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleIndexComponent } from './module-index.component';

describe('ModuleIndexComponent', () => {
  let component: ModuleIndexComponent;
  let fixture: ComponentFixture<ModuleIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleIndexComponent ]
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
