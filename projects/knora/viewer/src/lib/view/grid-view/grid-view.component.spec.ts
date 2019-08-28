import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { GridViewComponent } from './grid-view.component';

import { KeyPipe, ProgressIndicatorComponent } from '@knora/action';
import { TextValueAsHtmlComponent } from '../../property/text-value/text-value-as-html/text-value-as-html.component';
import { DateValueComponent } from '../../property/date-value/date-value.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('GridViewComponent', () => {
  let component: GridViewComponent;
  let fixture: ComponentFixture<GridViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatIconModule,
        RouterTestingModule
      ],
      declarations: [
        GridViewComponent,
        ProgressIndicatorComponent,
        KeyPipe,
        TextValueAsHtmlComponent,
        DateValueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
