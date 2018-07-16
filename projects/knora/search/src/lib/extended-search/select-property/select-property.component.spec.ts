import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule, MatFormFieldModule, MatSelectModule } from '@angular/material';

import { SelectPropertyComponent } from './select-property.component';
import { SpecifyPropertyValueComponent } from './specify-property-value/specify-property-value.component';

describe('SelectPropertyComponent', () => {
  let component: SelectPropertyComponent;
  let fixture: ComponentFixture<SelectPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectPropertyComponent, SpecifyPropertyValueComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatSelectModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
