## Search service

### Usage
Please follow the README of [Knora-ui search module](https://www.npmjs.com/package/@knora/search) first!

Then you can use the following methods from `SearchService`:

### Search ([more details](https://www.npmjs.com/package/@knora/search#search))

#### onKey(search_ele, event) 

Do search on Enter click, reset search on Escape




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| search_ele |  |  | &nbsp; |
| event |  |  | &nbsp; |




##### Returns


-  void



#### doSearch(search_ele) 

Realise a simple search




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| search_ele |  |  | &nbsp; |




##### Returns


-  void



#### resetSearch(search_ele) 

Reset the search




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| search_ele |  |  | &nbsp; |




##### Returns


-  void



#### doPrevSearch(query) 

Realise a previous search




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| query |  |  | &nbsp; |




##### Returns


-  void



#### resetPrevSearch(name) 

Reset previous searches - the whole previous search or specific item by name




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| name |  |  | &nbsp; |




##### Returns


-  void



#### setFocus() 

Set simple focus to active






##### Returns


-  void



#### toggleMenu(name) 

Switch according to the focus between simple or extended search




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| name |  |  | &nbsp; |




##### Returns


-  void





### Extended-search ([more details](https://www.npmjs.com/package/@knora/search#extended-search))


#### addProperty() 

Add a property to the search form.






##### Returns


-  void



#### removeProperty() 

Remove the last property from the search form.






##### Returns


-  void



#### initializeOntologies() 

Gets all available ontologies for the search form.






##### Returns


-  void



#### getResourceClassesAndPropertiesForOntology(ontologyIri) 

Once an ontology has been selected, gets its classes and properties.
The classes and properties will be made available to the user for selection.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| ontologyIri |  | Iri of the ontology chosen by the user. | &nbsp; |




##### Returns


-  void



#### getPropertiesForResourceClass(resourceClassIri) 

Once a resource class has been selected, gets its properties.
The properties will be made available to the user for selection.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| resourceClassIri |  |  | &nbsp; |




##### Returns


-  void



#### resetForm() 

Resets the form (selected resource class and specified properties) preserving the active ontology.






##### Returns


- `Void`



#### submit() 

Creates a GravSearch query with the given form values and calls the extended search route.






##### Returns


- `Void`

