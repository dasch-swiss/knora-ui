import { JsonObject, JsonProperty } from 'json2typescript';

/**
 * @deprecated since v9.5.0
 *
 * This class has been moved to session.service in `@knora/core`.
 * Update your import path.
 *
 * currently logged-in user
 */
@JsonObject
export class CurrentUser {

    /**
     * username
     */
    @JsonProperty('name', String)
    public name: string = undefined;

    /**
     * json web token
     */
    @JsonProperty('jwt', String, true)
    public jwt: string = undefined;

    /**
     * language for the user interface
     */
    @JsonProperty('lang', String, true)
    public lang: string = undefined;

    /**
     * is system administrator?
     */
    @JsonProperty('sysAdmin', Boolean)
    public sysAdmin: boolean = undefined;

    /**
     * list of project shortcodes, where the user is project admin
     */
    @JsonProperty('projectAdmin', [String], true)
    public projectAdmin: string[] = undefined;

}
