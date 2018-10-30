### projects/knora/core/src/lib/services/v2/ontology-cache.service.ts


#### new OntologyCacheError() 

Represents an error occurred in OntologyCacheService.






##### Returns


- `Void`



#### new OntologyMetadata() 

Represents an ontology's metadata.






##### Returns


- `Void`



#### OntologyMetadata.constructor(id, label) 






##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| id |  | Iri identifying the ontology. | &nbsp; |
| label |  | a label describing the ontology. | &nbsp; |




##### Returns


- `Void`



#### new Cardinality() 

Cardinality of a property for the given resource class.






##### Returns


- `Void`



#### Cardinality.constructor(occurrence, value, property) 






##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| occurrence |  | type of given occurrence. | &nbsp; |
| value |  | numerical value of given occurrence. | &nbsp; |
| property |  | the property the given occurrence applies to. | &nbsp; |




##### Returns


- `Void`



#### new ResourceClass() 

A resource class definition.






##### Returns


- `Void`



#### ResourceClass.constructor(id, icon, comment, label, cardinalities) 






##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| id |  | Iri identifying the resource class. | &nbsp; |
| icon |  | path to an icon representing the resource class. | &nbsp; |
| comment |  | comment on the resource class. | &nbsp; |
| label |  | label describing the resource class. | &nbsp; |
| cardinalities |  | the resource class's properties. | &nbsp; |




##### Returns


- `Void`



#### new ResourceClasses() 

A map of resource class Iris to resource class definitions.






##### Returns


- `Void`



#### new Property() 

A property definition.






##### Returns


- `Void`



#### Property.constructor(id, objectType, comment, label, subPropertyOf, isEditable, isLinkProperty, isLinkValueProperty) 






##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| id | `string`  | Iri identifying the property definition. | &nbsp; |
| objectType | `string`  | the property's object constraint. | &nbsp; |
| comment | `string`  | comment on the property definition. | &nbsp; |
| label | `string`  | label describing the property definition. | &nbsp; |
| subPropertyOf | `Array.<string>`  | Iris of properties the given property is a subproperty of. | &nbsp; |
| isEditable | `boolean`  | indicates whether the given property can be edited by the client. | &nbsp; |
| isLinkProperty | `boolean`  | indicates whether the given property is a linking property. | &nbsp; |
| isLinkValueProperty | `boolean`  | indicates whether the given property refers to a link value. | &nbsp; |




##### Returns


- `Void`



#### new Properties() 

A map of property Iris to property definitions.






##### Returns


- `Void`



#### new ResourceClassIrisForOntology() 

Groups resource classes by the ontology they are defined in.

A map of ontology Iris to an array of resource class Iris.






##### Returns


- `Void`



#### new OntologyCache() 

Represents cached ontology information (only used by this service internally).
This cache is updated whenever new definitions are requested from Knora.

Requested ontology information by a service is represented by [[OntologyInformation]].






##### Returns


- `Void`



#### OntologyCache.ontologies() 

An array of all existing ontologies.






##### Returns


- `Void`



#### OntologyCache.resourceClassIrisForOntology() 

A list of all resource class Iris for a named graph.






##### Returns


- `Void`



#### OntologyCache.resourceClasses() 

Resource class definitions.






##### Returns


- `Void`



#### OntologyCache.properties() 

Property definitions.






##### Returns


- `Void`



#### new OntologyInformation() 

Represents ontology information requested from this service.

For every request, an instance of this class is returned containing the requested information.






##### Returns


- `Void`



#### OntologyInformation.constructor(resourceClassesForOntology, resourceClasses, properties) 






##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| resourceClassesForOntology | `ResourceClassIrisForOntology`  | all resource class Iris for a given ontology. | &nbsp; |
| resourceClasses | `ResourceClasses`  | resource class definitions. | &nbsp; |
| properties | `Properties`  | property definitions. | &nbsp; |




##### Returns


- `Void`



#### OntologyInformation.updateOntologyInformation(ontologyInfo) 

Merge the given [[OntologyInformation]] into the current instance,
updating the existing information.
This is necessary when a service like the search fetches new results
that have to be added to an existing collection.
The existing ontology information must not be lost.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| ontologyInfo | `OntologyInformation`  | the given definitions that have to be integrated. | &nbsp; |




##### Returns


-  void



#### OntologyInformation.getResourceClassForOntology() 

Returns resource class definitions for ontologies.






##### Returns


- `ResourceClassIrisForOntology`  all resource class definitions grouped by ontologies.



#### OntologyInformation.getResourceClasses() 

Returns all resource classes as an object.






##### Returns


- `ResourceClasses`  all resource class definitions as an object.



#### OntologyInformation.getResourceClassesAsArray() 

Returns all resource classes as an array.






##### Returns


-  Array<ResourceClass>



#### OntologyInformation.getLabelForResourceClass(resClass) 

Returns a resource class's label.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| resClass | `string`  | resource class to query for. | &nbsp; |




##### Returns


- `string`  the resource class's label.



#### OntologyInformation.getProperties() 

Returns all properties as an object.






##### Returns


- `Properties`  all properties as an object.



#### OntologyInformation.getPropertiesAsArray() 

Returns all properties as an array.






##### Returns


-  Array<Property> - all properties as an array.



#### OntologyInformation.getLabelForProperty(property) 

Returns a property's label.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| property | `string`  | to query for. | &nbsp; |




##### Returns


- `string`  the property's label.



