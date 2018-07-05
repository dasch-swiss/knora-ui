import {DemoModule} from './app.interfaces';

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
                label: 'AdminImage'
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
            }
        ]
    };

    public static authenticationModule: DemoModule = {
        name: 'authentication',
        published: false,
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


    public static viewerModule: DemoModule = {
        name: 'viewer',
        published: false,
        label: 'Viewer module'
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
    ];

}
