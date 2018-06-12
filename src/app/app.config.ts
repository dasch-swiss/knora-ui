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
    public static adminImage: DemoModule = {
        name: 'admin-image',
        published: true,
        stackblitz: false,
        label: 'Admin image'
    };

    public static actionModule: DemoModule = {
        name: 'action',
        published: true,
        label: 'Action module'
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

    /* ******************************************************************* */

    /**
     * the following list of modules will be used on the public documentation
     * @type {DemoModule[]}
     */
    public static examples: DemoModule[] = [
        AppDemo.progressIndicator,
        AppDemo.coreModule,
        AppDemo.authenticationModule,
        AppDemo.projectModule

    ];

}
