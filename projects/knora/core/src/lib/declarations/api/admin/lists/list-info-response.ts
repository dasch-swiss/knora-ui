import { JsonObject, JsonProperty } from 'json2typescript';
import { ListInfo } from './list-info';

@JsonObject('ListInfoResponse')
export class ListInfoResponse {

    @JsonProperty('listinfo', ListInfo, false)
    public listinfo: ListInfo = undefined;
}


