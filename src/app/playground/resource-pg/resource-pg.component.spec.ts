import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcePgComponent } from './resource-pg.component';

describe('ResourcePgComponent', () => {
  let component: ResourcePgComponent;
  let fixture: ComponentFixture<ResourcePgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcePgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcePgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
