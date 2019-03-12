# Knora-ui authentication module
[![npm (scoped)](https://img.shields.io/npm/v/@knora/authentication.svg)](https://www.npmjs.com/package/@knora/authentication)

This module is part of [Knora-ui](https://github.com/dhlab-basel/Knora-ui) modules, developed by the team at the [Data and Service Center for Humanities DaSCH](http://dasch.swiss).

The authentication module contains the login form (for standalone usage) or a complete login- / logout-button environment incl. the login form.

## Prerequisites
For help getting started with a new Angular app, check out the [Angular CLI](https://cli.angular.io/).

For existing apps, follow these steps to begin using Knora-ui authentication.

## Install
You can use either the npm or yarn command-line tool to install packages. Use whichever is appropriate for your project in the examples below.

### Yarn
`$ yarn add @knora/authentication`

### NPM

`$ npm install @knora/authentication`

### Dependencies
This module has the following package dependencies, which you also have to install.
 - @angular/common@7.2.7
 - @angular/core@7.2.7
 - @angular/animations@7.2.7
 - @angular/cdk@7.3.3
 - @angular/material@7.3.3
 - @knora/action@7.0.0
 - @knora/core@7.0.0
 - moment@2.22.2


## Setup
In your AppModule you have to define the following providers:

```Javascript
import { ErrorInterceptor, JwtInterceptor, KuiAuthenticationModule } from '@knora/authentication';

@NgModule({
    declarations: [
        ...
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule,
        KuiCoreModule.forRoot({
            name: 'Knora-ui Demo App',
            api: environment.api,
            media: environment.media,
            app: environment.app,
        }),
        KuiAuthenticationModule
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
    ]
})
export class AppModule { }
```


## Usage of KuiAuthGuard

The @knora/authentication module contains a guard class which can be used in a restricted app component and will redirect a guest user to the login page. It can be used in the app routing as follow:

```Javascript
import { AuthGuard } from '@knora/authentication';

const appRoutes: Routes = [
    {
        path: '',
        component: AppComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginFormComponent
    }
]

```

## Usage of kui-login-form

The `LoginFormComponent` in the app needs in principle only the `<kui-login-form></kui-login-form>` tag. Additional it's also possible to define e navigation route, where the user will be redirected after successful login: `<kui-login-form [navigate]="'/dashboard'"></kui-login-form>`
