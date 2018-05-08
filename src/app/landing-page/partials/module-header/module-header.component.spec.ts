import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ModuleHeaderComponent} from './module-header.component';
import {MatIconModule} from '@angular/material';

describe('ModuleHeaderComponent', () => {
  let component: ModuleHeaderComponent;
  let fixture: ComponentFixture<ModuleHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule
      ],
      declarations: [ModuleHeaderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
