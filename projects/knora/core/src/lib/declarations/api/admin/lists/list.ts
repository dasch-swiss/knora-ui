import { JsonObject, JsonProperty } from 'json2typescript';
import { ListInfo } from './list-info';
import { ListNode } from './list-node';

@JsonObject('List')
export class List {

    @JsonProperty('listinfo', ListInfo, false)
    public listinfo: ListInfo = undefined;

    @JsonProperty('children', [ListNode], false)
    public children: ListNode[] = undefined;
}


