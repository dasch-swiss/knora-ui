import { JsonObject, JsonProperty } from 'json2typescript';

import { StringLiteral } from '../../shared/strings';

/**
 * @deprecated since v9.5.0
 *
 * Use new model from `@knora/api` (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('Project')
export class Project {

    @JsonProperty('id', String)
    public id: string = undefined;

    @JsonProperty('shortname', String)
    public shortname: string = undefined;

    @JsonProperty('shortcode', String, true)
    public shortcode: string = undefined;

    @JsonProperty('longname', String, true)
    public longname: string = undefined;

    @JsonProperty('description', [StringLiteral], true)
    public description: StringLiteral[] = [new StringLiteral()];

    @JsonProperty('keywords', [String], true)
    public keywords: string[] = undefined;

    @JsonProperty('logo', String, true)
    public logo: string = undefined;

    @JsonProperty('institution', String, true)
    public institution: string = undefined;

    @JsonProperty('ontologies', [String])
    public ontologies: string[] = undefined;

    @JsonProperty('status', Boolean)
    public status: boolean = undefined;

    @JsonProperty('selfjoin', Boolean)
    public selfjoin: boolean = undefined;

}
