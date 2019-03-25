# Knora-ui core module
[![npm (scoped)](https://img.shields.io/npm/v/@knora/core.svg)](https://www.npmjs.com/package/@knora/core)

This module is part of [Knora-ui](https://github.com/dhlab-basel/Knora-ui) modules, developed by the team at the [Data and Service Center for Humanities DaSCH](http://dasch.swiss).

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
 - @angular/common@7.2.7
 - @angular/core@7.2.7
 - json2typescript@1.0.6
 - jsonld@1.1.0


## Setup
On version 6 of Angular CLI they removed the shim for global and other node built-ins as mentioned in [#9827 (comment)](https://github.com/angular/angular-cli/issues/9827#issuecomment-369578814). Because of the jsonld package, we have to manually shimming it inside of the **polyfills.ts** file of the app:
```javascript
// Add global to window, assigning the value of window itself.

 (window as any).global = window;
```

Next step is to import the core module in your app.module.ts 

`import {KuiCoreModule} from '@knora/core';`

and set the api server of your environment first. In our apps we define it in the environment files. This helps to define more than one environment for various usages of the Angular app.

For local usage (developer mode) define your environment.ts as follow: 

```javascript
export const environment = {
  production: false,
  name: 'Salsah',
  api: 'http://localhost:3333',
  app: 'http://localhost:4200',
  media: 'http://localhost:1024'
};
```

- name: Name of the app. We're using it as a title in the authentication module
- api: set the url of the [Knora](https://www.knora.org) webapi server
- app: on which url is this app running?
- media: url of a specific media server. In our case it's [sipi](http://www.sipi.io)

Send this configuration to the `@knora/core` module in your app.module.ts

```javascript
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';

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

```javascript
project: Project;

// ...

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


## Special usage of Knora API v2

### JSON-LD Conversion

Knora API v2 serializes data as JSON-LD. The data received from Knora has to be converted to internal structures.

**Resource Response and Search Results**

For data representing resources, a `ReadResourcesSequence` has to be constructed, representing one or more resources with their properties.
Given a full resource request or a list of search results, the module `ConvertJSONLD` converts them from JSON-LD to an instance of `ReadResourcesSequence`.
Before passing the JSON-LD data to `ConvertJSONLD`, the prefixes have to be expanded using the JSON-LD processor.

```javascript
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

```javascript
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
To facilitate this process and minimize the number of requests to be sent to Knora, the ``OntologyCacheService`` gets whole ontologies from Knora each time it encounters an unknown entity and caches them.
Once stored in  the cache, the `OntologyCacheService` can serve the information without doing an additional request to Knora.


