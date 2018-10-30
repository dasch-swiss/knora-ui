import { DemoModule } from './app.interfaces';

export class AppConfig {
    public static prefix = 'knora';
    public static stackblitz = 'https://stackblitz.com/edit/';
    public static npm = 'https://www.npmjs.com/package/';
    public static badge = 'https://img.shields.io/npm/v/';

}

export class AppDemo {

    /**
     * examples of modules, which have an own demo page
     */
    public static progressIndicator: DemoModule = {
        name: 'progress-indicator',
        published: true,
        stackblitz: true,
        label: 'Progress indicator'
    };

    public static actionModule: DemoModule = {
        name: 'action',
        published: true,
        label: 'Action module',
        children: [
            {
                name: 'sort-button',
                label: 'SortButton',
                stackblitz: true
            },
            {
                name: 'progress-indicator',
                label: 'ProgressIndicator',
                stackblitz: true
            },
            {
                name: 'admin-image',
                label: 'AdminImage',
                stackblitz: true
            },
            {
                name: 'existing-name',
                label: 'ExistingName',
                stackblitz: true
            },
            {
                name: 'key',
                label: 'Key',
                stackblitz: true
            }
        ]
    };

    public static coreModule: DemoModule = {
        name: 'core',
        published: true,
        stackblitz: false,
        label: 'Core module',
        children: [
            {
                name: 'users',
                label: 'UsersService'
            },
            {
                name: 'projects',
                label: 'ProjectsService'
            },
            {
                name: 'groups',
                label: 'GroupsService'
            },
            {
                name: 'lists',
                label: 'ListsService'
            },
            {
                name: 'resource',
                label: 'ResourceService'
            },
            {
                name: 'search-service',
                label: 'SearchService'
            },
            {
                name: 'ontology-cache',
                label: 'OntologyCacheService'
            },
            {
                name: 'ontology',
                label: 'OntologyService'
            },
            {
                name: 'incoming',
                label: 'IncomingService'
            },
            {
                name: 'gravsearch',
                label: 'GravSearchService'
            },
            {
                name: 'convertjsonld',
                label: 'ConvertJsonLDService'
            }
        ]
    };

    public static authenticationModule: DemoModule = {
        name: 'authentication',
        published: true,
        label: 'Authentication module'
    };

    public static projectModule: DemoModule = {
        name: 'project',
        published: false,
        label: 'Project module'
    };

    public static adminModule: DemoModule = {
        name: 'admin',
        published: false,
        label: 'Admin module'
    };

    public static searchModule: DemoModule = {
        name: 'search',
        published: true,
        label: 'Search module'
    };

    public static viewerModule: DemoModule = {
        name: 'viewer',
        published: false,
        label: 'Viewer module',
        children: [
            {
                name: 'resources',
                label: 'Resources'
            },
            {
                name: 'properties',
                label: 'Properties'
            },
            {
                name: 'views',
                label: 'Views'
            }
        ]
    };

    /* ******************************************************************* */

    /**
     * the following list of modules will be used on the public documentation page
     * @type {DemoModule[]}
     */
    public static examples: DemoModule[] = [
        AppDemo.authenticationModule,
        AppDemo.actionModule,
        AppDemo.coreModule,
        AppDemo.searchModule,
        AppDemo.viewerModule
    ];

}
