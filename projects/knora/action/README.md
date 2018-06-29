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
[Example and demo](https://stackblitz.com/edit/knora-progress-indicator?file=src%2Fapp%2Fapp.component.html)

`<kui-progress-indicator></kui-progress-indicator>`

#### 2. submit-form-data loader
[Example and demo](https://stackblitz.com/edit/knora-progress-indicator?file=src%2Fapp%2Fapp.component.html)

This kind of progress indicator needs the Angular Material Icons. So you have to import them into your app first by using the style file and adding the following line:
`@import url('https://fonts.googleapis.com/icon?family=Material+Icons');`

Then you can use the progress indicator in your template as follow:

`<kui-progress-indicator [status]="status"></kui-progress-indicator>`

Status is a number:
* -1 => not ready
*  0 => is loading
*  1 => done

and in case of an error: the number is 400

### Sort button

[Example and Demo](https://stackblitz.com/edit/knora-sort-button?file=src%2Fapp%2Fapp.component.html)

The sort button helps to sort a list by a selected topic. The following setup is needed:

- sortProps is an array of {name, label} object and is needed for the selection.
- the sort button returns a sortKey which is needed in the list and the pipe called sortBy

#### html template
```
<kui-sort-button [sortProps]="sortProps"
                 [(sortKey)]="sortKey">
</kui-sort-button>

<ul>
    <li *ngFor="let item of list | sortBy: sortKey">
        <span [class.active]="sortKey === 'prename'">
            {{item.prename}}
        </span>
        <span [class.active]="sortKey === 'lastname'">
            {{item.lastname}}
        </span>
        by 
        <span [class.active]="sortKey === 'creator'">
            {{item.creator}}
        </span>
    </li>
</ul>
```

#### Options
It's possible to set the position of the sort button to right side.
<kui-sort-button [sortProps]="sortProps"
                 [(sortKey)]="sortKey"
                 [position]="'right'">
</kui-sort-button>

### Admin image
A attribute directive for images (`<img />`) to get a user avatar, which uses the service from gravatar.com and to set a project logo.

#### 1. html template for project logo
<img kuiAdminImage [image]="url/to/image.ext" [type]="'project'" />
 
#### 2. html template for user avatar
<img kuiAdminImage [image]="user@domain.tld" [type]="'user'" />

#### Feature in both types
- If no [image] is defined, a default image will be displayed.
- If the defined image is not found, a default error-image will be displayed.