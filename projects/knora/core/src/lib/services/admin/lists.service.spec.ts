import { inject, TestBed } from '@angular/core/testing';

import { ListsService } from './lists.service';
import { HttpClientModule } from '@angular/common/http';
import { KuiCoreModule } from '../../core.module';

describe('ListsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        KuiCoreModule.forRoot({ name: '', api: 'http://0.0.0.0:3333', app: '', media: '' })
      ],
      providers: [ListsService]
    });
  });

  it('should be created', inject([ListsService], (service: ListsService) => {
    expect(service).toBeTruthy();
  }));
});
