### projects/knora/core/src/lib/services/v2/ontology.service.ts


#### getOntologiesMetadata() 

Requests the metadata about all existing ontologies from Knora's ontologies route.






##### Returns


-  the metadata of all ontologies (Observable of ApiServiceResult).



#### getAllEntityDefinitionsForOntologies(ontologyIri) 

Requests all entity definitions for the given ontologies from Knora's ontologies route.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| ontologyIri | `string`  | the Iris of the named graphs whose resource classes are to be returned. | &nbsp; |




##### Returns


-  the requested ontology (Observable of ApiServiceResult).



#### getResourceClasses(resourceClassIris) 

Requests information about the given resource classes from Knora's ontologies route.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| resourceClassIris | `Array.<string>`  | the Iris of the resource classes to be queried. | &nbsp; |




##### Returns


-  the requested resource class definitions (Observable of ApiServiceResult).



#### getProperties(propertyIris) 

Requests properties from Knora's ontologies route.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| propertyIris | `Array.<string>`  | the Iris of the properties to be queried. | &nbsp; |




##### Returns


-  the requested properties (Observable of ApiServiceResult).




