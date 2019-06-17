# Knora-ui search module

[![npm (scoped)](https://img.shields.io/npm/v/@knora/search.svg)](https://www.npmjs.com/package/@knora/search)

This module is part of [Knora-ui](https://github.com/dhlab-basel/Knora-ui) modules, developed by the team at the [Data and Service Center for Humanities DaSCH](http://dasch.swiss).

Search module allows to make simple searches or extended searches in Knora. In extended search, resource class and its properties related to one specific ontology are selected to create your query.

## Prerequisites

For help getting started with a new Angular app, check out the [Angular CLI](https://cli.angular.io/).

For existing apps, follow these steps to begin using Knora-ui search.

## Install

You can use either the npm or yarn command-line tool to install packages. Use whichever is appropriate for your project in the examples below.

### Yarn

`$ yarn add @knora/search`

### NPM

`$ npm install --save @knora/search`

### Dependencies

This module has the following package dependencies, which you also have to install.

- @angular/common@7.2.7
- @angular/core@7.2.7
- @knora/core@8.0.0
- @knora/viewer@8.0.0
- jdnconvertiblecalendardateadapter@0.0.7

### Required version of Knora: 8.0.0

## Components

This module contains various components to search. The main component is the kui-search-panel, which contains the kui-fulltext-search, kui-extended-search and kui-expert-search. All of them can be used standalone or in combination in kui-search-panel.

### Search panel
Fully customizable panel. You can set the following parameters in kui-search-panel:

- route: string; url-route for search results
- filterbyproject: string; project iri to limit search results by project
- projectfilter: boolean; selection of all projects to filter by one of them
- advanced: boolean; additional menu with advanced / extended search
- expert: boolean;  additional menu with expert search / gravsearch "editor"

If everything is set to false or undefined the search-panel is a simple full-text search. [Read more](modules/search/search-panel)

### Full-text search (Deprecated)

`<kui-fulltext-search [route]="/search-results"></kui-fulltext-search>`

The parameter `route` defines the route where the search-results-component of the app is defined.

We suggest to define a route for the search-results in the app.routing

```typescript
        path: 'search',
        component: SearchComponent,         // --> Component with the search panel
        children: [
            {
                path: ':mode/:q/:project',
                component: SearchResultsComponent       // --> search results, in case of paramter filterByProject and/or projectFilter
            },
            {
                path: ':mode/:q',
                component: SearchResultsComponent
            }
        ]
```

### Extended / advanced search
Generic search filter tool to limit search results to ontology and resource class and / or properties. [Read more](modules/search/extended-search)

<!-- ### Expert search -->

<!--
### Search
It sets the simple search bar.
It contains all the methods to realise simple searches, keep in memory previous searches and reset the list of searches.

### Extended-search
It sets the extended search. Here you can search by ontology, ontology's resource and specify your search one or several properties.
For each property, it is possible to use operators such as 'exists', 'equal to', 'like', 'less than' etc. to search matches or specific values.

### Select-ontology
It manages the selection of an ontology.

### Select-resource
It manages the selection of a resource that is part of the selected ontology.

### Select-property
in the extended search form, it allows to select a property value (operator) for each property and set the value we are searching for.

For example: the property is 'like' / 'equal to' / 'greater than' etc.

-->

## Setup

Import the search module in your app.module.ts and add it to the NgModules's imports:

```typescript
import { AppComponent } from './app.component';
import { KuiSearchModule } from '@knora/search';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        KuiSearchModule
    ],
    providers: [ ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
```
