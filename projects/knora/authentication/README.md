# Knora-ui authentication
![npm (scoped)](https://img.shields.io/npm/v/@knora/authentication.svg)

This module is part of [Knora-ui](https://github.com/dhlab-basel/Knora-ui) modules, developed by the team at the [DHLab Basel](http://dhlab.unibas.ch).

The authentication module contains the login form (for standalone usage) or a complete login- / logout-button environment incl. the login form.

## Install
This module needs the configuration setup from [@knora/core](https://www.npmjs.com/package/@knora/core) which should also be installed.

`$ yarn add @knora/authentication @knora/core moment`

OR

`$ npm install @knora/authentication @knora/core moment`

## Setup
In your AppModule you have to define the following providers:

```TypeScript
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


## Usage

The @knora/authentication module contains a guard class which will redirect a guest user to the login page. It can be used in the app routing as follow:

```TypeScript
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

The `LoginFormComponent` needs then only the `<kui-login-form></kui-login-form>` tag. It's also possible to define e navigation route, where the user will be redirected after successful login: `<kui-login-form [navigate]="'/dashboard'"></kui-login-form>`
