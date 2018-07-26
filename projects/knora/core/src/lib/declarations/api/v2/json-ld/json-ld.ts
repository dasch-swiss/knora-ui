import { JsonObject, JsonProperty } from 'json2typescript';
import { Graph } from './graph';
import { Context } from './context';


@JsonObject
export class JsonLd {

    @JsonProperty('@graph', Graph, true)
    public '@graph': Graph = undefined;


    @JsonProperty('@context', Context, true)
    public '@context': Context = undefined;
}
