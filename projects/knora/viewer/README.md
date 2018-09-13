# Knora-ui viewer
<!-- // not yet published
![npm (scoped)](https://img.shields.io/npm/v/@knora/viewer.svg)
-->

This module is part of [Knora-ui](https://github.com/dhlab-basel/Knora-ui) modules, developed by the team at the [DHLab Basel](http://dhlab.unibas.ch).

The viewer module contains object components to show the resource class representations from Knora, the gui-elements for the property values and different kind of view frameworks.

## Install
This module needs the services from [@knora/core](https://www.npmjs.com/package/@knora/core) which should also be installed.
You can use either the npm or yarn command-line tool to install packages. Use whichever is appropriate for your project.

`$ yarn add @knora/viewer @knora/core`

OR

`$ npm install --save @knora/viewer @knora/core`



## Components
It has the following structure:

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
