### projects/knora/core/src/lib/services/admin/users.service.ts


#### getAllUsers() 

returns a list of all users






##### Returns


-  Observable of User[]



#### getUserByEmail(email) 

return an user object filtered by email




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| email | `string`  |  | &nbsp; |




##### Returns


-  Observable of User



#### getUserByIri(iri) 

return an user object filtered by iri




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| iri | `string`  |  | &nbsp; |




##### Returns


-  Observable of User



#### createUser(data) 

Add a new user.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| data | `any`  |  | &nbsp; |




##### Returns


-  Observable of User



#### addUserToProject(userIri, projectIri) 

Add an user to a project.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| userIri | `string`  |  | &nbsp; |
| projectIri | `string`  |  | &nbsp; |




##### Returns


-  Observable of User



#### addUserToProjectAdmin(userIri, projectIri) 

Add an user to an admin project.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| userIri | `string`  |  | &nbsp; |
| projectIri | `string`  |  | &nbsp; |




##### Returns


-  Observable of User



#### removeUserFromProjectAdmin(userIri, projectIri) 

Delete an user of an admin project.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| userIri | `string`  |  | &nbsp; |
| projectIri | `string`  |  | &nbsp; |




##### Returns


-  Observable of User



#### addUserToSystemAdmin(userIri, data) 

Add an user to the admin system




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| userIri | `string`  |  | &nbsp; |
| data | `any`  |  | &nbsp; |




##### Returns


-  Observable of User



#### activateUser(userIri) 

Active an user.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| userIri | `string`  |  | &nbsp; |




##### Returns


-  Observable of User



#### updateOwnPassword(userIri, oldPassword, newPassword) 

Update own password




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| userIri | `string`  |  | &nbsp; |
| oldPassword | `string`  |  | &nbsp; |
| newPassword | `string`  |  | &nbsp; |




##### Returns


-  Observable of User



#### updateUsersPassword(userIri, requesterPassword, newPassword) 

Update users password.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| userIri | `string`  |  | &nbsp; |
| requesterPassword | `string`  |  | &nbsp; |
| newPassword | `string`  |  | &nbsp; |




##### Returns


-  Observable of User



#### updateUser(userIri, data) 

Update user.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| userIri | `string`  |  | &nbsp; |
| data | `any`  |  | &nbsp; |




##### Returns


-  Observable of User



#### deleteUser(userIri) 

Delete user.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| userIri | `string`  |  | &nbsp; |




##### Returns


-  Observable of User



#### removeUserFromProject(userIri, projectIri) 

Remove an user from a project.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| userIri | `string`  |  | &nbsp; |
| projectIri | `string`  |  | &nbsp; |




##### Returns


-  Observable of User




