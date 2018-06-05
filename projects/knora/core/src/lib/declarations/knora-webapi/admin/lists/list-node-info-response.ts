import {JsonObject, JsonProperty} from 'json2typescript';
import {ListNodeInfo} from './list-node-info';

@JsonObject
export class ListNodeInfoResponse {

    @JsonProperty('nodeinfo', ListNodeInfo, false)
    public nodeinfo: ListNodeInfo = undefined;
}


