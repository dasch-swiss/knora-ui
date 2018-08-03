# Knora-ui core
![npm (scoped)](https://img.shields.io/npm/v/@knora/core.svg)

This module is part of [Knora-ui](https://github.com/dhlab-basel/Knora-ui) modules, developed by the team at the [DHLab Basel](http://dhlab.unibas.ch).

The core module contains every service to use Knora's RESTful webapi.

## Install
`$ yarn add @knora/core json2typescript jsonld`

OR

`$ npm install --save @knora/core json2typescript jsonld`

## Setup
On version 6 of Angular CLI they removed the shim for global and other node built-ins as mentioned in [#9827 (comment)](https://github.com/angular/angular-cli/issues/9827#issuecomment-369578814). Because of the jsonld package, we have to manually shimming it inside of the polyfills.ts file of the app:
```
// Add global to window, assigning the value of window itself.

 (window as any).global = window;
```

Next step is to import the core module in your app.module.ts 

`import {KuiCoreConfig, KuiCoreModule} from '@knora/core';`

and set the api server of your environment first. In our apps we define it in the environment files. This helps to define more than one environment for various usages of the Angular app.

For local usage (developer mode) define your environment.ts as follow: 

```
export const environment = {
  production: false,
  name: 'Salsah',
  api: 'http://0.0.0.0:3333',
  app: 'http://localhost:4200',
  media: 'http://localhost:1024'
};
```

- name: Name of the app. We're using it as a title in the authentication module
- api: set the url of the [Knora](https://www.knora.org) webapi server
- app: on which url is this app running?
- media: url of a specific media server. In our case it's [sipi](http://www.sipi.io)

Send this configuration to the `@knora/core` module in your app.module.ts

```
import {environment} from '../environments/environment';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        KuiCoreModule.forRoot({
            name: environment.name,
            api: environment.api,
            media: environment.media,
            app: environment.app
        }),
        HttpClientModule
    ],
    providers: [ ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
```

## Usage
The `@knora/core` has different services, which follows the route definiton of [knora webapi](https://docs.knora.org)

Each of the services has the [json2typescript](https://www.npmjs.com/package/json2typescript) mapper implemented.
`json2typescript` is a small package containing a helper class that maps JSON objects to an instance of a TypeScript class.


That means that you have to import the service and the type classes into your component.

For example:

To get project information you have to import at least three elements from `@knora/core`

`import {ApiServiceError, Project, ProjectsService, User} from '@knora/core';`

and use it as follow:

```
project: Project;

(...)

this.projectsService.getProjectByIri(iri)
    .subscribe(
        (result: Project) => {
            this.project = result;
        },
        (error: ApiServiceError) => {
            console.error(error);
        }
    );
```

<!--
### Error handling
-->


