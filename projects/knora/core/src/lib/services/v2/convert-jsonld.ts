import { CountQueryResult, KnoraConstants, ReadAudioFileValue, ReadBooleanValue, ReadColorValue, ReadDateValue, ReadDDDFileValue, ReadDecimalValue, ReadDocumentFileValue, ReadGeomValue, ReadIntegerValue, ReadIntervalValue, ReadLinkValue, ReadListValue, ReadMovingImageFileValue, ReadProperties, ReadPropertyItem, ReadResource, ReadResourcesSequence, ReadStillImageFileValue, ReadTextFileValue, ReadTextValueAsHtml, ReadTextValueAsString, ReadTextValueAsXml, ReadUriValue, ReferredResourcesByStandoffLink, Resource, Utils, ResourcesSequence } from '../../declarations';

/**
 * @deprecated since v9.5.0
 *
 * Contains methods to convert JSON-LD representing resources and properties to classes.
 * These methods works only for instances of resources and properties, not for ontologies (data model).
 */
export module ConvertJSONLD {

    /**
     * @deprecated since v9.5.0
     *
     * Function to be passed to a filter used on an array of property names
     * sorting out all non value property names.
     *
     * Gets all property names that refer to value objects.
     *
     * @param propName the name of a property to be checked.
     * @returns boolean - indicating if the name refers to a value property.
     */
    const getPropertyNames = (propName) => {
        return propName !== '@id'
            && propName !== '@type'
            && propName !== KnoraConstants.RdfsLabel
            && propName !== KnoraConstants.attachedToProject
            && propName !== KnoraConstants.attachedToUser
            && propName !== KnoraConstants.creationDate
            && propName !== KnoraConstants.lastModificationDate
            && propName !== KnoraConstants.hasPermissions
            && propName !== KnoraConstants.userHasPermission
            && propName !== KnoraConstants.ArkUrl
            && propName !== KnoraConstants.versionArkUrl;
    };


    /**
     * @deprecated Use the function `constructResource` instead - see below
     *
     * Constructs a [[ReadResource]] from JSON-LD.
     * Expects JSON-LD with all Iris fully expanded.
     *
     * @param {object} resourceJSONLD an a resource and its properties serialized as JSON-LD.
     * @returns ReadResource
     */
    function constructReadResource(resourceJSONLD: object): ReadResource {

        const properties: ReadProperties = constructReadProperties(resourceJSONLD);

        return new ReadResource(
            resourceJSONLD['@id'],
            resourceJSONLD['@type'],
            resourceJSONLD[KnoraConstants.RdfsLabel],
            [], // to be updated once another request has been made
            [], // to be updated once another request has been made
            [], // to be updated once another request has been made
            [], // to be updated once another request has been made
            properties
        );
    }

    /**
     * @deprecated since v9.5.0
     */
    function constructResource(resourceJSONLD: object): Resource {

        const properties: ReadProperties = constructReadProperties(resourceJSONLD);

        return new Resource(
            resourceJSONLD['@id'],
            resourceJSONLD['@type'],
            resourceJSONLD[KnoraConstants.RdfsLabel],
            [], // incomingAnnotations; to be updated once another request has been made
            [], // incomingFileRepresentations, to be updated once another request has been made
            [], // incomingLinks; to be updated once another request has been made
            {}, // fileRepresentationsToDisplay; to be updated once another request has been made
            properties
        );
    }

    /**
     * @deprecated since v9.5.0
     *
     * Constructs a [[ReadPropertyItem]] from JSON-LD,
     * taking into account the property's value type.
     * Expects JSON-LD with all Iris fully expanded.
     *
     * @param {Object} propValue the value serialized as JSON-LD.
     * @param {string} propIri the Iri of the property.
     * @param {ReadLinkValue[]} standoffLinkValues standoffLinkValues of the resource. Text values may contain links to other resources.
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
                    propValue[KnoraConstants.textValueAsXml] !== undefined && propValue[KnoraConstants.textValueHasMapping]['@id'] !== undefined) {
                    textValue = new ReadTextValueAsXml(
                        propValue['@id'], propIri, propValue[KnoraConstants.textValueAsXml], propValue[KnoraConstants.textValueHasMapping]['@id']
                    );
                } else {
                    // expected text value members not defined
                    console.error('ERROR: Invalid text value: ' + JSON.stringify(propValue));
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
                    propValue[KnoraConstants.stillImageFileValueHasIIIFBaseUrl]['@value'],
                    propValue[KnoraConstants.fileValueAsUrl]['@value'],
                    propValue[KnoraConstants.stillImageFileValueHasDimX],
                    propValue[KnoraConstants.stillImageFileValueHasDimY]
                );

                valueSpecificProp = stillImageFileValue;

                break;

            case KnoraConstants.MovingImageFileValue:

                const movingImageFileValue: ReadMovingImageFileValue = new ReadMovingImageFileValue(
                    propValue['@id'],
                    propIri,
                    propValue[KnoraConstants.fileValueHasFilename],
                    propValue[KnoraConstants.fileValueAsUrl]['@value'],
                    propValue[KnoraConstants.movingImageFileValueHasDimX],
                    propValue[KnoraConstants.movingImageFileValueHasDimY],
                    propValue[KnoraConstants.movingImageFileValueHasDuration],
                    propValue[KnoraConstants.movingImageFileValueHasFps]
                );

                valueSpecificProp = movingImageFileValue;

                break;

            case KnoraConstants.AudioFileValue:

                const audioFileValue: ReadAudioFileValue = new ReadAudioFileValue(
                    propValue['@id'],
                    propIri,
                    propValue[KnoraConstants.fileValueHasFilename],
                    propValue[KnoraConstants.fileValueAsUrl]['@value'],
                    propValue[KnoraConstants.audioFileValueHasDuration]
                );

                valueSpecificProp = audioFileValue;

                break;

            case KnoraConstants.DDDFileValue:

                const dddFileValue: ReadDDDFileValue = new ReadDDDFileValue(
                    propValue['@id'],
                    propIri,
                    propValue[KnoraConstants.fileValueHasFilename],
                    propValue[KnoraConstants.fileValueAsUrl]['@value']
                );

                valueSpecificProp = dddFileValue;

                break;

            case KnoraConstants.DocumentFileValue:

                const documentFileValue: ReadDocumentFileValue = new ReadDocumentFileValue(
                    propValue['@id'],
                    propIri,
                    propValue[KnoraConstants.fileValueHasFilename],
                    propValue[KnoraConstants.fileValueAsUrl]['@value']
                );

                valueSpecificProp = documentFileValue;

                break;

            case KnoraConstants.TextFileValue:

                const textFileValue = new ReadTextFileValue(
                    propValue['@id'],
                    propIri,
                    propValue[KnoraConstants.fileValueHasFilename],
                    propValue[KnoraConstants.fileValueAsUrl]['@value']
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
                    propValue[KnoraConstants.listValueAsListNode]['@id']
                );

                valueSpecificProp = listValue;

                break;

            default:
                // unsupported value type
                console.error('ERROR: value type not implemented yet: ' + propValue['@type'] + '(' + propValue['@id'] + ')');
                break;
        }

        return valueSpecificProp;

    }


    /**
     * @deprecated since v9.5.0
     *
     * Construct a [[ReadProperties]] from JSON-LD.
     * Expects JSON-LD with all Iris fully expanded.
     *
     * @param {object} resourceJSONLD an object describing the resource and its properties.
     * @returns ReadProperties
     */
    function constructReadProperties(resourceJSONLD: object): ReadProperties {

        // JSON-LD representing standoff link values
        // text values may contain standoff links
        const standoffLinkValuesJSONLD: Object = resourceJSONLD[KnoraConstants.hasStandoffLinkToValue];

        // to be populated with standoff link values
        const standoffLinkValues: ReadLinkValue[] = [];

        // convert each standoff link value JSON-LD object to a ReadLinkValue
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
     * @deprecated since v9.5.0
     *
     * Turns an API response in JSON-LD representing a sequence of resources into a [[ReadResourcesSequence]].
     * Expects JSON-LD with all Iris fully expanded.
     *
     * @param {object} resourcesResponseJSONLD a resource or a sequence of resources, represented as a JSON-LD object.
     * @returns ReadResourcesSequence - sequence of read resources
     */
    export function createReadResourcesSequenceFromJsonLD(resourcesResponseJSONLD: object): ReadResourcesSequence {

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
                // empty answer, no resources given
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
     * @deprecated since v9.5.0
     *
     * @param resourcesResponseJSONLD
     * @returns ResourcesSequence
     */
    export function createResourcesSequenceFromJsonLD(resourcesResponseJSONLD: object): ResourcesSequence {

        const resources: Array<Resource> = [];
        let numberOfResources: number;
        const resourcesGraph = resourcesResponseJSONLD['@graph'];

        // either an array of resources or just one resource is given
        if (resourcesGraph !== undefined) {
            // an array of resources
            numberOfResources = resourcesGraph.length;

            for (const resourceJSONLD of resourcesGraph) {

                const resource: Resource = constructResource(resourceJSONLD);

                // add the resource to the resources array
                resources.push(resource);
            }
        } else {
            if (Object.keys(resourcesResponseJSONLD).length === 0) {
                // empty answer, no resources given
                numberOfResources = 0;
            } else {

                // only one resource
                numberOfResources = 1;

                const resource: Resource = constructResource(resourcesResponseJSONLD);

                // add the resource to the resources array
                resources.push(resource);
            }
        }

        return new ResourcesSequence(resources, numberOfResources);

    }

    /**
     * @deprecated since v9.5.0
     *
     * Collects all the types (classes) of referred resources from a given resource (from its linking properties).
     * Expects JSON-LD with all Iris fully expanded.
     *
     * @param {object} resourceJSONLD JSON-LD describing one resource.
     * @return string[] - an Array of resource class Iris (including duplicates).
     */
    function getReferredResourceClasses(resourceJSONLD: object): string[] {

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
     * @deprecated since v9.5.0
     *
     * Gets the resource types (classes) from a JSON-LD representing a sequence of resources.
     * Expects JSON-LD with all Iris fully expanded.
     *
     * @param resourcesResponseJSONLD a sequence of resources, represented as a JSON-LD object.
     * @returns string[] - the resource class Iris (without duplicates).
     */
    export function getResourceClassesFromJsonLD(resourcesResponseJSONLD: object): string[] {

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

    /**
     * @deprecated since v9.5.0
     *
     * Turns a JSON-LD response to a count query into a `CountQueryResult`.
     * Expects JSON-LD with all Iris fully expanded.
     *
     * @param countQueryJSONLD
     * @returns {CountQueryResult}
     */
    export function createCountQueryResult(countQueryJSONLD: object) {
        return new CountQueryResult(countQueryJSONLD[KnoraConstants.schemaNumberOfItems]);
    }
}
