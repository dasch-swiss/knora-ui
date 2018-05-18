# Projects service

This service is part of [@knora/core](https://www.npmjs.com/package/%40knora%2Fcore), one of the [knora-ui modules](https://www.npmjs.com/~knora). 
Please read the README there first.

Import the core module in your app.module.ts 

`import {KuiCoreConfig, KuiCoreModule} from '@knora/core';`

and set the api server of your environment first. In our apps we define it in the environment files e.g. in the dev mode:

```
export const environment = {
  production: false,
  api: 'http://0.0.0.0:3333',
  gui: 'http://localhost:4200',
  media: 'http://localhost:1024'
};
```

which can be reused in app.module.ts

```
import {environment} from '../environments/environment';

const AppEnvironment: KuiCoreConfig = {
    api: environment.api,
    media: environment.media,
    gui: environment.gui
};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        KuiCoreModule.forRoot(AppEnvironment),      <--
        HttpClientModule
    ],
    providers: [ ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
```

## Usage

Import the 

