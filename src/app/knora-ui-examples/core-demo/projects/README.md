## Projects service

This module is part of [Knora-ui core module](https://www.npmjs.com/package/%40knora%2Fcore), developed by the team at the [DHLab Basel](http://dhlab.unibas.ch).

### Usage
Please follow the README of [Knora-ui core module](https://www.npmjs.com/package/%40knora%2Fcore) first!

Then you can use the following methods from `ProjectsService`:


#### getAllProjects() 

returns a list of all projects






##### Returns


- `Observable.<Array.<Project>>`  



#### getProjectByIri(iri) 

returns a project object




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| iri | `string`  |  | &nbsp; |




##### Returns


- `Observable.<Project>`  



#### getProjectByShortname(shortname) 

returns a project object




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| shortname | `string`  |  | &nbsp; |




##### Returns


- `Observable.<Project>`  



#### getProjectByShortcode(shortcode) 

returns a project object




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| shortcode | `string`  |  | &nbsp; |




##### Returns


- `Observable.<Project>`  



#### getProjectMembersByIri(iri) 

returns all project members




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| iri | `string`  |  | &nbsp; |




##### Returns


- `Observable.<Array.<User>>`  



#### getProjectMembersByShortname(shortname) 

returns all project members




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| shortname | `string`  |  | &nbsp; |




##### Returns


- `Observable.<Array.<User>>`  



#### createProject(data) 

create new project




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| data |  |  | &nbsp; |




##### Returns


- `Observable.<Project>`  



#### updateProject(iri, data) 

edit project data




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| iri | `string`  |  | &nbsp; |
| data |  |  | &nbsp; |




##### Returns


- `Observable.<Project>`  



#### activateProject(iri) 

activate project (if it was deleted)




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| iri | `string`  |  | &nbsp; |




##### Returns


- `Observable.<Project>`  



#### deleteProject(iri) 

Delete (set inactive) project




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| iri | `string`  |  | &nbsp; |




##### Returns


- `Observable.<Project>`  

