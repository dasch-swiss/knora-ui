### projects/knora/core/src/lib/services/v2/convert-jsonld.ts


#### getPropertyNames(propName) 

Function to be passed to a filter used on an array of property names
sorting out all non value property names.

Gets all property names that refer to value objects.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| propName |  | the name of a property to be checked. | &nbsp; |




##### Returns


-  Boolean indicating if the name refers to a value property.



#### constructReadResource(resourceJSONLD) 

Constructs a [[ReadResource]] from JSON-LD.
Expects JSON-LD with all Iris fully expanded.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| resourceJSONLD | `object`  | an a resource and its properties serialized as JSON-LD. | &nbsp; |




##### Returns


-  ReadResource



#### createValueSpecificProp(propValue, propIri, standoffLinkValues) 

Constructs a [[ReadPropertyItem]] from JSON-LD,
taking into account the property's value type.
Expects JSON-LD with all Iris fully expanded.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| propValue | `Object`  | the value serialized as JSON-LD. | &nbsp; |
| propIri | `string`  | the Iri of the property. | &nbsp; |
| standoffLinkValues | `Array.<ReadLinkValue>`  | standoffLinkValues of the resource. Text values may contain links to other resources. | &nbsp; |




##### Returns


-  a [[ReadPropertyItem]] or `undefined` in case the value could not be processed correctly.



#### constructReadProperties(resourceJSONLD) 

Construct a [[ReadProperties]] from JSON-LD.
Expects JSON-LD with all Iris fully expanded.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| resourceJSONLD | `object`  | an object describing the resource and its properties. | &nbsp; |




##### Returns


-  ReadProperties



#### createReadResourcesSequenceFromJsonLD(resourcesResponseJSONLD) 

Turns an API response in JSON-LD representing a sequence of resources into a [[ReadResourcesSequence]].
Expects JSON-LD with all Iris fully expanded.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| resourcesResponseJSONLD | `object`  | a resource or a sequence of resources, represented as a JSON-LD object. | &nbsp; |




##### Returns


-  ReadResourcesSequence



#### getReferredResourceClasses(resourceJSONLD) 

Collects all the types (classes) of referred resources from a given resource (from its linking properties).
Expects JSON-LD with all Iris fully expanded.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| resourceJSONLD | `object`  | JSON-LD describing one resource. | &nbsp; |




##### Returns


-  string[] - an Array of resource class Iris (including duplicates).



#### getResourceClassesFromJsonLD(resourcesResponseJSONLD) 

Gets the resource types (classes) from a JSON-LD representing a sequence of resources.
Expects JSON-LD with all Iris fully expanded.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| resourcesResponseJSONLD |  | a sequence of resources, represented as a JSON-LD object. | &nbsp; |




##### Returns


-  string[] - the resource class Iris (without duplicates).




