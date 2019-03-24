# Knora-ui viewer module
[![npm (scoped)](https://img.shields.io/npm/v/@knora/viewer.svg)](https://www.npmjs.com/package/@knora/viewer)

This module is part of [Knora-ui](https://github.com/dhlab-basel/Knora-ui) modules, developed by the team at the [Data and Service Center for Humanities DaSCH](http://dasch.swiss).

The viewer module contains object components to show the resource class representations from Knora, the gui-elements for the property values and different kind of view frameworks.

**ATTENTION: Knora-ui viewer is under development!**

## Prerequisites
For help getting started with a new Angular app, check out the [Angular CLI](https://cli.angular.io/).

For existing apps, follow these steps to begin using Knora-ui viewer.

## Install
You can use either the npm or yarn command-line tool to install packages. Use whichever is appropriate for your project in the examples below.

### Yarn

`$ yarn add @knora/viewer`

### NPM
`$ npm install --save @knora/viewer`

### Dependencies
This module has the following package dependencies, which you also have to install.
*   @angular/common@7.2.7
*   @angular/core@7.2.7
*   @angular/material@7.3.3
*   @angular/cdk@7.3.3
*   @knora/core@7.0.0
*   @angular/animations@7.2.7
*   @angular/flex-layout@7.0.0-beta.22


## Setup

Import the viewer module in your app.module.ts and add it to the NgModules's imports:
 
```javascript
import { AppComponent } from './app.component';
import { KuiViewerModule } from '@knora/viewer';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        KuiViewerModule
    ],
    providers: [ ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
```

<!--
## Components
This module contains 3 main components:

### Resource
It manages the resource of an ontology for the view.

### Property
It manages the properties for the view (displaying data in function of their type like date, text, integer, boolean etc.).

### View
It builds views by combining resource and property components in a specific layout.


<!-- With this module, you can use the following components:
()


## resource
  - stillImage
  - movingImage
  - audio
  - ddd (3d / rti)
  - text (long texts stored in eXist-db)
  - document (various types of text documents like PDF, Word etc...)
  - collection
  - region
  - annotation
  - linkObj
  - object

## property
  - textValue
    - textValueAsString
    - textValueAsHtml
    - textValueAsXml
  - textfileValue
  - dateValue
  - integerValue
  - colorValue
  - decimalValue
  - uriValue
  - booleanValue
  - geometryValue
  - geonameValue
  - intervalValue
  - listValue
  - linkValue
  - externalResValue

## view
  - listView
  - gridView
  - tableView
  - resourceView
  - compareView
  - graphView
  - propertiesView -->
