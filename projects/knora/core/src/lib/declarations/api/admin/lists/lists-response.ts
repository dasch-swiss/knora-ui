import { JsonObject, JsonProperty } from 'json2typescript';
import { List } from './list';

@JsonObject('ListsResponse')
export class ListsResponse {

    @JsonProperty('lists', [List], false)
    public lists: List[] = undefined;
}


