import { async, inject, TestBed } from '@angular/core/testing';
import { ProjectsService } from './projects.service';
import { ApiServiceError, Project, ProjectResponse, ProjectsResponse } from '../../declarations/';
import {
    anythingProjectResponseJson,
    imagesProjectResponseJson,
    incunabulaProject,
    incunabulaProjectResponseJson,
    projectsResponseJson,
    projectsTestData
} from '../../test-data/admin/shared-test-data';
import { JsonConvert, OperationMode, ValueCheckingMode } from 'json2typescript';
import { KuiCoreModule } from '../../core.module';
import { ApiService } from '../api.service';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';


describe('ProjectsService', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let projectsService: ProjectsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                KuiCoreModule.forRoot({name: '', api: 'http://0.0.0.0:3333', app: '', media: ''})
            ],
            providers: [
                ApiService,
                ProjectsService
            ]
        });

        // Inject the http, test controller, and service-under-test
        // as they will be referenced by each test.
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        projectsService = TestBed.get(ProjectsService);

    });

    it('should be created', async(inject(
        [ProjectsService], (service) => {
            expect(service).toBeDefined();
        }))
    );


    it('should parse projects-response', () => {

        const jsonConvert: JsonConvert = new JsonConvert(OperationMode.ENABLE, ValueCheckingMode.ALLOW_NULL);

        const result: ProjectsResponse = jsonConvert.deserializeObject(projectsResponseJson, ProjectsResponse);
        // console.log(result);

        expect(result).toBeTruthy();
    });

    it('should parse project-response (images)', () => {

        const jsonConvert: JsonConvert = new JsonConvert(OperationMode.ENABLE, ValueCheckingMode.ALLOW_NULL);

        const result: ProjectResponse = jsonConvert.deserializeObject(imagesProjectResponseJson, ProjectResponse);

        expect(result).toBeTruthy();
    });

    it('should parse project-response (incunabula)', () => {

        const jsonConvert: JsonConvert = new JsonConvert(OperationMode.ENABLE, ValueCheckingMode.ALLOW_NULL);

        const result: ProjectResponse = jsonConvert.deserializeObject(incunabulaProjectResponseJson, ProjectResponse);

        expect(result).toBeTruthy();
    });

    it('should parse project-response (anything)', () => {

        const jsonConvert: JsonConvert = new JsonConvert(OperationMode.ENABLE, ValueCheckingMode.ALLOW_NULL);

        const result: ProjectResponse = jsonConvert.deserializeObject(anythingProjectResponseJson, ProjectResponse);

        expect(result).toBeTruthy();
    });

    it('#getProjectByIri should return project (incunabula)', async(inject(
        [ProjectsService], (service) => {

            expect(service).toBeDefined();

            service.getProjectByIri('http://rdfh.ch/projects/0803')
                .subscribe(
                    (project: Project) => {
                        // console.log('project: ' + JSON.stringify(project));
                        expect(project).toEqual(incunabulaProject);
                    },
                    (error: ApiServiceError) => {
                        fail(error);
                    }
                );

        })));

    it('#getAllProjects should return all projects', async(inject(
        [ProjectsService], (service) => {

            expect(service).toBeDefined();

            service.getAllProjects()
                .subscribe(
                    (projects: Project[]) => {

                        // console.log('projects from TEST-DATA: ' + JSON.stringify(projectsTestData));
                        // console.log('projects from API: ' + JSON.stringify(projects));

                        expect(projects.length).toBe(8);
                        expect(projects).toEqual(projectsTestData);
                    },
                    (error: ApiServiceError) => {
                        fail(error);
                    }
                );

        })));

    /*

        it('#getAllProjects should return all projects', async(inject(
            [ProjectsService], (service) => {

                expect(service).toBeDefined();

                service.getAllProjects()
                    .subscribe(
                        (projects: Project[]) => {

                            console.log('projects from TEST-DATA: ' + JSON.stringify(projectsTestData));
                            console.log('projects from API: ' + JSON.stringify(projects));

                            expect(projects.length).toBe(8);
                            expect(projects).toEqual(projectsTestData);
                        },
                        (error: ApiServiceError) => {
                            fail(error);
                        }
                    );

            })));
    */

    /*
    if (environment.type === 'integration') {

        it('should load test data [it]', async(inject(
            [StoreService], (service) => {

                expect(service).toBeDefined();

                service.resetTriplestoreContent([])
                    .subscribe(
                        (result: string) => {
                            expect(result).toBe('success');
                        });

            })), 300000);


        it('#getAllProjects should return all projects [it]', async(inject(
            [ProjectsService], (service) => {

                expect(service).toBeDefined();

                service.getAllProjects()
                    .subscribe(
                        (projects: Project[]) => {
                            // console.log('projects: ' + JSON.stringify(projects));
                            expect(projects.length).toBe(8);
                            expect(projects).toEqual(projectsTestData);
                        },
                        (error: ApiServiceError) => {
                            fail(error);
                        }
                    );

            })));


        it('#getProjectByIri should return project (images) [it]', async(inject(
            [ProjectsService], (service) => {

                expect(service).toBeDefined();

                service.getProjectByIri('http://rdfh.ch/projects/00FF')
                    .subscribe(
                        (project: Project) => {
                            // console.log('project: ' + JSON.stringify(project));
                            expect(project).toEqual(imagesProject);
                        },
                        (error: ApiServiceError) => {
                            fail(error);
                        }
                    );

            })));

        it('#getProjectByIri should return project (incunabula) [it]', async(inject(
            [ProjectsService], (service) => {

                expect(service).toBeDefined();

                service.getProjectByIri('http://rdfh.ch/projects/77275339')
                    .subscribe(
                        (project: Project) => {
                            // console.log('project: ' + JSON.stringify(project));
                            expect(project).toEqual(incunabulaProject);
                        },
                        (error: ApiServiceError) => {
                            fail(error);
                        }
                    );

            })));

        it('#getProjectByIri should return project (anything) [it]', async(inject(
            [ProjectsService], (service) => {

                expect(service).toBeDefined();

                service.getProjectByIri('http://rdfh.ch/projects/anything')
                    .subscribe(
                        (project: Project) => {
                            // console.log('project: ' + JSON.stringify(project));
                            expect(project).toEqual(anythingProject);
                        },
                        (error: ApiServiceError) => {
                            fail(error);
                        }
                    );

            })));

        it('#getProjectByShortname should return project (images) [it]', async(inject(
            [ProjectsService], (service) => {

                expect(service).toBeDefined();

                service.getProjectByShortname('images')
                    .subscribe(
                        (project: Project) => {
                            // console.log('users: ' + JSON.stringify(users));
                            expect(project).toEqual(imagesProject);
                        },
                        (error: ApiServiceError) => {
                            fail(error);
                        }
                    );

            })));


        it('#getProjectByShortcode should return project (images) [it]', async(inject(
            [ProjectsService], (service) => {

                expect(service).toBeDefined();

                service.getProjectByShortcode('00FF')
                    .subscribe(
                        (project: Project) => {
                            // console.log('users: ' + JSON.stringify(users));
                            expect(project).toEqual(imagesProject);
                        },
                        (error: ApiServiceError) => {
                            fail(error);
                        }
                    );

            })));



    } else {
        xit('integration tests skipped. run  "ng test --env=it".');
    }
    */


});
