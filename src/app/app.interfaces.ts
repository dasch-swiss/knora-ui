import {JsonObject, JsonProperty} from 'json2typescript';

@JsonObject
export class SortItem {

  @JsonProperty('name', String)
  public name: string = undefined;

  @JsonProperty('label', String)
  public label: string = undefined;
}

@JsonObject
export class DemoModule {

  @JsonProperty('name', String)
  public name: string = undefined;

  @JsonProperty('label', String)
  public label: string = undefined;

  @JsonProperty('published', Boolean)
  public published: boolean = undefined;
}
