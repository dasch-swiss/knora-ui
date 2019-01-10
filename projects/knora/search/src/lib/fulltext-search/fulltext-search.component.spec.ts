import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatIconModule,
  MatInputModule,
  MatListModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReversePipe } from '@knora/action';
import { FulltextSearchComponent } from './fulltext-search.component';

describe('FulltextSearchComponent', () => {
  let component: FulltextSearchComponent;
  let fixture: ComponentFixture<FulltextSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatInputModule,
        MatListModule,
        FormsModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [
        FulltextSearchComponent,
        ReversePipe
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: null
          },
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FulltextSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
