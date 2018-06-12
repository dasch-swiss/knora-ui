import {JsonObject, JsonProperty} from 'json2typescript';


@JsonObject
export class Graph {

    @JsonProperty('@id', String)
    public '@id': string = undefined;

    @JsonProperty('@type', String, true)
    public '@type': string = undefined;

    @JsonProperty('rdfs:label', String, true)
    public 'rdfs:label': string = undefined;

    @JsonProperty('rdfs:comment', String, true)
    public 'rdfs:comment': string = undefined;

    @JsonProperty('rdfs:subClassOf', Graph, true)
    public 'rdfs:subClassOf': Graph = undefined;

    @JsonProperty('rdfs:subPropertyOf', Graph, true)
    public 'rdfs:subPropertyOf': Graph = undefined;

    @JsonProperty('knora-api:attachedToProject', Graph, true)
    public 'knora-api:attachedToProject': Graph = undefined;

    @JsonProperty('knora-api:objectType', Graph, true)
    public 'knora-api:objectType': Graph = undefined;

    @JsonProperty('knora-api:subjectType', Graph, true)
    public 'knora-api:subjectType': Graph = undefined;

    @JsonProperty('knora-api:isEditable', Boolean, true)
    public 'knora-api:isEditable': boolean = undefined;

    @JsonProperty('knora-api:isResourceProperty', Boolean, true)
    public 'knora-api:isResourceProperty': boolean = undefined;

    @JsonProperty('knora-api:canBeInstantiated', Boolean, true)
    public 'knora-api:canBeInstantiated': boolean = undefined;



}

