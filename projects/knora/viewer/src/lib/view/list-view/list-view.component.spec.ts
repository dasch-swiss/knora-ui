import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { ListViewComponent } from './list-view.component';
import { KeyPipe, ProgressIndicatorComponent } from '@knora/action';
import { TextValueAsHtmlComponent } from '../../property/text-value/text-value-as-html/text-value-as-html.component';
import { DateValueComponent } from '../../property/date-value/date-value.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListViewComponent', () => {
  let component: ListViewComponent;
  let fixture: ComponentFixture<ListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatListModule,
        RouterTestingModule
      ],
      declarations: [
        ListViewComponent,
        ProgressIndicatorComponent,
        KeyPipe,
        TextValueAsHtmlComponent,
        DateValueComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
