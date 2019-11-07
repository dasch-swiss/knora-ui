import { inject, TestBed } from '@angular/core/testing';
import { ResourceTypesService } from './resource-types.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { KuiCoreModule } from '../../core.module';

describe('ResourceTypesService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                KuiCoreModule.forRoot({ name: '', api: 'http://0.0.0.0:3333', app: '', media: '', ontologyIRI: '' })
            ],
            providers: [ResourceTypesService]
        });
    });

    it('should be created', inject([ResourceTypesService], (service: ResourceTypesService) => {
        expect(service).toBeTruthy();
    }));
});
