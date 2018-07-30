# Knora-ui

This is the demo and developing environment for Knora ui modules, which will be published on [npm](https://www.npmjs.com/~knora).

The modules helps to create a graphical user interface for [Knora](https://knora.org) in a quick and simple way. They're written in [Angular](https://angular.io) (v6) including the [material design](https://material.angular.io).

Knora itself is a software framework for storing, sharing, and working with primary sources and data in the humanities.

It is developed by the [Digital Humanities Lab](http://dhlab.unibas.ch/) at the [University of Basel](https://unibas.ch/en.html), and is supported by the [Swiss Academy of Humanities and Social Sciences](http://www.sagw.ch/en/sagw.html).

Knora and the Knora ui elements is [free software](http://www.gnu.org/philosophy/free-sw.en.html), released under the [GNU Affero General Public License](http://www.gnu.org/licenses/agpl-3.0.en.html).


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

<!--
@knora/admin
<!-- ![npm (scoped)](https://img.shields.io/npm/v/@knora/admin.svg) --
* project (incl. ontology-editor)
* system
* user
* dashboard
* ontology_form incl. resource-class-form (new-/edit-resource-class)
* project_form
* user_form
* list_form

-->
