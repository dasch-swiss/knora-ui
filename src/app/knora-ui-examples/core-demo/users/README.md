## UsersService

### Usage
Please follow the README of [Knora-ui core module](https://www.npmjs.com/package/%40knora%2Fcore) first!

Then you can use the following methods from `UsersService`:

#### getAllUsers() 

returns a list of all users


##### Returns

- `Observable.<Array.<User>>`  


#### getUserByEmail(email) 

##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| email | `string`  |  | &nbsp; |

##### Returns

- `Observable.<User>`  

#### getUserByIri(iri) 


##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| iri | `string`  |  | &nbsp; |

##### Returns

- `Observable.<User>`  


#### createUser(data) 

##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| data |  |  | &nbsp; |

##### Returns

- `Observable.<User>`  



#### addUserToProject(userIri, projectIri) 

##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| userIri | `string`  |  | &nbsp; |
| projectIri | `string`  |  | &nbsp; |

##### Returns

- `Observable.<User>`  



#### addUserToProjectAdmin(userIri, projectIri) 






##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| userIri | `string`  |  | &nbsp; |
| projectIri | `string`  |  | &nbsp; |




##### Returns


- `Observable.<User>`  



#### removeUserFromProjectAdmin(userIri, projectIri) 






##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| userIri | `string`  |  | &nbsp; |
| projectIri | `string`  |  | &nbsp; |




##### Returns


- `Observable.<User>`  



#### addUserToSystemAdmin(userIri, data) 






##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| userIri | `string`  |  | &nbsp; |
| data |  |  | &nbsp; |




##### Returns


- `Observable.<User>`  



#### activateUser(userIri) 






##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| userIri | `string`  |  | &nbsp; |




##### Returns


- `Observable.<User>`  



#### updateOwnPassword(userIri, oldPassword, newPassword) 

Update own password




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| userIri | `string`  |  | &nbsp; |
| oldPassword | `string`  |  | &nbsp; |
| newPassword | `string`  |  | &nbsp; |




##### Returns


- `Observable.<User>`  



#### updateUser(userIri, data) 






##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| userIri | `string`  |  | &nbsp; |
| data |  |  | &nbsp; |




##### Returns


- `Observable.<User>`  



#### deleteUser(userIri) 






##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| userIri | `string`  |  | &nbsp; |




##### Returns


- `Observable.<User>`  



#### removeUserFromProject(userIri, projectIri) 






##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| userIri | `string`  |  | &nbsp; |
| projectIri | `string`  |  | &nbsp; |




##### Returns


- `Observable.<User>`  



#### authenticate() 

Checks if the user is logged in or not.






##### Returns


- `Observable.<boolean>`  



#### login(email, password) 






##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| email | `string`  |  | &nbsp; |
| password | `string`  |  | &nbsp; |




##### Returns


- `Observable.<any>`  



#### logout() 

Sends a logout request to the server and removes any variables.






##### Returns


- `Void`

