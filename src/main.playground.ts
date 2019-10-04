import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { PlaygroundModule } from 'angular-playground';
import { KuiActionModule } from '@knora/action';

PlaygroundModule
    .configure({
        selector: 'app-root',
        overlay: false,
        modules: [
            KuiActionModule
        ],
    });

platformBrowserDynamic().bootstrapModule(PlaygroundModule);
