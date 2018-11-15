# Knora-ui search
![npm (scoped)](https://img.shields.io/npm/v/@knora/search.svg)

This module is part of [Knora-ui](https://github.com/dhlab-basel/Knora-ui) modules, developed by the team at the [DHLab Basel](http://dhlab.unibas.ch).

Search module allows to make simple searches or extended searches in Knora. In extended search, resource class and its properties related to one specific ontology are selected to create your query.


## Install
This module needs the services from [@knora/core](https://www.npmjs.com/package/@knora/core) which should also be installed.
You can use either the npm or yarn command-line tool to install packages. Use whichever is appropriate for your project.

`$ yarn add @knora/search @knora/core @knora/viewer jdnconvertiblecalendar jdnconvertiblecalendardateadapter` 

OR

`$ npm install --save @knora/search @knora/core @knora/viewer jdnconvertiblecalendar jdnconvertiblecalendardateadapter`


## Components
This module contains various components:

### Search
It sets the simple search bar. 
It contains all the methods to realise simple searches, keep in memory previous searches and reset the list of searches. 

### Extended-search
It sets the extended search. Here you can search by ontology, ontology's resource and specify your search one or several properties. 
For each property, it is possible to use operators such as 'exists', 'equal to', 'like', 'less than' etc. to search matches or specific values.

#### Select-ontology
It manages the selection of an ontology.

#### Select-resource
It manages the selection of a resource that is part of the selected ontology.

#### Select-property
in the extended search form, it allows to select a property value (operator) for each property and set the value we are searching for.

For example: the property is 'like' / 'equal to' / 'greater than' etc.


## Setup

First step: Import the search module in your app.module.ts:

`import { KuiSearchModule } from '@knora/core';`

and add it to the NgModules's imports:

```TypeScript
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

## Usage

To set the search bar, you have to add a <kui-search> tag wherever you want in your template.
Customize the input '[route]' to match your own route:

For example in search.component.html:
`<kui-search [route]="'/modules/search'"></kui-search>`



<!--
The search module has the following structure:

# search

## extended-search
    - extended-search
    - select-ontology
    - select-property
        - specify-property-value
    - select-resource-class
-->

-->
