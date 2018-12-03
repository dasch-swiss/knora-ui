### projects/knora/core/src/lib/services/v2/search.service.ts


#### doFulltextSearch(searchTerm, offset) 

Perform a fulltext search.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| searchTerm | `string`  | the term to search for. | &nbsp; |
| offset | `number`  | the offset to be used (for paging, first offset is 0). | &nbsp; |




##### Returns


-  Observable of ApiServiceResult



#### doFulltextSearchCountQuery(searchTerm) 

Perform a fulltext search count query.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| searchTerm | `string`  | the term to search for. | &nbsp; |




##### Returns


-  Observable of ApiServiceResult



#### doExtendedSearch(sparqlString) 

Perform an extended search.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| sparqlString | `string`  | the Sparql query string to be sent to Knora. | &nbsp; |




##### Returns


-  Observable of ApiServiceResult



#### doExtendedSearchCountQuery(sparqlString) 

Perform an extended search count query.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| sparqlString | `string`  | the Sparql query string to be sent to Knora. | &nbsp; |




##### Returns


-  Observable of ApiServiceResult



#### searchByLabel(searchTerm, resourceClassIRI, projectIri) 

Perform a search by a resource's rdfs:label.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| searchTerm | `string`  | the term to search for. | &nbsp; |
| resourceClassIRI | `string`  | restrict search to given resource class. | &nbsp; |
| projectIri | `string`  | restrict search to given project. | &nbsp; |




##### Returns


-  Observable of ApiServiceResult




