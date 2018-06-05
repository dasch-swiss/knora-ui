# Progress indicator / loader
![npm (scoped)](https://img.shields.io/npm/v/@knora/progress-indicator.svg)

This module is part of [Knora-ui](https://github.com/dhlab-basel/Knora-ui) modules, developed by the team at the [DHLab Basel](http://dhlab.unibas.ch).

## Install
You can use either the npm or yarn command-line tool to install packages. Use whichever is appropriate for your project in the examples below.

### NPM
`npm install --save @knora/progress-indicator`

### Yarn
`yarn add @knora/progress-indicator`

## How to use
You can use the progress indicator in two ways:

### 1. classic loader
[Example and demo](https://stackblitz.com/edit/knora-progress-indicator)

`<kui-progress-indicator></kui-progress-indicator>`

### 2. submit-form-data loader
[Example and demo](https://stackblitz.com/edit/knora-progress-indicator)

`<kui-progress-indicator [status]="status"></kui-progress-indicator>`

Status is a number:
* -1 => not ready
*  0 => is loading
*  1 => done

and in case of an error: the number is 400
