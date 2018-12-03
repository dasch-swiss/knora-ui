### projects/knora/core/src/lib/services/v2/incoming.service.ts


#### getIncomingRegions(resourceIRI, offset) 

Returns all incoming regions for a particular resource.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| resourceIRI | `string`  |  | &nbsp; |
| offset | `number`  |  | &nbsp; |




##### Returns


-  Observable of any



#### getStillImageRepresentationsForCompoundResource(resourceIri, offset) 

Returns all the StillImageRepresentations for the given resource, if any.
StillImageRepresentations link to the given resource via knora-base:isPartOf.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| resourceIri | `string`  | the Iri of the resource whose StillImageRepresentations should be returned. | &nbsp; |
| offset | `number`  | the offset to be used for paging. 0 is the default and is used to get the first page of results. | &nbsp; |




##### Returns


-  Observable of any



#### getIncomingLinksForResource(resourceIri, offset) 

Returns all incoming links for the given resource Iri
but incoming regions and still image representations.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| resourceIri | `string`  | the Iri of the resource whose incoming links should be returned. | &nbsp; |
| offset | `number`  | the offset to be used for paging. 0 is the default and is used to get the first page of results. | &nbsp; |




##### Returns


-  Observable of any




