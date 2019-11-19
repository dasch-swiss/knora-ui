# Knora-ui core module

[![npm (scoped)](https://img.shields.io/npm/v/@knora/core.svg)](https://www.npmjs.com/package/@knora/core)

This module is part of [Knora-ui](https://github.com/dasch-swiss/knora-ui) modules, developed by the team at the [Data and Service Center for Humanities DaSCH](http://dasch.swiss).

The core module contains every service to use Knora's RESTful webapi v2 and admin.

## Prerequisites

For help getting started with a new Angular app, check out the [Angular CLI](https://cli.angular.io/).

For existing apps, follow these steps to begin using Knora-ui core.

## Install

You can use either the npm or yarn command-line tool to install packages. Use whichever is appropriate for your project in the examples below.

### Yarn

`$ yarn add @knora/core`

### NPM

`$ npm install --save @knora/core`

### Dependencies

This module has the following package dependencies, which you also have to install.

-   @angular/common@8.0.3
-   @angular/core@8.0.3
-   json2typescript@1.0.6
-   jsonld@1.1.0
-   semver@^6.1.1
-   @knora/api (not yet published)

### Required version of Knora: 10.0.0

## Setup

On version 6 of Angular CLI they removed the shim for global and other node built-ins as mentioned in [#9827 (comment)](https://github.com/angular/angular-cli/issues/9827#issuecomment-369578814). Because of the jsonld package, we have to manually shimming it inside of the **polyfills.ts** file of the app:

```typescript
// Add global to window, assigning the value of window itself.

 (window as any).global = window;
```

For the environment configuration (Knora API url etc. settings), we have to create the following configuration files and serverice:

```shell
mkdir src/config
touch src/config/config.dev.json
touch src/config/config.prod.json

ng g s app-init
```

The `config.dev.json` should look as follow:

```json
{
    "knora": {
        "apiProtocol": "http",
        "apiHost": "0.0.0.0",
        "apiPort": 3333,
        "apiPath": "",
        "jsonWebToken": "",
        "logErrors": true

    },
    "app": {
        "name": "Knora-APP",
        "url": "localhost:4200"
    }
}

```

The `config.prod.json` looks similar probably the knora.logErrors are set to false. The config files have to been integrated in `angular.json` in each "assets"-section:

```json
"assets": [
    "src/favicon.ico",
    "src/assets",
    "src/config"
]
```

It's possible to have different configuration files, depending on the environment definition in `src/environments/`. The name defined in environment is used to take the correct `config.xyz.json` file.

E.g. the environment.ts needs the name definition for develeop mode:

```typescript
export const environment = {
    name: 'dev',
    production: false
};
```

To load the correct configuration you have to write an `app-init.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { KuiConfig } from '@knora/core';
import { KnoraApiConnection, KnoraApiConfig } from '@knora/api';

@Injectable()
export class AppInitService {

    static knoraApiConnection: KnoraApiConnection;

    static knoraApiConfig: KnoraApiConfig;

    static kuiConfig: KuiConfig;

    constructor() { }

    Init() {

        return new Promise<void>((resolve, reject) => {

            // init knora-ui configuration
            AppInitService.kuiConfig = window['tempConfigStorage'] as KuiConfig;

            // init knora-api configuration
            AppInitService.knoraApiConfig = new KnoraApiConfig(
                AppInitService.kuiConfig.knora.apiProtocol,
                AppInitService.kuiConfig.knora.apiHost,
                AppInitService.kuiConfig.knora.apiPort
            );

            // set knora-api connection configuration
            AppInitService.knoraApiConnection = new KnoraApiConnection(AppInitService.knoraApiConfig);

            resolve();
        });
    }
}
```

This service will be loaded in `src/app/app.module.ts`:

```typescript
import { KnoraApiConnectionToken, KuiConfigToken, KuiCoreModule } from '@knora/core';
import { AppInitService } from './app-init.service';

export function initializeApp(appInitService: AppInitService) {
    return (): Promise<any> => {
        return appInitService.Init();
    };
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        KuiCoreModule
    ],
    providers: [
        AppInitService,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [AppInitService],
            multi: true
        },
        {
            provide: KuiConfigToken,
            useFactory: () => AppInitService.kuiConfig
        },
        {
            provide: KnoraApiConfigToken,
            useFactory: () => AppInitService.knoraApiConfig
        },
        {
            provide: KnoraApiConnectionToken,
            useFactory: () => AppInitService.knoraApiConnection
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

Additional you have to update the `src/main.ts` file:

```typescript
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import 'hammerjs';

if (environment.production) {
  enableProdMode();
}

function bootstrapFailed(result) {
    console.error('bootstrap-fail', result);
}

fetch(`config/config.${environment.name}.json`)
    .then(response => response.json())
    .then(config => {
        if (!config || !config['knora']) {
            bootstrapFailed(config);
            return;
        }

        // store the response somewhere that the AppInitService can read it.
        window['tempConfigStorage'] = config;

        platformBrowserDynamic()
            .bootstrapModule(AppModule)
            .catch(err => bootstrapFailed(err));
    })
    .catch(bootstrapFailed);
```

## Usage

The `@knora/core` is a configuration handler for `@knora/api` which has all the services to make Knora-api requests.

The following project-component example shows how to implement the two modules to get all projects form Knora.

```typescript
import { Component, Inject, OnInit } from '@angular/core';
import { ApiResponseData, ApiResponseError, KnoraApiConnection, ProjectsResponse, ReadProject } from '@knora/api';
import { KnoraApiConnectionToken } from '@knora/core';

@Component({
    selector: 'app-projects',
    template: `<ul><li *ngFor="let p of projects">{{p.longname}} (<strong>{{p.shortname}}</strong> | {{p.shortcode}})</li></ul>`
})
export class ProjectsComponent implements OnInit {
    projects: ReadProject[];

    constructor(
        @Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection
    ) { }

    ngOnInit() {
        this.getProjects();
    }

    getProjects() {
        this.knoraApiConnection.admin.projectsEndpoint.getProjects().subscribe(
            (response: ApiResponseData<ProjectsResponse>) => {
                this.projects = response.body.projects;
            },
            (error: ApiResponseError) => {
                console.error(error);
            }
        );
    }
}
```
<!--

## Special usage of Knora API v2

### JSON-LD Conversion

Knora API v2 serializes data as JSON-LD. The data received from Knora has to be converted to internal structures.

**Resource Response and Search Results**

For data representing resources, a `ReadResourcesSequence` has to be constructed, representing one or more resources with their properties.
Given a full resource request or a list of search results, the module `ConvertJSONLD` converts them from JSON-LD to an instance of `ReadResourcesSequence`.
Before passing the JSON-LD data to `ConvertJSONLD`, the prefixes have to be expanded using the JSON-LD processor.

```typescript
declare let require: any;
let jsonld = require('jsonld');

...

(result: ApiServiceResult) => {
    let promises = jsonld.promises;
    // compact JSON-LD using an empty context: expands all Iris
    let promise = promises.compact(result.body, {});

    promise.then((compacted) => {

        const resourceSeq: ReadResourcesSequence =
            ConvertJSONLD.createReadResourcesSequenceFromJsonLD(compacted);

    }, function (err) {

        console.log('JSONLD of full resource request could not be expanded:' + err);

    });
}
```

`ReadResourcesSequence` represents the resources as an array of `ReadResource`. Each property is represented as an instance of the (abstract) interface `ReadPropertyItem`.
For the different value types, an implementation of `ReadPropertyItem` is provided.

**Ontology Information**

When processing the representation of resources, entity Iris are collected and retrieved from Knora via the service `OntologyCacheService`.
After expanding the Iris as shown above, the resources entity Iris can be collected and the definitions requested:

```typescript
// get resource class Iris from response
let resourceClassIris: string[] = ConvertJSONLD.getResourceClassesFromJsonLD(compacted);

// request ontology information about resource class Iris (properties are implied)
this._cacheService.getResourceClassDefinitions(resourceClassIris).subscribe(
    (resourceClassInfos: OntologyInformation) => {
        // resourceClassInfos contains the information about the resources classes
        // and the properties it has cardinalities for
    },
    (err) => {
        console.log('cache request failed: ' + err);
    });
```

An instance of `OntologyInformation` contains the resource class definitions and the properties the resource classes have cardinalities for.
To facilitate this process and minimize the number of requests to be sent to Knora, the `OntologyCacheService` gets whole ontologies from Knora each time it encounters an unknown entity and caches them.
Once stored in  the cache, the `OntologyCacheService` can serve the information without doing an additional request to Knora.
 -->