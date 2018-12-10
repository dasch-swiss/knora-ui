# Knora-ui viewer
[![npm (scoped)](https://img.shields.io/npm/v/@knora/viewer.svg)](https://www.npmjs.com/package/@knora/viewer)

This module is part of [Knora-ui](https://github.com/dhlab-basel/Knora-ui) modules, developed by the team at the [DHLab Basel](http://dhlab.unibas.ch).

The viewer module contains object components to show the resource class representations from Knora, the gui-elements for the property values and different kind of view frameworks.

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
 - @angular/common@6.0.0
 - @angular/core@6.0.0
 - @angular/material@6.0.0
 - @angular/animations@6.0.0"
 - @angular/cdk@6.0.0
 - @knora/core@6.0.0



## Components
With this module, you can use the following components:
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
  - propertiesView