import { inject, TestBed } from '@angular/core/testing';

import { GroupsService } from './groups.service';
import { HttpClientModule } from '@angular/common/http';
import { KuiCoreModule } from '../../core.module';

describe('GroupsService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                KuiCoreModule.forRoot({ name: '', api: 'http://0.0.0.0:3333', app: '', media: '' })
            ],
            providers: [GroupsService]
        });
    });

    it('should be created', inject([GroupsService], (service: GroupsService) => {
        expect(service).toBeTruthy();
    }));
});
