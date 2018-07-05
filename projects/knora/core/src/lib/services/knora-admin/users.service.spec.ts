import { inject, TestBed } from '@angular/core/testing';

import { UsersService } from './users.service';
import { HttpClientModule } from '@angular/common/http';
import { KuiCoreModule } from '../../core.module';

describe('UsersService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                KuiCoreModule.forRoot({ name: '', api: 'http://0.0.0.0:3333', app: '', media: '' })
            ],
            providers: [UsersService]
        });
    });

    it('should be created', inject([UsersService], (service: UsersService) => {
        expect(service).toBeTruthy();
    }));
});
