## Search service

### Usage
Please follow the README of [Knora-ui search module](https://www.npmjs.com/package/@knora/search) first!

Then you can use the following methods from `SearchService`:


### Extended-search ([more details](https://www.npmjs.com/package/@knora/search#extended-search))


#### addProperty() 

Add a property to the search form.






##### Returns


- `Void`



#### removeProperty() 

Remove the last property from the search form.






##### Returns


- `Void`



#### initializeOntologies() 

Gets all available ontologies for the search form.






##### Returns


- `Void`



#### getResourceClassesAndPropertiesForOntology(ontologyIri) 

Once an ontology has been selected, gets its classes and properties.
The classes and properties will be made available to the user for selection.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| ontologyIri | `string`  | Iri of the ontology chosen by the user. | &nbsp; |




##### Returns


- `Void`



#### getPropertiesForResourceClass(resourceClassIri) 

Once a resource class has been selected, gets its properties.
The properties will be made available to the user for selection.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| resourceClassIri | `string`  |  | &nbsp; |




##### Returns


- `Void`



#### resetForm() 

Resets the form (selected resource class and specified properties) preserving the active ontology.






##### Returns


- `Void`



#### submit() 

Creates a GravSearch query with the given form values and calls the extended search route.






##### Returns


- `Void`



