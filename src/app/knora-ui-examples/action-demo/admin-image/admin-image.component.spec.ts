import { KuiActionModule } from '@knora/action';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminImageComponent } from './admin-image.component';

describe('AdminImageDemoComponent', () => {
  let component: AdminImageComponent;
  let fixture: ComponentFixture<AdminImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
          KuiActionModule
      ],
      declarations: [ AdminImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
