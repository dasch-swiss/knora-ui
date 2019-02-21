import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPgComponent } from './search-pg.component';

describe('SearchPgComponent', () => {
  let component: SearchPgComponent;
  let fixture: ComponentFixture<SearchPgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
