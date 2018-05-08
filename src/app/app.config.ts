import {DemoModule} from './app.interfaces';

export class AppConfig {
    public static prefix = 'knora';
    public static stackblitz = 'https://stackblitz.com/edit/';
    public static npm = 'https://www.npmjs.com/package/';
    public static badge = 'https://img.shields.io/npm/v/';

}

export class AppDemo {

    public static progressIndicator: DemoModule = {
        'name': 'progress-indicator',
        'published': true,
        'label': 'Progress indicator'
    };

    public static adminImage: DemoModule = {
        'name': 'admin-image',
        'published': true,
        'label': 'Admin image'
    };

    public static actionModule: DemoModule = {
        'name': 'action',
        'published': true,
        'label': 'Action module'
    };

    public static coreModule: DemoModule = {
        'name': 'core',
        'published': false,
        'label': 'Core module'
    };

}
