import { TestBed } from '@angular/core/testing';

import { ListService } from './list.service';
import { KuiCoreModule } from '../../core.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ListService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            HttpClientTestingModule,
            KuiCoreModule.forRoot({name: '', api: 'http://0.0.0.0:3333', app: '', media: ''})
        ]
    }));

    it('should be created', () => {
        const service: ListService = TestBed.get(ListService);
        expect(service).toBeTruthy();
    });
});
