# Action module
[![npm (scoped)](https://img.shields.io/npm/v/@knora/action.svg)](https://www.npmjs.com/package/@knora/action)

This module is part of [Knora-ui](https://github.com/dhlab-basel/Knora-ui) modules, developed by the team at the [DHLab Basel](http://dhlab.unibas.ch).

## Prerequisites
For help getting started with a new Angular app, check out the [Angular CLI](https://cli.angular.io/).

For existing apps, follow these steps to begin using Knora-ui authentication.

## Install
You can use either the npm or yarn command-line tool to install packages. Use whichever is appropriate for your project in the examples below.

### Yarn

`yarn add @knora/action`

### NPM
`npm install --save @knora/action`


### Dependencies
This module has the following package dependencies, which you also have to install.
 - @angular/common@6.0.0
 - @angular/core@6.0.0
 - @angular/animations@6.0.0
 - @angular/cdk@6.0.0
 - @angular/material@6.0.0
 - ts-md5@1.2.4
 - jdnconvertiblecalendar@0.0.2
 - jdnconvertiblecalendardateadapter@0.0.7
 

## Components
This module contains various components:

### Progress indicator

You can use the progress indicator in two ways:

1. classic loader
2. submit-form-data loader 

[Example and demo](https://dhlab-basel.github.io/Knora-ui/modules/action/progress-indicator)


### Sort button

The sort button helps to sort a list by a selected topic. The following setup is needed:

- sortProps is an array of {name, label} object and is needed for the selection.
- the sort button returns a sortKey which is needed in the list and the pipe called sortBy

[Example and demo](https://dhlab-basel.github.io/Knora-ui/modules/action/sort-button)


---


## Directives

### Admin image
A attribute directive for images (`<img />`) to get a user avatar, which uses the service from gravatar.com and to set a project logo. 

[Example and demo](https://dhlab-basel.github.io/Knora-ui/modules/action/admin-image)


### Existing Name
This directive checks a form field to see if the value is unique. For example username or project short-name should be unique. Therefore we use the ExistingNameDirective.

[Example and demo](https://dhlab-basel.github.io/Knora-ui/modules/action/existing-name)

[Stackblitz](https://stackblitz.com/edit/knora-existing-name?file=src%2Fapp%2Fapp.component.ts)


---


## Pipes

### Key
In case of an object, where you don't know the labels or in case of an array with no numeric index, you can use the Key pipe. 

[Example and demo](https://dhlab-basel.github.io/Knora-ui/modules/action/key)


### Sort by
The sortBy pipe is used to sort by a selected key. 

[Example and demo in sort button component](https://dhlab-basel.github.io/Knora-ui/modules/action/sort-button)