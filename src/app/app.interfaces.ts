import {JsonObject, JsonProperty} from 'json2typescript';

/**
 *
 */
@JsonObject
export class Item {

    @JsonProperty('name', String)
    public name: string = undefined;

    @JsonProperty('label', String)
    public label: string = undefined;
}

/**
 *
 */
@JsonObject
export class DemoModule {

    @JsonProperty('name', String)
    public name: string = undefined;

    @JsonProperty('label', String)
    public label: string = undefined;

    @JsonProperty('published', Boolean)
    public published: boolean = undefined;
}


/**
 *
 */
@JsonObject
export class ExampleCode {

    @JsonProperty('html', String, true)
    public html: string = undefined;


    @JsonProperty('ts', String, true)
    public ts: string = undefined;


    @JsonProperty('scss', String, true)
    public scss: string = undefined;
}

/**
 *
 */
@JsonObject
export class Example {

    @JsonProperty('name', String)
    public name: string = undefined;

    @JsonProperty('title', String)
    public title: string = undefined;

    @JsonProperty('subtitle', String)
    public subtitle: string = undefined;

    @JsonProperty('code', ExampleCode)
    public code: ExampleCode = undefined;

}
