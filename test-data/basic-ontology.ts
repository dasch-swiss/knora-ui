import {JsonObject, JsonProperty} from 'json2typescript';
import {PropertyItem} from '@knora/core';

/**
 * has four default categories and four groups
 * @Category
 * none:    no permission (the resource or the property will be hidden for the specified group)
 * read:    permission to see the property/value
 * comment: permission to comment/annotate a value
 * edit:    permission to create and edit a value
 * delete:  permission to delete a value
 *
 * @Group
 * world:   every visitor
 * guest:   logged in knora user
 * user:    logged in project user
 * admin:   logged in project (or system) admin user
 */
@JsonObject
export class Permissions {

    @JsonProperty('everyone', String)
    public everyone: string = undefined;

    @JsonProperty('guest', String)
    public guest: string = undefined;

    @JsonProperty('member', String)
    public member: string = undefined;

    @JsonProperty('admin', String)
    public admin: string = undefined;
}

@JsonObject
export class Gui {

    @JsonProperty('element', String)
    public element: string = undefined;

    @JsonProperty('type', String)
    public type: string = undefined;

    @JsonProperty('list_id', String, true)
    public list_id: string = undefined;

}

@JsonObject
export class Property {

    @JsonProperty('label', String)
    public label: string = undefined;

    @JsonProperty('cardinality', String)
    public cardinality: string = undefined;

    @JsonProperty('gui', Gui)
    public gui: Gui = undefined;

    /**
     * Permission for the each property
     * @type {Permissions}
     */
    @JsonProperty('permissions', Permissions, true)
    public permissions: Permissions = undefined;

}

/**
 * the class includes the default properties as an array. The property id is the key in the array
 */

@JsonObject
export class ResourceClass {

    @JsonProperty('id', String, true)
    public id: string = undefined;

    @JsonProperty('label', String)
    public label: string = undefined;

    @JsonProperty('description', String)
    public description: string = undefined;

    @JsonProperty('icon', String)
    public icon: string = undefined;

    @JsonProperty('file', String, true)
    public file: string = undefined;

    /**
     * Permission for the resource
     * @type {Permissions}
     */
    @JsonProperty('permissions', Permissions, true)
    public permissions: Permissions = undefined;

    @JsonProperty('properties', [PropertyItem], true)
    public properties: PropertyItem[] = undefined;

}

/**
 * is an array of resource classes. The id of the resource class is the key in the array
 */

@JsonObject
export class BasicOntology {

    // defaultProperties
    @JsonProperty('defaultProperties', [PropertyItem])
    public defaultProperties: PropertyItem[] = undefined;

    // defaultPermissions
    @JsonProperty('defaultPermissions', Permissions, true)
    public defaultPermissions: Permissions = undefined;

    // defaultResourceClasses
    @JsonProperty('resourceClasses', [ResourceClass])
    public resourceClasses: ResourceClass[] = undefined;

}

@JsonObject
export class PropertyObject {
    @JsonProperty('key', String)
    public key: string = undefined;

    @JsonProperty('value', Property)
    public value: Property = undefined;
}
