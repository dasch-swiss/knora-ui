import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleSidenavComponent } from './module-sidenav.component';

describe('ModuleSidenavComponent', () => {
  let component: ModuleSidenavComponent;
  let fixture: ComponentFixture<ModuleSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
