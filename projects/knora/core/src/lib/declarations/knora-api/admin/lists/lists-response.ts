import {JsonObject, JsonProperty} from 'json2typescript';
import {List} from './list';

@JsonObject
export class ListsResponse {

    @JsonProperty('lists', [List], false)
    public lists: List[] = undefined;
}


