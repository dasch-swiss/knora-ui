import {
    ReadProperties,
    ReadResource,
    KnoraConstants,
    ReadLinkValue,
    ReadPropertyItem,
    ReadTextValueAsString,
    ReferredResourcesByStandoffLink,
    ReadTextValueAsHtml,
    ReadTextValueAsXml,
    ReadDateValue,
    ReadIntegerValue,
    ReadDecimalValue,
    ReadStillImageFileValue,
    ReadTextFileValue,
    ReadColorValue,
    ReadGeomValue,
    ReadUriValue,
    ReadBooleanValue,
    ReadIntervalValue,
    ReadListValue,
    ReadResourcesSequence,
    Utils
} from '../../declarations';

declare let require: any; // http://stackoverflow.com/questions/34730010/angular2-5-minute-install-bug-require-is-not-defined
const jsonld = require('jsonld');

export module ConvertJSONLD {

    /**
     * Gets property names and filters out all non property names.
     * Gets all members that have to be treated as value objects.
     */
    const getPropertyNames = (propName) => {
        return propName !== '@id'
            && propName !== '@type'
            && propName !== KnoraConstants.RdfsLabel
            && propName !== KnoraConstants.attachedToProject
            && propName !== KnoraConstants.attachedToUser
            && propName !== KnoraConstants.creationDate
            && propName !== KnoraConstants.lastModificationDate
            && propName !== KnoraConstants.hasPermissions;
    };


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
            resourceJSONLD[KnoraConstants.RdfsLabel],
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
    function createValueSpecificProp(
        propValue: Object, propIri: string, standoffLinkValues: ReadLinkValue[]): ReadPropertyItem | undefined {

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

                    const referredResources: ReferredResourcesByStandoffLink = {};

                    // check for standoff links and include referred resources, if any
                    // when the user interacts with a standoff link, further information about the referred resource can be shown
                    for (const standoffLink of standoffLinkValues) {
                        const referredRes: ReadResource = standoffLink.referredResource;
                        referredResources[referredRes.id] = referredRes;
                    }

                    textValue = new ReadTextValueAsHtml(
                        propValue['@id'], propIri, propValue[KnoraConstants.textValueAsHtml], referredResources
                    );
                } else if (
                    propValue[KnoraConstants.textValueAsXml] !== undefined && propValue[KnoraConstants.textValueHasMapping] !== undefined) {
                    textValue = new ReadTextValueAsXml(
                        propValue['@id'], propIri, propValue[KnoraConstants.textValueAsXml], propValue[KnoraConstants.textValueHasMapping]
                    );
                } else {
                    // expected text value members not defined
                    console.log('ERROR: Invalid text value: ' + JSON.stringify(propValue));
                }

                valueSpecificProp = textValue;
                break;

            case KnoraConstants.DateValue:
                const dateValue = new ReadDateValue(propValue['@id'],
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

                    const referredResource: ReadResource = constructReadResource(propValue[KnoraConstants.linkValueHasTarget]);

                    linkValue = new ReadLinkValue(propValue['@id'], propIri, referredResource.id, referredResource);
                } else if (propValue[KnoraConstants.linkValueHasTargetIri] !== undefined) {
                    // linkValueHasTargetIri contains the resource's Iri

                    const referredResourceIri = propValue[KnoraConstants.linkValueHasTargetIri]['@id'];

                    linkValue = new ReadLinkValue(propValue['@id'], propIri, referredResourceIri);
                } else if (propValue[KnoraConstants.linkValueHasSource] !== undefined) {
                    // linkValueHasSource contains the object

                    const incomingResource: ReadResource = constructReadResource(propValue[KnoraConstants.linkValueHasSource]);

                    linkValue = new ReadLinkValue(propValue['@id'], propIri, incomingResource.id, incomingResource);
                } else if (propValue[KnoraConstants.linkValueHasSourceIri] !== undefined) {
                    // linkValueHasSourceIri contains the resource's Iri

                    const incomingResourceIri = propValue[KnoraConstants.linkValueHasSourceIri]['@id'];

                    linkValue = new ReadLinkValue(propValue['@id'], propIri, incomingResourceIri);
                }

                valueSpecificProp = linkValue;
                break;

            case KnoraConstants.IntValue:

                const intValue = new ReadIntegerValue(propValue['@id'], propIri, propValue[KnoraConstants.integerValueAsInteger]);
                valueSpecificProp = intValue;

                break;

            case KnoraConstants.DecimalValue:

                // a decimal value is represented as a string in order to preserve its precision
                const decVal: number = parseFloat(propValue[KnoraConstants.decimalValueAsDecimal]['@value']);

                const decimalValue = new ReadDecimalValue(propValue['@id'], propIri, decVal);
                valueSpecificProp = decimalValue;

                break;

            case KnoraConstants.StillImageFileValue:

                const stillImageFileValue: ReadStillImageFileValue = new ReadStillImageFileValue(
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

                const textFileValue = new ReadTextFileValue(
                    propValue['@id'],
                    propIri,
                    propValue[KnoraConstants.fileValueHasFilename],
                    propValue[KnoraConstants.fileValueAsUrl]
                );

                valueSpecificProp = textFileValue;

                break;

            case KnoraConstants.ColorValue:

                const readColorValue: ReadColorValue = new ReadColorValue(
                    propValue['@id'],
                    propIri,
                    propValue[KnoraConstants.colorValueAsColor]
                );

                valueSpecificProp = readColorValue;

                break;

            case KnoraConstants.GeomValue:

                const readGeomValue: ReadGeomValue = new ReadGeomValue(
                    propValue['@id'],
                    propIri,
                    propValue[KnoraConstants.geometryValueAsGeometry]
                );

                valueSpecificProp = readGeomValue;

                break;

            case KnoraConstants.UriValue:

                const uriValue: ReadUriValue = new ReadUriValue(
                    propValue['@id'],
                    propIri,
                    propValue[KnoraConstants.uriValueAsUri]['@value']
                );

                valueSpecificProp = uriValue;

                break;

            case KnoraConstants.BooleanValue:

                const boolValue: ReadBooleanValue = new ReadBooleanValue(
                    propValue['@id'],
                    propIri,
                    propValue[KnoraConstants.booleanValueAsBoolean]
                );

                valueSpecificProp = boolValue;

                break;


            case KnoraConstants.IntervalValue:

                // represented as strings to preserve precision
                const intStart = parseFloat(propValue[KnoraConstants.intervalValueHasStart]['@value']);
                const intEnd = parseFloat(propValue[KnoraConstants.intervalValueHasEnd]['@value']);

                const intervalValue: ReadIntervalValue = new ReadIntervalValue(
                    propValue['@id'],
                    propIri,
                    intStart,
                    intEnd
                );

                valueSpecificProp = intervalValue;

                break;

            case KnoraConstants.ListValue:

                const listValue: ReadListValue = new ReadListValue(
                    propValue['@id'],
                    propIri,
                    propValue[KnoraConstants.listValueAsListNode]['@id'],
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
        const standoffLinkValuesJSONLD: Object = resourceJSONLD[KnoraConstants.hasStandoffLinkToValue];

        // to be populated with standoff link values
        const standoffLinkValues: ReadLinkValue[] = [];

        // convert each standoff link value JSONLD object to a ReadLinkValue
        // in order populate the collection with all the standoff link values
        if (standoffLinkValuesJSONLD !== undefined && Array.isArray(standoffLinkValuesJSONLD)) {
            for (const standoffLinkJSONLD of standoffLinkValuesJSONLD) {
                const standoffVal: ReadLinkValue = createValueSpecificProp(
                    standoffLinkJSONLD, KnoraConstants.hasStandoffLinkToValue, []
                ) as ReadLinkValue;

                standoffLinkValues.push(standoffVal);
            }
        } else if (standoffLinkValuesJSONLD !== undefined) {
            const standoffVal = createValueSpecificProp(
                standoffLinkValuesJSONLD, KnoraConstants.hasStandoffLinkToValue, []
            ) as ReadLinkValue;

            standoffLinkValues.push(standoffVal);
        }

        let propNames = Object.keys(resourceJSONLD);
        // filter out everything that is not a Knora property name

        /*
        http://api.knora.org/ontology/knora-api/v2#attachedToProject: [  ]
            http://api.knora.org/ontology/knora-api/v2#attachedToUser: [  ]
            http://api.knora.org/ontology/knora-api/v2#creationDate: [  ]
            http://api.knora.org/ontology/knora-api/v2#hasPermissions:
        */

        propNames = propNames.filter(getPropertyNames);

        const properties: ReadProperties = {};

        // iterate over all the given property names
        for (const propName of propNames) {

            const propValues: Array<ReadPropertyItem> = [];

            // either an array of values or just one value is given
            if (Array.isArray(resourceJSONLD[propName])) {
                // array of values

                // for each property name, an array of property values is given, iterate over it
                for (const propValue of resourceJSONLD[propName]) {

                    // convert a JSON-LD property value to a `ReadPropertyItem`
                    const valueSpecificProp: ReadPropertyItem = createValueSpecificProp(propValue, propName, standoffLinkValues);

                    // if it is undefined, the value could not be constructed correctly
                    // add the property value to the array of property values
                    if (valueSpecificProp !== undefined) propValues.push(valueSpecificProp);

                }
            } else {
                // only one value

                const valueSpecificProp: ReadPropertyItem = createValueSpecificProp(resourceJSONLD[propName], propName, standoffLinkValues);

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

        const resources: Array<ReadResource> = [];
        let numberOfResources: number;
        const resourcesGraph = resourcesResponseJSONLD['@graph'];

        // either an array of resources or just one resource is given
        if (resourcesGraph !== undefined) {
            // an array of resources
            numberOfResources = resourcesGraph.length;

            for (const resourceJSONLD of resourcesGraph) {

                const resource: ReadResource = constructReadResource(resourceJSONLD);

                // add the resource to the resources array
                resources.push(resource);
            }
        } else {
            if (Object.keys(resourcesResponseJSONLD).length === 0) {
                numberOfResources = 0;
            } else {

                // only one resource
                numberOfResources = 1;

                const resource: ReadResource = constructReadResource(resourcesResponseJSONLD);

                // add the resource to the resources array
                resources.push(resource);
            }
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
        propNames = propNames.filter(getPropertyNames);

        const referredResourceClasses = [];

        for (const prop of propNames) {

            // several values given for this property
            if (Array.isArray(resourceJSONLD[prop])) {

                for (const referredRes of resourceJSONLD[prop]) {

                    // if the property is a LinkValue and it contains an embedded resource, get its type
                    if (referredRes['@type'] === KnoraConstants.LinkValue && referredRes[KnoraConstants.linkValueHasTarget] !== undefined) {

                        // target resource is represented
                        referredResourceClasses.push(referredRes[KnoraConstants.linkValueHasTarget]['@type']);
                    } else if (
                        referredRes['@type'] === KnoraConstants.LinkValue && referredRes[KnoraConstants.linkValueHasSource] !== undefined) {
                        // source resource is represented
                        referredResourceClasses.push(referredRes[KnoraConstants.linkValueHasSource]['@type']);
                    }

                }
            } else {
                // only one value given for this property

                // if the property is a LinkValue and it contains an embedded resource, get its type
                if (
                    resourceJSONLD[prop]['@type']
                    === KnoraConstants.LinkValue && resourceJSONLD[prop][KnoraConstants.linkValueHasTarget]
                    !== undefined) {

                    // target resource is represented
                    referredResourceClasses.push(resourceJSONLD[prop][KnoraConstants.linkValueHasTarget]['@type']);
                } else if (
                    resourceJSONLD[prop]['@type']
                    === KnoraConstants.LinkValue && resourceJSONLD[prop][KnoraConstants.linkValueHasSource]
                    !== undefined) {
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

        const resourcesGraph = resourcesResponseJSONLD['@graph'];
        let resourceClasses: Array<string> = [];

        // either an array of resources or just one resource is given
        if (resourcesGraph !== undefined) {
            // an array of resources

            for (const resourceJSONLD of resourcesGraph) {
                // get class of the current resource
                resourceClasses.push(resourceJSONLD['@type']);

                // get the classes of referred resources
                const referredResourceClasses = getReferredResourceClasses(resourceJSONLD);

                resourceClasses = resourceClasses.concat(referredResourceClasses);

            }

        } else {
            // only one resource

            if (Object.keys(resourcesResponseJSONLD).length === 0) {
                return [];
            } else {
                resourceClasses.push(resourcesResponseJSONLD['@type']);

                // get the classes of referred resources
                const referredResourceClasses = getReferredResourceClasses(resourcesResponseJSONLD);

                resourceClasses = resourceClasses.concat(referredResourceClasses);
            }
        }

        // filter out duplicates
        return resourceClasses.filter(Utils.filterOutDuplicates);

    }
}
