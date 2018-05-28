# Knora-ui

This is the demo and developing environment for Knora ui modules, which will be published on [npm](https://www.npmjs.com/~knora).

The modules helps to create a graphical user interface for [Knora](https://knora.org) in a quick and simple way. They're written in [Angular](https://angular.io) (v6) including the [material design](https://material.angular.io).

Knora itself is a software framework for storing, sharing, and working with primary sources and data in the humanities.

It is developed by the [Digital Humanities Lab](http://dhlab.unibas.ch/) at the [University of Basel](https://unibas.ch/en.html), and is supported by the [Swiss Academy of Humanities and Social Sciences](http://www.sagw.ch/en/sagw.html).

Knora and the Knora ui elements is [free software](http://www.gnu.org/philosophy/free-sw.en.html), released under the [GNU Affero General Public License](http://www.gnu.org/licenses/agpl-3.0.en.html).


## Developers note
Good news: Angular 6 has a built-in [library support](https://github.com/angular/angular-cli/wiki/stories-create-library). Previous we built the library with the following setup:

We used [ng-packagr](https://github.com/dherges/ng-packagr) by following the [ng-packaged](https://github.com/dherges/ng-packaged)-example and this tutorial: https://medium.com/@nikolasleblanc/building-an-angular-4-component-library-with-the-angular-cli-and-ng-packagr-53b2ade0701e

### Install the demo app

```
$ cd knora-ui
$ yarn install --prod=false
& yarn build-lib
```

The demo app runs on http://localhost:4200 and we use it on this repository's [Github page](https://dhlab-basel.github.io/Knora-ui)


---

This repository replaces the [salsah-modules](https://github.com/dhlab-basel/salsah-modules).

