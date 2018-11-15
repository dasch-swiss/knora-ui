# Action module
![npm (scoped)](https://img.shields.io/npm/v/@knora/action.svg)

This module is part of [Knora-ui](https://github.com/dhlab-basel/Knora-ui) modules, developed by the team at the [DHLab Basel](http://dhlab.unibas.ch).

## Install
You can use either the npm or yarn command-line tool to install packages. Use whichever is appropriate for your project.

### NPM
`npm install --save @knora/action ts-md5@^1.2.4 jdnconvertiblecalendar@0.0.2 jdnconvertiblecalendardateadapter@0.0.7`

### Yarn
`yarn add @knora/action ts-md5@^1.2.4 jdnconvertiblecalendar@0.0.2 jdnconvertiblecalendardateadapter@0.0.7`

---


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
```HTML
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

---

## Directives


### Admin image
A attribute directive for images (`<img />`) to get a user avatar, which uses the service from gravatar.com and to set a project logo.

#### 1. html template for project logo
`<img kuiAdminImage [image]="url/to/image.ext" [type]="'project'" />`
 
#### 2. html template for user avatar
`<img kuiAdminImage [image]="user@domain.tld" [type]="'user'" />`

#### Feature in both types
- If no [image] is defined, a default image will be displayed.
- If the defined image is not found, a default error-image will be displayed.

### Existing Name
This directive checks a form field to see if the value is unique. For example username or project short-name should be unique. Therefore we use the ExistingNameDirective.

See the [Stackblitz example](https://stackblitz.com/edit/knora-existing-name?file=src%2Fapp%2Fapp.component.ts) how it works.


---

## Pipes

### Key
In case of an object, where you don't know the labels or in case of an array with no numeric index, you can use the Key pipe. 

For this array
```TypeScript
array = [];

// ... 

this.array['index-1'] = 'Value in index 1';
this.array['index-2'] = 'Value in index 2';
this.array['index-3'] = 'Value in index 3';

]
```
we can use it in the template as follow:

```HTML
<ul>
    <li *ngFor="let item of array | key">
        {{item.key}}: {{item.value}}
    </li>
</ul>
```

Which shows this list
*  index-1: Value in index 1
*  index-2: Value in index 2
*  index-3: Value in index 3

See the [Stackblitz example](https://stackblitz.com/edit/knora-key?file=src%2Fapp%2Fapp.component.html) how it works.
