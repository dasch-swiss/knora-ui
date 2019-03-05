import { async, inject, TestBed } from '@angular/core/testing';
import { ProjectsService } from './projects.service';
import { ApiServiceError, ApiServiceResult, Project, ProjectResponse, ProjectsResponse } from '../../declarations/';
import {
    anythingProjectResponseJson,
    imagesProjectResponseJson,
    incunabulaProject,
    incunabulaProjectResponseJson,
    projectsResponseJson,
    projectsTestData
} from '../../test-data/admin/shared-test-data';
import { JsonConvert, OperationMode, ValueCheckingMode } from 'json2typescript';
import { ApiService } from '../api.service';
import { Observable, of } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { KuiCoreModule } from '../../core.module';


describe('ProjectsService', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let projectsService: ProjectsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                KuiCoreModule.forRoot({ name: '', api: 'http://0.0.0.0:3333', app: '', media: '' })
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

    describe('#getProjects', () => {

        it('should be created', async(inject([ProjectsService], (service) => {
            expect(service).toBeDefined();
        })));

        it('#getAllProjects should return all projects', async(inject([ProjectsService], (service) => {

            spyOn(service, 'getAllProjects').and.callFake(() => {
                const result = new ApiServiceResult();
                result.status = 200;
                result.statusText = '';
                result.url = '';
                result.body = projectsResponseJson;

                return of(result);
            });

            expect(projectsService).toBeDefined();

            const allProjects: Observable<Project[]> = projectsService.getAllProjects();

            const projects = {
                'projects': [{ 'ontologies': ['http://www.knora.org/ontology/0001/anything', 'http://www.knora.org/ontology/0001/something'], 'shortname': 'anything', 'description': [{ 'value': 'Anything Project' }], 'shortcode': '0001', 'logo': null, 'id': 'http://rdfh.ch/projects/0001', 'status': true, 'selfjoin': false, 'keywords': [], 'longname': 'Anything Project' }, { 'ontologies': ['http://www.knora.org/ontology/00FF/images'], 'shortname': 'images', 'description': [{ 'value': 'A demo project of a collection of images', 'language': 'en' }], 'shortcode': '00FF', 'logo': null, 'id': 'http://rdfh.ch/projects/00FF', 'status': true, 'selfjoin': false, 'keywords': ['collection', 'images'], 'longname': 'Image Collection Demo' }, { 'ontologies': ['http://www.knora.org/ontology/0803/incunabula'], 'shortname': 'incunabula', 'description': [{ 'value': '<p>Das interdisziplinäre Forschungsprojekt "<b><em>Die Bilderfolgen der Basler Frühdrucke: Spätmittelalterliche Didaxe als Bild-Text-Lektüre</em></b>" verbindet eine umfassende kunstwissenschaftliche Analyse der Bezüge zwischen den Bildern und Texten in den illustrierten Basler Inkunabeln mit der Digitalisierung der Bestände der Universitätsbibliothek und der Entwicklung einer elektronischen Edition in der Form einer neuartigen Web-0.2-Applikation.\n</p>\n<p>Das Projekt wird durchgeführt vom <a href="http://kunsthist.unibas.ch">Kunsthistorischen Seminar</a> der Universität Basel (Prof. B. Schellewald) und dem <a href="http://www.dhlab.unibas.ch">Digital Humanities Lab</a> der Universität Basel (PD Dr. L. Rosenthaler).\n</p>\n<p>\nDas Kernstück der digitalen Edition besteht aus rund zwanzig reich bebilderten Frühdrucken aus vier verschiedenen Basler Offizinen. Viele davon sind bereits vor 1500 in mehreren Ausgaben erschienen, einige fast gleichzeitig auf Deutsch und Lateinisch. Es handelt sich um eine ausserordentlich vielfältige Produktion; neben dem Heilsspiegel finden sich ein Roman, die Melusine,  die Reisebeschreibungen des Jean de Mandeville, einige Gebets- und Erbauungsbüchlein, theologische Schriften, Fastenpredigten, die Leben der Heiligen Fridolin und Meinrad, das berühmte Narrenschiff  sowie die Exempelsammlung des Ritters vom Thurn.\n</p>\nDie Internetpublikation macht das digitalisierte Korpus dieser Frühdrucke  durch die Möglichkeiten nichtlinearer Verknüpfung und Kommentierung der Bilder und Texte, für die wissenschaftliche Edition sowie für die Erforschung der Bilder und Texte nutzbar machen. Auch können bereits bestehende und entstehende Online-Editionen damit verknüpft  werden , wodurch die Nutzung von Datenbanken anderer Institutionen im Hinblick auf unser Corpus optimiert wird.\n</p>' }], 'shortcode': '0803', 'logo': 'incunabula_logo.png', 'id': 'http://rdfh.ch/projects/0803', 'status': true, 'selfjoin': false, 'keywords': ['Basel', 'Basler Frühdrucke', 'Bilderfolgen', 'Contectualisation of images', 'Inkunabel', 'Kunsthistorisches Seminar Universität Basel', 'Late Middle Ages', 'Letterpress Printing', 'Narrenschiff', 'Sebastian Brant', 'Wiegendrucke', 'early print', 'incunabula', 'ship of fools'], 'longname': 'Bilderfolgen Basler Frühdrucke' }, { 'ontologies': ['http://www.knora.org/ontology/0804/dokubib'], 'shortname': 'dokubib', 'description': [{ 'value': 'Dokubib' }], 'shortcode': '0804', 'logo': null, 'id': 'http://rdfh.ch/projects/0804', 'status': false, 'selfjoin': false, 'keywords': [], 'longname': 'Dokubib' }, { 'ontologies': ['http://www.knora.org/ontology/08AE/webern'], 'shortname': 'webern', 'description': [{ 'value': 'Historisch-kritische Edition des Gesamtschaffens von Anton Webern.' }], 'shortcode': '08AE', 'logo': null, 'id': 'http://rdfh.ch/projects/08AE', 'status': true, 'selfjoin': false, 'keywords': [], 'longname': 'Anton Webern Gesamtausgabe' }, { 'ontologies': ['http://www.knora.org/ontology/0802/biblio'], 'shortname': 'biblio', 'description': [{ 'value': 'Bibliography' }], 'shortcode': '0802', 'logo': null, 'id': 'http://rdfh.ch/projects/DczxPs-sR6aZN91qV92ZmQ', 'status': true, 'selfjoin': false, 'keywords': [], 'longname': 'Bibliography' }, { 'ontologies': ['http://www.knora.org/ontology/0801/beol'], 'shortname': 'beol', 'description': [{ 'value': 'Bernoulli-Euler Online' }], 'shortcode': '0801', 'logo': null, 'id': 'http://rdfh.ch/projects/yTerZGyxjZVqFMNNKXCDPF', 'status': true, 'selfjoin': false, 'keywords': [], 'longname': 'Bernoulli-Euler Online' }, { 'ontologies': ['http://www.knora.org/ontology/standoff', 'http://www.knora.org/ontology/knora-base', 'http://www.knora.org/ontology/salsah-gui'], 'shortname': 'SystemProject', 'description': [{ 'value': 'Knora System Project', 'language': 'en' }], 'shortcode': 'FFFF', 'logo': null, 'id': 'http://www.knora.org/ontology/knora-base#SystemProject', 'status': true, 'selfjoin': false, 'keywords': [], 'longname': 'Knora System Project' }]
            };

            allProjects.subscribe((result: any) => {
                const projectsResult = result.body;
                // TODO: ask Andreas how should we use the method getBody()
                expect(projectsResult).toEqual(projects);
            },
                (error: ApiServiceError) => {
                    fail(error);
                }
            );

        })));

        it('#getProjectByIri should return project (incunabula)', async(inject([ProjectsService], (service) => {

            spyOn(service, 'getProjectByIri').and.callFake(() => {
                const result = new ApiServiceResult();
                result.status = 200;
                result.statusText = '';
                result.url = '';
                result.body = incunabulaProjectResponseJson;

                return of(result);
            });

            expect(projectsService).toBeDefined();

            const projectByIri: Observable<Project> = projectsService.getProjectByIri('http://rdfh.ch/projects/0803');

            const projectIncunabula = {
                'project': { 'ontologies': ['http://www.knora.org/ontology/0803/incunabula'], 'shortname': 'incunabula', 'description': [{ 'value': '<p>Das interdisziplinäre Forschungsprojekt \'<b><em>Die Bilderfolgen der Basler Frühdrucke: Spätmittelalterliche Didaxe als Bild-Text-Lektüre</em></b>\' verbindet eine umfassende kunstwissenschaftliche Analyse der Bezüge zwischen den Bildern und Texten in den illustrierten Basler Inkunabeln mit der Digitalisierung der Bestände der Universitätsbibliothek und der Entwicklung einer elektronischen Edition in der Form einer neuartigen Web-0.2-Applikation.\n</p>\n<p>Das Projekt wird durchgeführt vom <a href=\'http://kunsthist.unibas.ch\'>Kunsthistorischen Seminar</a> der Universität Basel (Prof. B. Schellewald) und dem <a href=\'http://www.dhlab.unibas.ch\'>Digital Humanities Lab</a> der Universität Basel (PD Dr. L. Rosenthaler).\n</p>\n<p>\nDas Kernstück der digitalen Edition besteht aus rund zwanzig reich bebilderten Frühdrucken aus vier verschiedenen Basler Offizinen. Viele davon sind bereits vor 1500 in mehreren Ausgaben erschienen, einige fast gleichzeitig auf Deutsch und Lateinisch. Es handelt sich um eine ausserordentlich vielfältige Produktion; neben dem Heilsspiegel finden sich ein Roman, die Melusine,  die Reisebeschreibungen des Jean de Mandeville, einige Gebets- und Erbauungsbüchlein, theologische Schriften, Fastenpredigten, die Leben der Heiligen Fridolin und Meinrad, das berühmte Narrenschiff  sowie die Exempelsammlung des Ritters vom Thurn.\n</p>\nDie Internetpublikation macht das digitalisierte Korpus dieser Frühdrucke  durch die Möglichkeiten nichtlinearer Verknüpfung und Kommentierung der Bilder und Texte, für die wissenschaftliche Edition sowie für die Erforschung der Bilder und Texte nutzbar machen. Auch können bereits bestehende und entstehende Online-Editionen damit verknüpft  werden , wodurch die Nutzung von Datenbanken anderer Institutionen im Hinblick auf unser Corpus optimiert wird.\n</p>' }], 'shortcode': '0803', 'logo': 'incunabula_logo.png', 'id': 'http://rdfh.ch/projects/0803', 'status': true, 'selfjoin': false, 'keywords': ['Basel', 'Basler Frühdrucke', 'Bilderfolgen', 'Contectualisation of images', 'Inkunabel', 'Kunsthistorisches Seminar Universität Basel', 'Late Middle Ages', 'Letterpress Printing', 'Narrenschiff', 'Sebastian Brant', 'Wiegendrucke', 'early print', 'incunabula', 'ship of fools'], 'longname': 'Bilderfolgen Basler Frühdrucke' }
            };

            projectByIri.subscribe((result: any) => {
                const projectsResult = result.body;
                expect(projectsResult).toEqual(projectIncunabula);
            },
                (error: ApiServiceError) => {
                    fail(error);
                }
            );

        })));

        it('#getProjectByShortname should return project (incunabula)', async(inject([ProjectsService], (service) => {

            const incunabulaShortname = 'incunabula';

            spyOn(service, 'getProjectByShortname').and.callFake(() => {
                const result = new ApiServiceResult();
                result.status = 200;
                result.statusText = '';
                result.url = '';
                result.body = incunabulaProjectResponseJson;

                return of(result);
            });

            expect(projectsService).toBeDefined();

            const projectByShortname: Observable<Project> = projectsService.getProjectByShortname(incunabulaShortname);

            const projectIncunabula = {
                'project': { 'ontologies': ['http://www.knora.org/ontology/0803/incunabula'], 'shortname': 'incunabula', 'description': [{ 'value': '<p>Das interdisziplinäre Forschungsprojekt \'<b><em>Die Bilderfolgen der Basler Frühdrucke: Spätmittelalterliche Didaxe als Bild-Text-Lektüre</em></b>\' verbindet eine umfassende kunstwissenschaftliche Analyse der Bezüge zwischen den Bildern und Texten in den illustrierten Basler Inkunabeln mit der Digitalisierung der Bestände der Universitätsbibliothek und der Entwicklung einer elektronischen Edition in der Form einer neuartigen Web-0.2-Applikation.\n</p>\n<p>Das Projekt wird durchgeführt vom <a href=\'http://kunsthist.unibas.ch\'>Kunsthistorischen Seminar</a> der Universität Basel (Prof. B. Schellewald) und dem <a href=\'http://www.dhlab.unibas.ch\'>Digital Humanities Lab</a> der Universität Basel (PD Dr. L. Rosenthaler).\n</p>\n<p>\nDas Kernstück der digitalen Edition besteht aus rund zwanzig reich bebilderten Frühdrucken aus vier verschiedenen Basler Offizinen. Viele davon sind bereits vor 1500 in mehreren Ausgaben erschienen, einige fast gleichzeitig auf Deutsch und Lateinisch. Es handelt sich um eine ausserordentlich vielfältige Produktion; neben dem Heilsspiegel finden sich ein Roman, die Melusine,  die Reisebeschreibungen des Jean de Mandeville, einige Gebets- und Erbauungsbüchlein, theologische Schriften, Fastenpredigten, die Leben der Heiligen Fridolin und Meinrad, das berühmte Narrenschiff  sowie die Exempelsammlung des Ritters vom Thurn.\n</p>\nDie Internetpublikation macht das digitalisierte Korpus dieser Frühdrucke  durch die Möglichkeiten nichtlinearer Verknüpfung und Kommentierung der Bilder und Texte, für die wissenschaftliche Edition sowie für die Erforschung der Bilder und Texte nutzbar machen. Auch können bereits bestehende und entstehende Online-Editionen damit verknüpft  werden , wodurch die Nutzung von Datenbanken anderer Institutionen im Hinblick auf unser Corpus optimiert wird.\n</p>' }], 'shortcode': '0803', 'logo': 'incunabula_logo.png', 'id': 'http://rdfh.ch/projects/0803', 'status': true, 'selfjoin': false, 'keywords': ['Basel', 'Basler Frühdrucke', 'Bilderfolgen', 'Contectualisation of images', 'Inkunabel', 'Kunsthistorisches Seminar Universität Basel', 'Late Middle Ages', 'Letterpress Printing', 'Narrenschiff', 'Sebastian Brant', 'Wiegendrucke', 'early print', 'incunabula', 'ship of fools'], 'longname': 'Bilderfolgen Basler Frühdrucke' }
            };

            projectByShortname.subscribe((result: any) => {
                const projectsResult = result.body;
                expect(projectsResult).toEqual(projectIncunabula);
            },
                (error: ApiServiceError) => {
                    fail(error);
                }
            );

        })));

        it('#getProjectByShortcode should return project (incunabula)', async(inject([ProjectsService], (service) => {

            spyOn(service, 'getProjectByShortcode').and.callFake(() => {
                const result = new ApiServiceResult();
                result.status = 200;
                result.statusText = '';
                result.url = '';
                result.body = incunabulaProjectResponseJson;

                return of(result);
            });

            expect(projectsService).toBeDefined();

            const projectByShortcode: Observable<Project> = projectsService.getProjectByShortcode('0803');

            const projectIncunabula = {
                'project': { 'ontologies': ['http://www.knora.org/ontology/0803/incunabula'], 'shortname': 'incunabula', 'description': [{ 'value': '<p>Das interdisziplinäre Forschungsprojekt \'<b><em>Die Bilderfolgen der Basler Frühdrucke: Spätmittelalterliche Didaxe als Bild-Text-Lektüre</em></b>\' verbindet eine umfassende kunstwissenschaftliche Analyse der Bezüge zwischen den Bildern und Texten in den illustrierten Basler Inkunabeln mit der Digitalisierung der Bestände der Universitätsbibliothek und der Entwicklung einer elektronischen Edition in der Form einer neuartigen Web-0.2-Applikation.\n</p>\n<p>Das Projekt wird durchgeführt vom <a href=\'http://kunsthist.unibas.ch\'>Kunsthistorischen Seminar</a> der Universität Basel (Prof. B. Schellewald) und dem <a href=\'http://www.dhlab.unibas.ch\'>Digital Humanities Lab</a> der Universität Basel (PD Dr. L. Rosenthaler).\n</p>\n<p>\nDas Kernstück der digitalen Edition besteht aus rund zwanzig reich bebilderten Frühdrucken aus vier verschiedenen Basler Offizinen. Viele davon sind bereits vor 1500 in mehreren Ausgaben erschienen, einige fast gleichzeitig auf Deutsch und Lateinisch. Es handelt sich um eine ausserordentlich vielfältige Produktion; neben dem Heilsspiegel finden sich ein Roman, die Melusine,  die Reisebeschreibungen des Jean de Mandeville, einige Gebets- und Erbauungsbüchlein, theologische Schriften, Fastenpredigten, die Leben der Heiligen Fridolin und Meinrad, das berühmte Narrenschiff  sowie die Exempelsammlung des Ritters vom Thurn.\n</p>\nDie Internetpublikation macht das digitalisierte Korpus dieser Frühdrucke  durch die Möglichkeiten nichtlinearer Verknüpfung und Kommentierung der Bilder und Texte, für die wissenschaftliche Edition sowie für die Erforschung der Bilder und Texte nutzbar machen. Auch können bereits bestehende und entstehende Online-Editionen damit verknüpft  werden , wodurch die Nutzung von Datenbanken anderer Institutionen im Hinblick auf unser Corpus optimiert wird.\n</p>' }], 'shortcode': '0803', 'logo': 'incunabula_logo.png', 'id': 'http://rdfh.ch/projects/0803', 'status': true, 'selfjoin': false, 'keywords': ['Basel', 'Basler Frühdrucke', 'Bilderfolgen', 'Contectualisation of images', 'Inkunabel', 'Kunsthistorisches Seminar Universität Basel', 'Late Middle Ages', 'Letterpress Printing', 'Narrenschiff', 'Sebastian Brant', 'Wiegendrucke', 'early print', 'incunabula', 'ship of fools'], 'longname': 'Bilderfolgen Basler Frühdrucke' }
            };

            projectByShortcode.subscribe((result: any) => {
                    const projectsResult = result.body;
                    expect(projectsResult).toEqual(projectIncunabula);
                },
                (error: ApiServiceError) => {
                    fail(error);
                }
            );

        })));



        it('should parse projects-response', () => {

            const jsonConvert: JsonConvert = new JsonConvert(OperationMode.ENABLE, ValueCheckingMode.ALLOW_NULL);

            const result: ProjectsResponse | ProjectsResponse[] = jsonConvert.deserialize(projectsResponseJson, ProjectsResponse);
            // console.log(result);

            expect(result).toBeTruthy();
        });

        it('should parse project-response (images)', () => {

            const jsonConvert: JsonConvert = new JsonConvert(OperationMode.ENABLE, ValueCheckingMode.ALLOW_NULL);

            const result: ProjectResponse | ProjectResponse[] = jsonConvert.deserialize(imagesProjectResponseJson, ProjectResponse);

            expect(result).toBeTruthy();
        });

        it('should parse project-response (incunabula)', () => {

            const jsonConvert: JsonConvert = new JsonConvert(OperationMode.ENABLE, ValueCheckingMode.ALLOW_NULL);

            const result: ProjectResponse | ProjectResponse[] = jsonConvert.deserialize(incunabulaProjectResponseJson, ProjectResponse);

            expect(result).toBeTruthy();
        });

        it('should parse project-response (anything)', () => {

            const jsonConvert: JsonConvert = new JsonConvert(OperationMode.ENABLE, ValueCheckingMode.ALLOW_NULL);

            const result: ProjectResponse | ProjectResponse[] = jsonConvert.deserialize(anythingProjectResponseJson, ProjectResponse);

            expect(result).toBeTruthy();
        });

        // TODO: ask Ivan about the integration environment and Travis testing

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

});
