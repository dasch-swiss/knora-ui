import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainIndexComponent } from './main-index.component';

describe('MainIndexComponent', () => {
  let component: MainIndexComponent;
  let fixture: ComponentFixture<MainIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the landing page on route \'/\'', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'test environment for the Knora gui modules'`, async(() => {
    expect(component.title).toEqual('test environment for the Knora gui modules');
  }));
  it('should render title in a h1 tag', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('test environment for the Knora gui modules');
  }));

});
