# Action module
![npm (scoped)](https://img.shields.io/npm/v/@knora/action.svg)

This module is part of [Knora-ui](https://github.com/dhlab-basel/Knora-ui) modules, developed by the team at the [DHLab Basel](http://dhlab.unibas.ch).

## Install
You can use either the npm or yarn command-line tool to install packages. Use whichever is appropriate for your project.

### NPM
`npm install --save @knora/action`

### Yarn
`yarn add @knora/action`

## Components
This module contains various components:

### Progress indicator

You can use the progress indicator in two ways:

#### 1. classic loader
[Example and demo](https://stackblitz.com/edit/knora-progress-indicator)

`<kui-progress-indicator></kui-progress-indicator>`

#### 2. submit-form-data loader
[Example and demo](https://stackblitz.com/edit/knora-progress-indicator)

`<kui-progress-indicator [status]="status"></kui-progress-indicator>`

Status is a number:
* -1 => not ready
*  0 => is loading
*  1 => done

and in case of an error: the number is 400
