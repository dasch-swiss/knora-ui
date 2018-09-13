# Knora-ui

[![CircleCI](https://circleci.com/gh/dhlab-basel/Knora-ui.svg?style=svg)](https://circleci.com/gh/dhlab-basel/Knora-ui)
[![Build Status](https://travis-ci.com/dhlab-basel/Knora-ui.svg?branch=develop)](https://travis-ci.com/dhlab-basel/Knora-ui)

This is the demo and developing environment for Knora ui modules.

The modules helps to create a graphical user interface for [Knora](https://knora.org) in a quick and simple way. They're written in [Angular](https://angular.io) (v6) including the [material design](https://material.angular.io).

Knora itself is a software framework for storing, sharing, and working with primary sources and data in the humanities.

It is developed by the [Digital Humanities Lab](http://dhlab.unibas.ch/) at the [University of Basel](https://unibas.ch/en.html), and is supported by the [Swiss Academy of Humanities and Social Sciences](http://www.sagw.ch/en/sagw.html).

Knora and the Knora ui elements is [free software](http://www.gnu.org/philosophy/free-sw.en.html), released under the [GNU Affero General Public License](http://www.gnu.org/licenses/agpl-3.0.en.html).

## Already published modules

### @knora/core
![npm (scoped)](https://img.shields.io/npm/v/@knora/core.svg) 

The core module contains every service to use Knora's RESTful webapi.


### @knora/authentication
![npm (scoped)](https://img.shields.io/npm/v/@knora/authentication.svg)

The authentication module contains the login form (for standalone usage) or a complete login- / logout-button environment incl. the login form.



### @knora/search 
![npm (scoped)](https://img.shields.io/npm/v/@knora/search.svg)

Search module allows to make simple searches or extended searches in Knora. In extended search, resource class and its properties related to one specific ontology are selected to create your query.

### @knora/viewer 
![npm (scoped)](https://img.shields.io/npm/v/@knora/viewer.svg)

The viewer module contains object components to show the resource class representations from Knora, the gui-elements for the property values and different kind of view frameworks.

### @knora/action 
![npm (scoped)](https://img.shields.io/npm/v/@knora/action.svg)

The action module contains special buttons (e.g. to sort a list), pipes and directives.


## Developers note
Good news: Angular 6 has a built-in [library support](https://github.com/angular/angular-cli/wiki/stories-create-library). Previous we built the library with the following setup:

We used [ng-packagr](https://github.com/dherges/ng-packagr) by following the [ng-packaged](https://github.com/dherges/ng-packaged)-example and this tutorial: https://medium.com/@nikolasleblanc/building-an-angular-4-component-library-with-the-angular-cli-and-ng-packagr-53b2ade0701e

Now we can create a library module quite easy. Please use the following command schema:

`$ ng generate library @knora/[module-name] --prefix=kui`

If you want to add more components, services and so on to this library, you can do it with:

`$ ng generate component [path/in/your/module/][name-of-component] --project @knora/[module-name]`

It puts the component or the service into `lib/` directly. Otherwise you can define a path inside of `lib/`.

### Install the demo app

```
$ cd knora-ui

$ yarn install --prod=false

$ rm -rf dist/@knora
$ yarn build-lib
```

The demo app runs on http://localhost:4200 and we use it on this repository's [Github page](https://dhlab-basel.github.io/Knora-ui)

### Developing modules

To create new e.g. component inside existing module use the following command:

`$ ng g c [component-name] --project @knora/[module-name] --styleext scss`

---

## Knora module structure

@knora/core
<!-- ![npm (scoped)](https://img.shields.io/npm/v/@knora/core.svg) -->
* services (for API requests)
* constants & utils (to work with Knora)

@knora/action
<!-- ![npm (scoped)](https://img.shields.io/npm/v/@knora/action.svg) -->
* buttons & buttons
* progress-indicator
* progress-stepper
* message
* directives & pipes
* dialog

@knora/authentication
<!-- ![npm (scoped)](https://img.shields.io/npm/v/@knora/authentication.svg) -->
* login
* logout

@knora/search
<!-- ![npm (scoped)](https://img.shields.io/npm/v/@knora/search.svg) -->
* search results
* search panel incl. search action (like adding a collection)

@knora/viewer
<!-- ![npm (scoped)](https://img.shields.io/npm/v/@knora/viewer.svg) -->
* object viewer (incl. video, audio, image)
* properties (as form elements)
* resource_class_form

<!-- ---

## Unit Testing Services

Testing services with HttpClient and HttpTestingController

* Then a test expects that certain requests have or have not been made, performs assertions against those requests, and finally provide responses by "flushing" each expected request.
https://angular.io/guide/http#testing-http-requests
* See https://stackblitz.com/edit/angular-uy5cdl?file=src%2Fapp%2Fheroes%2Fheroes.service.spec.ts for a working example.

 ```
 getAllHeroes (): Observable<any[]> {
    const observables = [];

    for (let i = 0; i <= 2; i++) {
      observables.push(
        this.http.get<Hero[]>(this.heroesUrl)
        .pipe(
          catchError(this.handleError('getAllHeroes', []))
      )
      );
    }

    return forkJoin(observables);

  }
  ``` 

* Several http requests are created and pushed on an array, then they are passed to forkJoin and returned. With forkJoin, we get one Observable that we can subscribe to (executed once all Observables have been completed). Then we get the results of all Observables from within the subscription to the Observable returned by forkJoin.

```
 it('should get all heroes', () => {

      let res = heroService.getAllHeroes();   

      res.subscribe(
        (obs) => { 

          console.log("test")

          expect(obs[0]).toEqual(expectedHeroes, 'should return expected heroes');
          expect(obs[1]).toEqual(expectedHeroes, 'should return expected heroes');
          expect(obs[2]).toEqual(expectedHeroes, 'should return expected heroes');
        }, fail
      );

      // HeroService should have made three requests to GET heroes from expected URL
      const req = httpTestingController.match(
        (request) => {
          return request.url === heroService.heroesUrl && request.method === 'GET'
        }
      );

      // Respond with the mock heroes
      expect(req.length).toEqual(3);

      req[0].flush(expectedHeroes)
      req[1].flush(expectedHeroes)
      req[2].flush(expectedHeroes)

    });
```

* The clue is that for each http request made, a response has to be "flushed". Otherwise the subscription to the Observable returned by forkJoin is never executed:
If an inner observable does not complete forkJoin will never emit a value!
https://www.learnrxjs.io/operators/combination/forkjoin.html

> This is why the subscription never worked, because we did not flush all necessary responses. -->
