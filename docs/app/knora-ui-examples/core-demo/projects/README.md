### projects/knora/core/src/lib/services/admin/projects.service.ts


#### getAllProjects() 

returns a list of all projects






##### Returns


-  Observable of Project[]



#### getProjectByIri(iri) 

returns a project object




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| iri | `string`  |  | &nbsp; |




##### Returns


-  Observable of Project



#### getProjectByShortname(shortname) 

returns a project object




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| shortname | `string`  |  | &nbsp; |




##### Returns


-  Observable of Project



#### getProjectByShortcode(shortcode) 

returns a project object




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| shortcode | `string`  |  | &nbsp; |




##### Returns


-  Observable of Project



#### getProjectMembersByIri(iri) 

returns all project members




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| iri | `string`  |  | &nbsp; |




##### Returns


-  Observable of User[]



#### getProjectMembersByShortname(shortname) 

returns all project members




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| shortname | `string`  |  | &nbsp; |




##### Returns


-  Observable of User[]



#### createProject(data) 

create new project




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| data | `any`  |  | &nbsp; |




##### Returns


-  Observable of Project



#### updateProject(iri, data) 

edit project data




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| iri | `string`  |  | &nbsp; |
| data | `any`  |  | &nbsp; |




##### Returns


-  Observable of Project



#### activateProject(iri) 

activate project (if it was deleted)




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| iri | `string`  |  | &nbsp; |




##### Returns


-  Observable of Project



#### deleteProject(iri) 

Delete (set inactive) project




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| iri | `string`  |  | &nbsp; |




##### Returns


-  Observable of Project




