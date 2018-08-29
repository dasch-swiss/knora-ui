import { JsonObject, JsonProperty } from 'json2typescript';
import { Graph } from './graph';
import { Context } from './context';


@JsonObject('JsonLd')
export class JsonLd {

    @JsonProperty('@graph', Graph, true)
    public '@graph': Graph = undefined;


    @JsonProperty('@context', Context, true)
    public '@context': Context = undefined;
}
