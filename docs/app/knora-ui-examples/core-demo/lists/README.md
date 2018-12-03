### projects/knora/core/src/lib/services/admin/lists.service.ts


#### getLists(projectIri) 

returns a list of all lists




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| projectIri | `string`  | (optional) | &nbsp; |




##### Returns


-  Observable of ListNodeInfo[]



#### getList(listIri) 

return a list object




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| listIri | `string`  |  | &nbsp; |




##### Returns


-  Observable of List



#### getListInfo(listIri) 

return a list info object




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| listIri | `string`  |  | &nbsp; |




##### Returns


-  Observable of ListInfo



#### getListNodeInfo(nodeIri) 

return a list node info object




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| nodeIri | `string`  |  | &nbsp; |




##### Returns


-  Observable of ListNodeInfo



#### createList(payload) 

create new list




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| payload | `ListCreatePayload`  |  | &nbsp; |




##### Returns


-  Observable of List



#### updateListInfo(payload) 

edit list data




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| payload | `ListInfoUpdatePayload`  |  | &nbsp; |




##### Returns


-  Observable of ListInfo




