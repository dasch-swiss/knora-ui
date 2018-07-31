# Knora-ui authentication
![npm (scoped)](https://img.shields.io/npm/v/@knora/authentication.svg)

This module is part of [Knora-ui](https://github.com/dhlab-basel/Knora-ui) modules, developed by the team at the [DHLab Basel](http://dhlab.unibas.ch).

The authentication module contains the login form (for standalone usage) or a complete login- / logout-button environment incl. the login form.

## Install
`$ yarn add @knora/authentication moment`

OR

`$ npm install @knora/authentication moment`


## Setup
Import the authentication module in your app.module.ts 

`import {KuiAuthenicationModule} from '@knora/authentication';`


## Usage

You can use the login form as follow:

`<kui-login-form></kui-login-form>`

This standalone form is in an early beta state. Right now you should define the route, where the app should navigate after login.


`<kui-login-form [navigate]="'/'"></kui-login-form>`

Or use the complete solution with login-button (when no user is logged-in), logout-button (when a user is logged-in) and with the login-form:

`<kui-authentication></kui-authentication>`
