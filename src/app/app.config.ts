import { DemoModule } from './app.interfaces';

export class AppConfig {
    public static prefix = 'knora';
    public static stackblitz = 'https://stackblitz.com/edit/';
    public static parameter = '?hideExplorer=1&hideNavigation=1&view=editor';
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
                type: 'Component',
                stackblitz: true
            },
            {
                name: 'progress-indicator',
                label: 'ProgressIndicator',
                type: 'Component',
                stackblitz: true
            },
            {
                name: 'admin-image',
                label: 'AdminImage',
                type: 'Directive',
                stackblitz: false
            },
            {
                name: 'existing-name',
                label: 'ExistingName',
                type: 'Directive',
                stackblitz: true
            },
            {
                name: 'key',
                label: 'Key',
                type: 'Pipe',
                stackblitz: true
            }
        ]
    };

    public static coreModule: DemoModule = {
        name: 'core',
        published: true,
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
                name: 'search',
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
                name: 'grav-search',
                label: 'GravSearchService'
            },
            {
                name: 'convert-jsonld',
                label: 'ConvertJsonLD'
            }
        ]
    };

    public static authenticationModule: DemoModule = {
        name: 'authentication',
        published: true,
        label: 'Authentication module',
        children: [
            {
                name: 'login-form',
                label: 'LoginForm',
                type: 'Component',
                stackblitz: false
            },
            {
                name: 'authentication',
                label: 'AuthenticationService',
                stackblitz: false
            }
        ]
    };

    public static searchModule: DemoModule = {
        name: 'search',
        published: true,
        label: 'Search module',
        children: [
            {
                name: 'search',
                label: 'Search',
                type: 'Component',
                stackblitz: false
            }
        ]
    };

    public static viewerModule: DemoModule = {
        name: 'viewer',
        published: false,
        label: 'Viewer module',
        children: [
            /* {
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
            } */
        ]
    };

    /* ******************************************************************* */

    /**
     * the following list of modules will be used on the public documentation page
     * @type {DemoModule[]}
     */
    public static examples: DemoModule[] = [
        AppDemo.coreModule,
        AppDemo.authenticationModule,
        AppDemo.searchModule,
        AppDemo.viewerModule,
        AppDemo.actionModule
    ];

}
