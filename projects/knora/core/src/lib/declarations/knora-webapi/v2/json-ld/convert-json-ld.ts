import {
    ReadBooleanValue,
    ReadColorValue,
    ReadDateValue,
    ReadDecimalValue,
    ReadGeomValue,
    ReadIntegerValue,
    ReadIntervalValue,
    ReadLinkValue,
    ReadListValue,
    ReadProperties,
    ReadPropertyItem,
    ReadResource,
    ReadResourcesSequence,
    ReadStillImageFileValue,
    ReadTextFileValue,
    ReadTextValueAsHtml,
    ReadTextValueAsString,
    ReadTextValueAsXml,
    ReadUriValue,
    ReferredResourcesByStandoffLink
} from '..';

import {Utils} from '../../../utils';
import {KnoraConstants} from '../../../knora-constants';

declare let require: any; // http://stackoverflow.com/questions/34730010/angular2-5-minute-install-bug-require-is-not-defined
let jsonld = require('jsonld');

export module ConvertJSONLD {

    /**
     * Construct a [[ReadResource]] from JSON-LD.
     *
     * @param resourceJSONLD an object describing the resource and its properties.
     * @param properties    a [[ReadProperties]] describing the resource's properties. if any.
     * @returns a [[ReadResource]]
     */
    function constructReadResource(resourceJSONLD: Object): ReadResource {

        const properties: ReadProperties = constructReadProperties(resourceJSONLD);

        return new ReadResource(
            resourceJSONLD['@id'],
            resourceJSONLD['@type'],
            resourceJSONLD[KnoraConstants.schemaName],
            [],
            [],
            [],
            [],
            properties
        );
    }

    /**
     * Constructs a [[ReadPropertyItem]] from JSON-LD.
     *
     * @param propValue the value serialized as JSON-LD.
     * @param propIri the Iri of the property.
     * @param standoffLinkValues standoffLinkValues of the resource.
     * @returns a [[ReadPropertyItem]] or `undefined` in case the value could not be processed correctly.
     */
    function createValueSpecificProp(propValue: Object, propIri: string, standoffLinkValues: ReadLinkValue[]): ReadPropertyItem | undefined {

        // convert a JSON-LD property value to a `ReadPropertyItem`

        let valueSpecificProp: ReadPropertyItem;

        // check for the property's value type
        switch (propValue['@type']) {
            case KnoraConstants.TextValue:
                // a text value might be given as plain string, html or xml.
                let textValue: ReadPropertyItem;

                if (propValue[KnoraConstants.valueAsString] !== undefined) {
                    textValue = new ReadTextValueAsString(propValue['@id'], propIri, propValue[KnoraConstants.valueAsString]);
                } else if (propValue[KnoraConstants.textValueAsHtml] !== undefined) {

                    let referredResources: ReferredResourcesByStandoffLink = {};

                    // check for standoff links and include referred resources, if any
                    // when the user interacts with a standoff link, further information about the referred resource can be shown
                    for (let standoffLink of standoffLinkValues) {
                        let referredRes: ReadResource = standoffLink.referredResource;
                        referredResources[referredRes.id] = referredRes;
                    }

                    textValue = new ReadTextValueAsHtml(propValue['@id'], propIri, propValue[KnoraConstants.textValueAsHtml], referredResources);
                } else if (propValue[KnoraConstants.textValueAsXml] !== undefined && propValue[KnoraConstants.textValueHasMapping] !== undefined) {
                    textValue = new ReadTextValueAsXml(propValue['@id'], propIri, propValue[KnoraConstants.textValueAsXml], propValue[KnoraConstants.textValueHasMapping]);
                } else {
                    // expected text value members not defined
                    console.log('ERROR: Invalid text value: ' + JSON.stringify(propValue));
                }

                valueSpecificProp = textValue;
                break;

            case KnoraConstants.DateValue:
                let dateValue = new ReadDateValue(propValue['@id'],
                    propIri,
                    propValue[KnoraConstants.dateValueHasCalendar],
                    propValue[KnoraConstants.dateValueHasStartYear],
                    propValue[KnoraConstants.dateValueHasEndYear],
                    propValue[KnoraConstants.dateValueHasStartEra],
                    propValue[KnoraConstants.dateValueHasEndEra],
                    propValue[KnoraConstants.dateValueHasStartMonth],
                    propValue[KnoraConstants.dateValueHasEndMonth],
                    propValue[KnoraConstants.dateValueHasStartDay],
                    propValue[KnoraConstants.dateValueHasEndDay]);

                valueSpecificProp = dateValue;
                break;

            case KnoraConstants.LinkValue:

                let linkValue: ReadLinkValue;

                // check if the referred resource is given as an object or just as an IRI
                if (propValue[KnoraConstants.linkValueHasTarget] !== undefined) {
                    // linkValueHasTarget contains the object

                    let referredResource: ReadResource = constructReadResource(propValue[KnoraConstants.linkValueHasTarget]);

                    linkValue = new ReadLinkValue(propValue['@id'], propIri, referredResource.id, referredResource);
                } else if (propValue[KnoraConstants.linkValueHasTargetIri] !== undefined) {
                    // linkValueHasTargetIri contains the resource's Iri

                    let referredResourceIri = propValue[KnoraConstants.linkValueHasTargetIri];

                    linkValue = new ReadLinkValue(propValue['@id'], propIri, referredResourceIri);
                } else if (propValue[KnoraConstants.linkValueHasSource] !== undefined) {
                    // linkValueHasSource contains the object

                    let incomingResource: ReadResource = constructReadResource(propValue[KnoraConstants.linkValueHasSource]);

                    linkValue = new ReadLinkValue(propValue['@id'], propIri, incomingResource.id, incomingResource);
                } else if (propValue[KnoraConstants.linkValueHasSourceIri] !== undefined) {
                    // linkValueHasSourceIri contains the resource's Iri

                    let incomingResourceIri = propValue[KnoraConstants.linkValueHasSourceIri];

                    linkValue = new ReadLinkValue(propValue['@id'], propIri, incomingResourceIri);
                }

                valueSpecificProp = linkValue;
                break;

            case KnoraConstants.IntValue:

                let intValue = new ReadIntegerValue(propValue['@id'], propIri, propValue[KnoraConstants.integerValueAsInteger]);
                valueSpecificProp = intValue;

                break;

            case KnoraConstants.DecimalValue:

                let decimalValue = new ReadDecimalValue(propValue['@id'], propIri, propValue[KnoraConstants.decimalValueAsDecimal]);
                valueSpecificProp = decimalValue;

                break;

            case KnoraConstants.StillImageFileValue:

                let stillImageFileValue: ReadStillImageFileValue = new ReadStillImageFileValue(
                    propValue['@id'],
                    propIri,
                    propValue[KnoraConstants.fileValueHasFilename],
                    propValue[KnoraConstants.stillImageFileValueHasIIIFBaseUrl],
                    propValue[KnoraConstants.fileValueAsUrl],
                    propValue[KnoraConstants.stillImageFileValueHasDimX],
                    propValue[KnoraConstants.stillImageFileValueHasDimY],
                    propValue[KnoraConstants.fileValueIsPreview] // optional (may be undefined)
                );

                valueSpecificProp = stillImageFileValue;

                break;

            case KnoraConstants.TextFileValue:

                let textFileValue = new ReadTextFileValue(
                    propValue['@id'],
                    propIri,
                    propValue[KnoraConstants.fileValueHasFilename],
                    propValue[KnoraConstants.fileValueAsUrl]
                );

                valueSpecificProp = textFileValue;

                break;

            case KnoraConstants.ColorValue:

                let readColorValue: ReadColorValue = new ReadColorValue(
                    propValue['@id'],
                    propIri,
                    propValue[KnoraConstants.colorValueAsColor]
                );

                valueSpecificProp = readColorValue;

                break;

            case KnoraConstants.GeomValue:

                let readGeomValue: ReadGeomValue = new ReadGeomValue(
                    propValue['@id'],
                    propIri,
                    propValue[KnoraConstants.geometryValueAsGeometry]
                );

                valueSpecificProp = readGeomValue;

                break;

            case KnoraConstants.UriValue:

                let uriValue: ReadUriValue = new ReadUriValue(
                    propValue['@id'],
                    propIri,
                    propValue[KnoraConstants.uriValueAsUri]
                );

                valueSpecificProp = uriValue;

                break;

            case KnoraConstants.BooleanValue:

                let boolValue: ReadBooleanValue = new ReadBooleanValue(
                    propValue['@id'],
                    propIri,
                    propValue[KnoraConstants.booleanValueAsBoolean]
                );

                valueSpecificProp = boolValue;

                break;


            case KnoraConstants.IntervalValue:

                let intervalValue: ReadIntervalValue = new ReadIntervalValue(
                    propValue['@id'],
                    propIri,
                    propValue[KnoraConstants.intervalValueHasStart],
                    propValue[KnoraConstants.intervalValueHasEnd]
                );

                valueSpecificProp = intervalValue;

                break;

            case KnoraConstants.ListValue:

                let listValue: ReadListValue = new ReadListValue(
                    propValue['@id'],
                    propIri,
                    propValue[KnoraConstants.listValueAsListNode],
                    propValue[KnoraConstants.listValueAsListNodeLabel]
                );

                valueSpecificProp = listValue;

                break;

            default:
                // unsupported value type
                console.log('ERROR: value type not implemented yet: ' + propValue['@type']);
                break;
        }

        return valueSpecificProp;

    }

    /**
     * Construct a [[ReadProperties]] from JSON-LD.
     *
     * @param resourceJSONLD an object describing the resource and its properties.
     * @param standoffLinksValues standoff link values of the resource.
     * @returns a [[ReadProperties]].
     */
    function constructReadProperties(resourceJSONLD: Object): ReadProperties {

        // JSONLD representing standoff link values
        let standoffLinkValuesJSONLD: Object = resourceJSONLD[KnoraConstants.hasStandoffLinkToValue];

        // to be populated with standoff link values
        let standoffLinkValues: ReadLinkValue[] = [];

        // convert each standoff link value JSONLD object to a ReadLinkValue
        // in order populate the collection with all the standoff link values
        if (standoffLinkValuesJSONLD !== undefined && Array.isArray(standoffLinkValuesJSONLD)) {
            for (let standoffLinkJSONLD of standoffLinkValuesJSONLD) {
                let standoffVal: ReadLinkValue = createValueSpecificProp(standoffLinkJSONLD, KnoraConstants.hasStandoffLinkToValue, []) as ReadLinkValue;

                standoffLinkValues.push(standoffVal);
            }
        } else if (standoffLinkValuesJSONLD !== undefined) {
            let standoffVal = createValueSpecificProp(standoffLinkValuesJSONLD, KnoraConstants.hasStandoffLinkToValue, []) as ReadLinkValue;

            standoffLinkValues.push(standoffVal);
        }

        let propNames = Object.keys(resourceJSONLD);
        // filter out everything that is not a Knora property name
        propNames = propNames.filter(propName => propName != '@id' && propName != '@type' && propName != KnoraConstants.schemaName);

        let properties: ReadProperties = {};

        // iterate over all the given property names
        for (let propName of propNames) {

            let propValues: Array<ReadPropertyItem> = [];

            // either an array of values or just one value is given
            if (Array.isArray(resourceJSONLD[propName])) {
                // array of values

                // for each property name, an array of property values is given, iterate over it
                for (let propValue of resourceJSONLD[propName]) {

                    // convert a JSON-LD property value to a `ReadPropertyItem`
                    let valueSpecificProp: ReadPropertyItem = createValueSpecificProp(propValue, propName, standoffLinkValues);

                    // if it is undefined, the value could not be constructed correctly
                    // add the property value to the array of property values
                    if (valueSpecificProp !== undefined) propValues.push(valueSpecificProp);

                }
            } else {
                // only one value

                let valueSpecificProp: ReadPropertyItem = createValueSpecificProp(resourceJSONLD[propName], propName, standoffLinkValues);

                // if it is undefined, the value could not be constructed correctly
                // add the property value to the array of property values
                if (valueSpecificProp !== undefined) propValues.push(valueSpecificProp);
            }

            // add the property to the properties object
            properties[propName] = propValues;

        }

        return properties;
    }

    /**
     * Turns an API response in JSON-LD representing a sequence of resources into a [[ReadResourcesSequence]].
     *
     * @param resourcesResponseJSONLD   a sequence of resources, represented as a JSON-LD object.
     * @returns {ReadResourcesSequence} a [[ReadResourcesSequence]].
     */
    export function createReadResourcesSequenceFromJsonLD(resourcesResponseJSONLD: Object): ReadResourcesSequence {

        let resources: Array<ReadResource> = [];
        let numberOfResources: number = resourcesResponseJSONLD[KnoraConstants.schemaNumberOfItems];

        // either an array of resources or just one resource is given
        if (Array.isArray(resourcesResponseJSONLD[KnoraConstants.schemaItemListElement])) {
            // an array of resources

            for (let resourceJSONLD of resourcesResponseJSONLD[KnoraConstants.schemaItemListElement]) {

                let resource: ReadResource = constructReadResource(resourceJSONLD);

                // add the resource to the resources array
                resources.push(resource);
            }
        } else {
            // only one resource

            let resource: ReadResource = constructReadResource(resourcesResponseJSONLD[KnoraConstants.schemaItemListElement]);

            // add the resource to the resources array
            resources.push(resource);

        }

        return new ReadResourcesSequence(resources, numberOfResources);

    }

    /**
     * Collects all the classes of referred resources from a given resource (from its linking properties).
     *
     * @param {Object} resourceJSONLD JSON-LD describing one resource.
     * @return an Array of resource class Iris (including duplicates).
     */
    function getReferredResourceClasses(resourceJSONLD: Object): string[] {

        let propNames = Object.keys(resourceJSONLD);
        // filter out everything that is not a Knora property name
        propNames = propNames.filter(propName => propName != '@id' && propName != '@type' && propName != KnoraConstants.schemaName);

        let referredResourceClasses = [];

        for (let prop of propNames) {

            // several values given for this property
            if (Array.isArray(resourceJSONLD[prop])) {

                for (let referredRes of resourceJSONLD[prop]) {

                    // if the property is a LinkValue and it contains an embedded resource, get its type
                    if (referredRes['@type'] == KnoraConstants.LinkValue && referredRes[KnoraConstants.linkValueHasTarget] !== undefined) {

                        // target resource is represented
                        referredResourceClasses.push(referredRes[KnoraConstants.linkValueHasTarget]['@type']);
                    } else if (referredRes['@type'] == KnoraConstants.LinkValue && referredRes[KnoraConstants.linkValueHasSource] !== undefined) {
                        // source resource is represented
                        referredResourceClasses.push(referredRes[KnoraConstants.linkValueHasSource]['@type']);
                    }

                }
            } else {
                // only one value given for this property

                // if the property is a LinkValue and it contains an embedded resource, get its type
                if (resourceJSONLD[prop]['@type'] == KnoraConstants.LinkValue && resourceJSONLD[prop][KnoraConstants.linkValueHasTarget] !== undefined) {

                    // target resource is represented
                    referredResourceClasses.push(resourceJSONLD[prop][KnoraConstants.linkValueHasTarget]['@type']);
                } else if (resourceJSONLD[prop]['@type'] == KnoraConstants.LinkValue && resourceJSONLD[prop][KnoraConstants.linkValueHasSource] !== undefined) {
                    // source resource is represented
                    referredResourceClasses.push(resourceJSONLD[prop][KnoraConstants.linkValueHasSource]['@type']);
                }
            }

        }

        return referredResourceClasses;

    }

    /**
     * Gets the resource classes (types) from a JSON-LD representing a sequence of resources.
     *
     * @param resourcesResponseJSONLD a sequence of resources, represented as a JSON-LD object.
     * @returns {Array<String>} the resource class Iris (without duplicates).
     */
    export function getResourceClassesFromJsonLD(resourcesResponseJSONLD: Object): string[] {

        if (Array.isArray(resourcesResponseJSONLD[KnoraConstants.schemaItemListElement])) {
            // an array of resources

            let resourceClasses: Array<string> = [];

            // collect all resource classes
            for (let res of resourcesResponseJSONLD[KnoraConstants.schemaItemListElement]) {
                // get class of the current resource
                resourceClasses.push(res['@type']);

                // get the classes of referred resources
                let referredResourceClasses = getReferredResourceClasses(res);

                resourceClasses = resourceClasses.concat(referredResourceClasses);

            }

            // filter out duplicates
            return resourceClasses.filter(Utils.filterOutDuplicates);

        } else {

            let resourceClasses: Array<string> = [];

            let res = resourcesResponseJSONLD[KnoraConstants.schemaItemListElement];

            // only one resource
            resourceClasses.push(res['@type']);

            // get the classes of referred resources
            let referredResourceClasses = getReferredResourceClasses(res);

            resourceClasses = resourceClasses.concat(referredResourceClasses);

            // filter out duplicates
            return resourceClasses.filter(Utils.filterOutDuplicates);
        }
    }

}
