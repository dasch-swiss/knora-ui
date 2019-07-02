import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { KuiCoreConfig, KuiCoreConfigToken } from '@knora/core';
import { ExpertSearchComponent } from './expert-search.component';

describe('ExpertSearchComponent', () => {
  let component: ExpertSearchComponent;
  let fixture: ComponentFixture<ExpertSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [ExpertSearchComponent],
      providers: [
        FormBuilder,
        HttpClient,
        {
          provide: ActivatedRoute,
          useValue: {
            params: null
          }
        },
        {
          provide: KuiCoreConfigToken,
          useValue: KuiCoreConfig
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should reset the form', () => {
    const ele: DebugElement = fixture.debugElement;

    const resetBtn = ele.query(By.css('button'));
    const textarea = ele.query(By.css('textarea'));

    const resetEle: HTMLElement = resetBtn.nativeElement;
    const textareaEle: HTMLElement = textarea.nativeElement;

    resetEle.click();

    fixture.detectChanges();

    expect(textareaEle.innerHTML).toEqual('');
  });
});
