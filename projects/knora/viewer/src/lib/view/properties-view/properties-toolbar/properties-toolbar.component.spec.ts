import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { KnoraApiConfig, KnoraApiConnection } from '@knora/api';
import { KnoraApiConnectionToken } from '@knora/core';

import { PropertiesToolbarComponent } from './properties-toolbar.component';

fdescribe('PropertiesToolbarComponent', () => {
  let component: PropertiesToolbarComponent;
  let fixture: ComponentFixture<PropertiesToolbarComponent>;

  const config = new KnoraApiConfig('http', '0.0.0.0', 3333);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule],
      declarations: [PropertiesToolbarComponent],
      providers: [
        {
          provide: KnoraApiConnectionToken,
          useValue: new KnoraApiConnection(config)
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
