## Projects service

This module is part of [Knora-ui core module](https://www.npmjs.com/package/%40knora%2Fcore), developed by the team at the [DHLab Basel](http://dhlab.unibas.ch).

### Usage
Please follow the README of [Knora-ui core module](https://www.npmjs.com/package/%40knora%2Fcore) first!

Then you can use the projects service as follow:

```
project: Project;

(...)

this.projectsService.getProjectByIri(iri)
    .subscribe(
        (result: Project) => {
            this.project = result;
        },
        (error: ApiServiceError) => {
            console.error(error);
        }
    );
```

### Already implemented methods

#### GET

##### `getAllProjects()`

returns a list of all projects

 * **Returns:** `Observable<Project[]>`

##### `getProjectByIri(iri: string)`

returns a project object

 * **Parameters:** `iri`: `string` 
 * **Returns:** `Observable<Project>`
 
##### `getProjectByShortname(shortname: string)`

returns a project object

* **Parameters:** `shortname`: `string`
* **Returns:** `Observable<Project>`

##### `getProjectByShortcode(shortcode: string)`

returns a project object

* **Parameters:** `shortcode`: `string`
* **Returns:** `Observable<Project>`

##### `getProjectMembersByIri(iri: string)`

returns all project members

 * **Parameters:** `iri`: `string` 
 * **Returns:** `Observable<User[]>`

##### `getProjectMembersByShortname(shortname: string)`

returns all project members

 * **Parameters:** `shortname`: `string`
 * **Returns:** `Observable<User[]>`
