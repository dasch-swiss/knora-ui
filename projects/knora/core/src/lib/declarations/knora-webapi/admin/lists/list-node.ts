import {JsonObject, JsonProperty} from 'json2typescript';

@JsonObject
export class ListNode {
    @JsonProperty('id', String, false)
    public id: string = undefined;

    @JsonProperty('name', String, true)
    public name: string = undefined;

    @JsonProperty('label', String, true)
    public label: string = undefined;

    @JsonProperty('children', [ListNode], true)
    public children: ListNode[] = undefined;

    @JsonProperty('level', Number, true)
    public level: number = undefined;

    @JsonProperty('position', Number, true)
    public position: number = undefined;
}
