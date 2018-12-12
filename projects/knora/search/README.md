# Knora-ui search
[![npm (scoped)](https://img.shields.io/npm/v/@knora/search.svg)](https://www.npmjs.com/package/@knora/search)

This module is part of [Knora-ui](https://github.com/dhlab-basel/Knora-ui) modules, developed by the team at the [DHLab Basel](http://dhlab.unibas.ch).

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
 - @angular/common@6.0.0
 - @angular/core@6.0.0
 - @knora/core@6.0.0
 - @knora/viewer@6.0.0-alpha
 - jdnconvertiblecalendardateadapter@0.0.7
 

## Components
This module contains various components:

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


## Setup

Import the search module in your app.module.ts and add it to the NgModules's imports:

```TypeScript
import { AppComponent } from './app.component';
import { KuiSearchModule } from '@knora/core';

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
