import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatExpansionModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ExpertSearchComponent } from './expert-search.component';
import { KuiCoreConfigToken, KuiCoreConfig } from '@knora/core';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

fdescribe('ExpertSearchComponent', () => {
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

  it('should reset the form', () => {
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
