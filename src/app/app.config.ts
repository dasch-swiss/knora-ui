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
                name: 'login-form',
                label: 'LoginForm',
                type: 'Component',
                stackblitz: false
            },
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
                name: 'message',
                label: 'Message',
                type: 'Component',
                stackblitz: false
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
            },
            {
                name: 'truncate',
                label: 'Truncate',
                type: 'Pipe',
                stackblitz: false
            },
            {
                name: 'stringify-string-literal',
                label: 'StringifyStringLiteral',
                type: 'Pipe',
                stackblitz: false
            }
        ]
    };

    public static coreModule: DemoModule = {
        name: 'core',
        published: true,
        label: 'Core module',
        children: []
    };

    // public static authenticationModule: DemoModule = {
    //     name: 'authentication',
    //     published: true,
    //     label: 'Authentication module',
    //     children: [
    //         {
    //             name: 'login-form',
    //             label: 'LoginForm',
    //             type: 'Component',
    //             stackblitz: false
    //         },
    //         {
    //             name: 'authentication',
    //             label: 'AuthenticationService',
    //             stackblitz: false
    //         }
    //     ]
    // };

    public static searchModule: DemoModule = {
        name: 'search',
        published: true,
        label: 'Search module',
        children: [
            {
                name: 'search-panel',
                label: 'Search panel',
                type: 'Component',
                stackblitz: false
            },
            {
                name: 'fulltext-search',
                label: 'Full-text search',
                type: 'Component',
                stackblitz: false
            },
            {
                name: 'extended-search',
                label: 'Extended search',
                type: 'Component',
                stackblitz: false
            }
        ]
    };

    public static viewerModule: DemoModule = {
        name: 'viewer',
        published: true,
        label: 'Viewer module',
        children: [
            {
                name: 'search-results',
                label: 'Search results',
                type: 'Component',
                stackblitz: false
            }
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
        AppDemo.searchModule,
        AppDemo.viewerModule,
        AppDemo.actionModule
    ];

}
