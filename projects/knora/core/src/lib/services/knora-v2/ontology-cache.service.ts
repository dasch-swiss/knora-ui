import { Injectable } from '@angular/core';
import { KnoraConstants, ApiServiceResult, Utils } from '../../declarations';
import { OntologyService } from './ontology.service';
import { from, Observable, of, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { KuiCoreModule } from '../../core.module';

declare let require: any; // http://stackoverflow.com/questions/34730010/angular2-5-minute-install-bug-require-is-not-defined
const jsonld = require('jsonld');

/**
 * Represents an error occurred in OntologyCacheService.
 */
class OntologyCacheError extends Error {

    constructor(readonly message: string) {
        super(message);
    }
}


/**
 * Represents an ontology's metadata.
 */
export class OntologyMetadata {

    /**
     *
     * @param {string} id Iri identifying the ontology.
     * @param {string} label a label describing the ontology.
     */
    constructor(readonly id: string,
        readonly label: string) {

    }

}


/**
 * Occurrence of a property for a resource class.
 */
export enum CardinalityOccurrence {
    minCard = 0,
    card = 1,
    maxCard = 2
}


/**
 * Cardinality of a property for the given resource class.
 */
export class Cardinality {

    /**
     *
     * @param {CardinalityOccurrence} occurrence type of given occurrence.
     * @param {number} value numerical value of given occurrence.
     * @param {string} property the property the given occurrence applies to.
     */
    constructor(readonly occurrence: CardinalityOccurrence,
        readonly value: number,
        readonly property: string) {
    }
}


/**
 * A resource class definition.
 */
export class ResourceClass {

    /**
     *
     * @param {string} id Iri identifying the resource class.
     * @param {string} icon path to an icon representing the resource class.
     * @param {string} comment comment on the resource class.
     * @param {string} label label for the resource class.
     * @param {Array<Cardinality>} cardinalities the resource class's properties.
     */
    constructor(readonly id: string,
        readonly icon: string,
        readonly comment: string,
        readonly label: string,
        readonly cardinalities: Array<Cardinality>) {

    }
}


/**
 * A map of resource class Iris to resource class definitions.
 */
export class ResourceClasses {
    [index: string]: ResourceClass;
}


/**
 * A property definition.
 */
export class Property {

    /**
     *
     * @param {string} id Iri identifying the property definition.
     * @param {string} objectType the property's object constraint.
     * @param {string} comment comment on the property definition.
     * @param {string} label label for the property definition.
     * @param {Array<string>} subPropertyOf Iris of properties the given property is a subproperty of.
     * @param {Boolean} isEditable indicates whether the given property can be edited by the client.
     * @param {Boolean} isLinkProperty indicates whether the given property is a linking property.
     * @param {Boolean} isLinkValueProperty indicates whether the given property refers to a link value.
     */
    constructor(readonly id: string,
        readonly objectType: string,
        readonly comment: string,
        readonly label: string,
        readonly subPropertyOf: Array<string>,
        readonly isEditable: Boolean,
        readonly isLinkProperty: Boolean,
        readonly isLinkValueProperty: Boolean) {

    }
}


/**
 * A map of property Iris to property definitions.
 */
export class Properties {
    [index: string]: Property;
}


/**
 * Groups resource classes by the ontology they are defined in.
 *
 * A map of ontology Iris to an array of resource class Iris.
 */
export class ResourceClassIrisForOntology {
    [index: string]: Array<string>;
}


/**
 * Represents cached ontology information (only used by this service internally).
 */
class OntologyCache {

    /**
     * An Array of all existing ontologies.
     */
    ontologies: Array<OntologyMetadata>;

    /**
     * A list of all resource class Iris for a named graph.
     */
    resourceClassIrisForOntology: ResourceClassIrisForOntology;

    /**
     * Resource class definitions.
     */
    resourceClasses: ResourceClasses;

    /**
     * Property definitions.
     */
    properties: Properties;

    constructor() {
        this.ontologies = [];

        this.resourceClassIrisForOntology = new ResourceClassIrisForOntology();

        this.resourceClasses = new ResourceClasses();

        this.properties = new Properties();
    }
}

/**
 * Represents ontology information requested from this service.
 */
export class OntologyInformation {

    /**
     *
     * @param {ResourceClassIrisForOntology} resourceClassesForOntology
     * all resource class Iris for a given ontology. TODO: can this be removed?
     * @param {ResourceClasses} resourceClasses resource class definitions.
     * @param {Properties} properties property definitions.
     */
    constructor(
        private resourceClassesForOntology: ResourceClassIrisForOntology,
        private resourceClasses: ResourceClasses,
        private properties: Properties) {
    }

    /**
     *
     * Merge the given [[OntologyInformation]] into the current instance,
     * updating the existing information.
     *
     * @params ontologyInfo the given [[OntologyInformation]] that has to be integrated.
     */
    updateOntologyInformation(ontologyInfo: OntologyInformation): void {

        // update resourceClassIrisForOntology
        const newResourceClassesForOntology = ontologyInfo.getResourceClassForOntology();

        // tslint:disable-next-line:forin
        for (const newResClassForOntology in newResourceClassesForOntology) {
            this.resourceClassesForOntology[newResClassForOntology] = newResourceClassesForOntology[newResClassForOntology];
        }

        // update resourceClasses
        const newResourceClasses = ontologyInfo.getResourceClasses();

        // tslint:disable-next-line:forin
        for (const newResClass in newResourceClasses) {
            this.resourceClasses[newResClass] = newResourceClasses[newResClass];
        }

        // update properties
        const newProperties = ontologyInfo.getProperties();

        // tslint:disable-next-line:forin
        for (const newProp in newProperties) {
            this.properties[newProp] = newProperties[newProp];
        }

    }

    /**
     * Gets resource classes definitions for ontologies.
     *
     * @returns {ResourceClassIrisForOntology}
     */
    getResourceClassForOntology(): ResourceClassIrisForOntology {
        return this.resourceClassesForOntology;
    }

    /**
     * Gets all resource classes as an object.
     *
     * @returns {ResourceClasses}
     */
    getResourceClasses(): ResourceClasses {
        return this.resourceClasses;
    }

    /**
     * Gets all resource classes as an Array.
     *
     * @returns {Array<ResourceClass>}
     */
    getResourceClassesAsArray(): Array<ResourceClass> {

        const resClasses: Array<ResourceClass> = [];

        // tslint:disable-next-line:forin
        for (const resClassIri in this.resourceClasses) {
            const resClass: ResourceClass = this.resourceClasses[resClassIri];
            resClasses.push(resClass);
        }

        return resClasses;

    }

    /**
     * Returns a resource class's label.
     *
     * @param {string} resClass to query for.
     * @returns {string} the resource class's label.
     */
    getLabelForResourceClass(resClass: string): string {

        if (resClass !== undefined) {

            const resClassDef = this.resourceClasses[resClass];

            if (resClassDef !== undefined && resClassDef.label !== undefined) {
                return resClassDef.label;
            } else {
                return resClassDef.id;
            }
        } else {
            console.log('call of OntologyInformation.getLabelForResourceClass without argument resClass');
        }
    }

    /**
     * Get all properties as an object.
     *
     * @returns {Properties}
     */
    getProperties() {
        return this.properties;
    }

    /**
     * Gets all properties as an Array.
     *
     * @returns {Array<Property>}
     */
    getPropertiesAsArray() {

        const properties: Array<Property> = [];

        // tslint:disable-next-line:forin
        for (const propIri in this.properties) {
            const prop: Property = this.properties[propIri];
            properties.push(prop);
        }

        return properties;

    }

    /**
     * Returns a property's label.
     *
     * @param {string} property to query for.
     * @returns {string} the property's label.
     */
    getLabelForProperty(property: string): string {

        if (property !== undefined) {

            const propDef = this.properties[property];

            if (propDef !== undefined && propDef.label !== undefined) {
                return propDef.label;
            } else {
                return propDef.id;
            }
        } else {
            console.log('call of OntologyInformation.getLabelForProperty without argument property');
        }
    }

}


/**
 * Adds and retrieves information to and from the LocalStorage.
 * If an information is not cached already, it is requested from Knora and added to the cache.
 */
@Injectable({
    providedIn: KuiCoreModule
})
export class OntologyCacheService {

    private excludedOntologies: Array<string> = [KnoraConstants.SalsahGuiOntology, KnoraConstants.StandoffOntology];

    // properties that Knora is not responsible for and
    // that have to be ignored because they cannot be resolved at the moment
    private excludedProperties: Array<string> = [KnoraConstants.RdfsLabel];

    // class definitions that are not be treated as Knora resource classes
    private nonResourceClasses: Array<string> = [KnoraConstants.ForbiddenResource, KnoraConstants.XMLToStandoffMapping, KnoraConstants.ListNode];

    private cacheOntology: OntologyCache = new OntologyCache();

    constructor(private _ontologyService: OntologyService) {
    }

    /**
     * Requests the Iris of all the named graphs from Knora.
     *
     * @returns {Observable<object>} an Observable representing the required information.
     */
    private getOntologiesMetadataFromKnora(): Observable<object> {
        const ontoResponse = this._ontologyService.getOntologiesMetadata().pipe(
            mergeMap(
                // this would return an Observable of a PromiseObservable -> combine them into one Observable
                // http://reactivex.io/documentation/operators/flatmap.html
                // http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-mergeMap
                (ontRes: ApiServiceResult) => {
                    const ontPromises = jsonld.promises;
                    // compact JSON-LD using an empty context: expands all Iris
                    const ontPromise = ontPromises.compact(ontRes.body, {});

                    // convert promise to Observable and return it
                    // https://www.learnrxjs.io/operators/creation/frompromise.html
                    return from(ontPromise);
                }
            )
        );

        return ontoResponse;
    }

    /**
     * Requests all entity definitions for the given ontology from Knora.
     *
     * @param ontologyIri the Iri of the requested ontology.
     */
    private getAllEntityDefinitionsForOntologyFromKnora(ontologyIri: string): Observable<object> {

        return this._ontologyService.getAllEntityDefinitionsForOntologies(ontologyIri).pipe(
            mergeMap(
                // this would return an Observable of a PromiseObservable -> combine them into one Observable
                // http://reactivex.io/documentation/operators/flatmap.html
                // http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-mergeMap
                (ontRes: ApiServiceResult) => {
                    const ontPromises = jsonld.promises;
                    // compact JSON-LD using an empty context: expands all Iris
                    const ontPromise = ontPromises.compact(ontRes.body, {});

                    // convert promise to Observable and return it
                    // https://www.learnrxjs.io/operators/creation/frompromise.html
                    return from(ontPromise);
                }
            )
        );
    }

    /**
     * Writes all the ontologies' metadata returned by Knora to the cache.
     *
     * @param {string[]} ontologies metadata of all existing ontologies.
     */
    private convertAndWriteOntologiesMetadataToCache(ontologies: object[]) {

        this.cacheOntology.ontologies = ontologies.map(
            ontology => {
                return new OntologyMetadata(ontology['@id'], ontology[KnoraConstants.RdfsLabel]);
            }
        );
    }

    /**
     * Gets all ontologies' metadata from the cache and returns them.
     *
     * @returns {Array<string>}
     */
    private getAllOntologiesMetadataFromCache(): Array<OntologyMetadata> {

        return this.cacheOntology.ontologies;

    }

    /**
     * Gets resource class definitions from the ontology response.
     * `knora-api:Resource` will be excluded.
     *
     * @param {Object} classDefinitions the `hasClasses` section of an ontology response.
     * @returns {string[]}
     */
    private getResourceClassIrisFromOntologyResponse(classDefinitions: Array<Object>): string[] {
        const resourceClassIris: string[] = [];

        for (const classDef of classDefinitions) {
            const classIri = classDef['@id'];

            // check that class name is not listed as a non resource class and that the isResourceClass flag is present and set to true
            if (
                classIri !== KnoraConstants.Resource && this.nonResourceClasses.indexOf(classIri)
                === -1 && (classDef[KnoraConstants.IsResourceClass] !== undefined && classDef[KnoraConstants.IsResourceClass] === true)) {
                // it is not a value class, but a resource class definition
                resourceClassIris.push(classIri);
            }
        }

        return resourceClassIris;
    }

    /**
     * Converts a Knora response for all entity definitions for the requested ontology
     * into an internal representation and caches it.
     *
     * Knora automatically includes the resource class definitions for the given ontology and the property definitions
     * which are referred to in the cardinalities of the resource classes that have been returned.
     *
     * @param {Object} ontology the ontology to be cached.
     */
    private convertAndWriteAllEntityDefinitionsForOntologyToCache(ontology: Object): void {

        const graph = ontology['@graph'];

        const classDefs = graph.filter(
            (entity: Object) => {
                const entityType = entity['@type'];
                return entityType === KnoraConstants.OwlClass;
            });

        const propertyDefs = graph.filter(
            (entity: Object) => {
                const entityType = entity['@type'];
                return entityType === KnoraConstants.OwlObjectProperty ||
                    entityType === KnoraConstants.OwlDatatypeProperty ||
                    entityType === KnoraConstants.OwlAnnotationProperty ||
                    entityType === KnoraConstants.RdfProperty;
            });


        this.cacheOntology.resourceClassIrisForOntology[ontology['@id']] = this.getResourceClassIrisFromOntologyResponse(classDefs);

        this.convertAndWriteEntityDefinitionsToCache(classDefs, propertyDefs);

    }

    /**
     * Gets resource class definitions for the requested ontologies from the cache.
     *
     * @param {string[]} ontologyIris the ontologies for which resource classes should be returned.
     * @returns {OntologyInformation} an [[OntologyInformation]] representing the requested information.
     */
    private getOntologyInformationFromCache(ontologyIris: string[]): Observable<OntologyInformation> {

        const resourceClassesForOntology = new ResourceClassIrisForOntology();

        // collect resource class Iris for all requested named graphs
        let allResourceClassIris = [];

        for (const ontologyIri of ontologyIris) {

            if (this.cacheOntology.resourceClassIrisForOntology[ontologyIri] === undefined) {
                throw new OntologyCacheError(`getResourceClassesForOntologiesFromCache: ontology not found in cache: ${ontologyIri}`);
            }

            // add information for the given named graph
            resourceClassesForOntology[ontologyIri] = this.cacheOntology.resourceClassIrisForOntology[ontologyIri];

            // add all resource class Iris of this named graph
            allResourceClassIris = allResourceClassIris.concat(this.cacheOntology.resourceClassIrisForOntology[ontologyIri]);
        }

        // get resource class definitions for all named graphs
        return this.getResourceClassDefinitions(allResourceClassIris).pipe(
            map(
                resClassDefs => {
                    return new OntologyInformation(
                        resourceClassesForOntology, resClassDefs.getResourceClasses(), resClassDefs.getProperties()
                    );
                }
            )
        );

    }

    /**
     * Converts a Knora ontology response into an internal representation and caches it.
     *
     * @param {Object} resourceClassDefinitions the resource class definitions returned by Knora.
     * @param {Object} propertyClassDefinitions the property definitions returned by Knora.
     */
    private convertAndWriteEntityDefinitionsToCache(resourceClassDefinitions: Array<Object>, propertyClassDefinitions: Array<Object>): void {

        // convert and cache each given resource class definition
        for (const resClass of resourceClassDefinitions) {

            const resClassIri = resClass['@id'];

            // represents all cardinalities of this resource class
            const cardinalities: Cardinality[] = [];

            if (resClass[KnoraConstants.RdfsSubclassOf] !== undefined) {

                let subclassOfCollection;

                // check if it is a single object or a collection
                if (!Array.isArray(resClass[KnoraConstants.RdfsSubclassOf])) {
                    subclassOfCollection = [resClass[KnoraConstants.RdfsSubclassOf]];
                } else {
                    subclassOfCollection = resClass[KnoraConstants.RdfsSubclassOf];
                }


                // get cardinalities for the properties of a resource class
                for (const curCard of subclassOfCollection) {

                    // make sure it is a cardinality (it could also be an Iri of a superclass)
                    if (curCard instanceof Object && curCard['@type'] !== undefined && curCard['@type'] === KnoraConstants.OwlRestriction) {

                        let newCard;

                        // get occurrence
                        if (curCard[KnoraConstants.OwlMinCardinality] !== undefined) {
                            newCard = new Cardinality(CardinalityOccurrence.minCard, curCard[KnoraConstants.OwlMinCardinality], curCard[KnoraConstants.OwlOnProperty]['@id']);
                        } else if (curCard[KnoraConstants.OwlCardinality] !== undefined) {
                            newCard = new Cardinality(CardinalityOccurrence.card, curCard[KnoraConstants.OwlCardinality], curCard[KnoraConstants.OwlOnProperty]['@id']);
                        } else if (curCard[KnoraConstants.OwlMaxCardinality] !== undefined) {
                            newCard = new Cardinality(CardinalityOccurrence.maxCard, curCard[KnoraConstants.OwlMaxCardinality], curCard[KnoraConstants.OwlOnProperty]['@id']);
                        } else {
                            // no known occurrence found
                            throw new TypeError(`cardinality type invalid for ${resClass['@id']} ${curCard[KnoraConstants.OwlOnProperty]}`);
                        }

                        // add cardinality
                        cardinalities.push(newCard);

                    }

                }
            }

            const resClassObj = new ResourceClass(
                resClassIri,
                resClass[KnoraConstants.ResourceIcon],
                resClass[KnoraConstants.RdfsComment],
                resClass[KnoraConstants.RdfsLabel],
                cardinalities
            );

            // write this resource class definition to the cache object
            this.cacheOntology.resourceClasses[resClassIri] = resClassObj;
        }

        // cache the property definitions referred to by the cardinalities of the given resource classes
        this.convertAndWriteKnoraPropertyDefinitionsToOntologyCache(propertyClassDefinitions);
    }

    /**
     * Gets information about resource classes from the cache.
     * The answer includes the property definitions referred to by the cardinalities og the given resource classes.
     *
     * @param resClassIris the given resource class Iris
     * @returns {ResourceClasses} an [[OntologyCache]] representing the requested resource classes.
     */
    private getResourceClassDefinitionsFromCache(resClassIris: string[]): Observable<OntologyInformation> {
        // collect the definitions for each resource class from the cache

        const resClassDefs = new ResourceClasses();

        // collect the properties from the cardinalities of the given resource classes
        const propertyIris = [];

        resClassIris.forEach(
            resClassIri => {
                resClassDefs[resClassIri] = this.cacheOntology.resourceClasses[resClassIri];

                this.cacheOntology.resourceClasses[resClassIri].cardinalities.forEach(
                    card => {
                        propertyIris.push(card.property);
                    }
                );
            });

        return this.getPropertyDefinitions(propertyIris).pipe(
            map(
                propDefs => {
                    return new OntologyInformation(new ResourceClassIrisForOntology(), resClassDefs, propDefs.getProperties());
                }
            )
        );

    }

    /**
     * Convert a Knora response for ontology information about properties
     * into an internal representation and cache it.
     *
     * @param {Object} propertyDefinitionsFromKnora the property definitions returned by Knora
     */
    private convertAndWriteKnoraPropertyDefinitionsToOntologyCache(propertyDefinitionsFromKnora: Array<Object>): void {

        // convert and cache each given property definition
        for (const propDef of propertyDefinitionsFromKnora) {

            const propIri = propDef['@id'];

            let isEditable = false;
            if (propDef[KnoraConstants.isEditable] !== undefined && propDef[KnoraConstants.isEditable] === true) {
                isEditable = true;
            }

            let isLinkProperty = false;
            if (propDef[KnoraConstants.isLinkProperty] !== undefined && propDef[KnoraConstants.isLinkProperty] === true) {
                isLinkProperty = true;
            }

            let isLinkValueProperty = false;
            if (propDef[KnoraConstants.isLinkValueProperty] !== undefined && propDef[KnoraConstants.isLinkValueProperty] === true) {
                isLinkValueProperty = true;
            }

            let subPropertyOf = [];
            if (propDef[KnoraConstants.subPropertyOf] !== undefined && Array.isArray(propDef[KnoraConstants.subPropertyOf])) {
                subPropertyOf = propDef[KnoraConstants.subPropertyOf].map((superProp: Object) => superProp['@id']);
            } else if (propDef[KnoraConstants.subPropertyOf] !== undefined) {
                subPropertyOf.push(propDef[KnoraConstants.subPropertyOf]['@id']);
            }

            let objectType;
            if (propDef[KnoraConstants.ObjectType] !== undefined) {
                objectType = propDef[KnoraConstants.ObjectType]['@id'];
            }

            // cache property definition
            this.cacheOntology.properties[propIri] = new Property(
                propIri,
                objectType,
                propDef[KnoraConstants.RdfsComment],
                propDef[KnoraConstants.RdfsLabel],
                subPropertyOf,
                isEditable,
                isLinkProperty,
                isLinkValueProperty
            );

        }

    }

    /**
     * Gets property definitions from the cache.
     *
     * @param {string[]} propertyIris the property definitions to be returned.
     * @returns {OntologyCache}
     */
    private getPropertyDefinitionsFromCache(propertyIris: string[]): OntologyInformation {

        const propertyDefs = new Properties();

        propertyIris.forEach(
            propIri => {
                // ignore non Knora props: if propIri is contained in excludedProperties, skip this propIri
                if (this.excludedProperties.indexOf(propIri) > -1) {
                    return;
                }

                if (this.cacheOntology.properties[propIri] === undefined) {
                    throw new OntologyCacheError(`getPropertyDefinitionsFromCache: property not found in cache: ${propIri}`);
                }

                propertyDefs[propIri] = this.cacheOntology.properties[propIri];
            }
        );

        return new OntologyInformation(new ResourceClassIrisForOntology(), new ResourceClasses(), propertyDefs);

    }

    /**
     * Gets all named graphs.
     *
     * @returns {Observable<Array<OntologyMetadata>>}
     */
    public getOntologiesMetadata(): Observable<Array<OntologyMetadata>> {

        if (this.cacheOntology.ontologies.length === 0) {
            return this.getOntologiesMetadataFromKnora().pipe(
                map(
                    metadata => {
                        this.convertAndWriteOntologiesMetadataToCache(metadata['@graph'].filter((onto) => {
                            // ignore excluded ontologies
                            return this.excludedOntologies.indexOf(onto['@id']) === -1;
                        }));
                        return this.getAllOntologiesMetadataFromCache();
                    }
                )
            );
        } else {
            return of(this.getAllOntologiesMetadataFromCache());
        }

    }


    /**
     * Gets the requested ontologies from Knora if necessary, adding them to the cache.
     *
     * @param {string[]} ontologyIris Iris of the ontologies to be queried.
     */
    public getAndCacheOntologies(ontologyIris: string[]): Observable<any[]> {

        const observables = [];

        ontologyIris.forEach(ontologyIri => {
            observables.push(this.getAllEntityDefinitionsForOntologyFromKnora(ontologyIri).pipe(
                map(
                    (ontology: Object) => {
                        // write to cache
                        this.convertAndWriteAllEntityDefinitionsForOntologyToCache(ontology);
                    }
                )
            ));
        });

        return forkJoin(observables);
    }


    /**
     * Get the entity definitions for the given ontologies.
     *
     * @param {string[]} ontologyIris Iris of the ontologies to be queried.
     */
    public getEntityDefinitionsForOntologies(ontologyIris: string[]): Observable<OntologyInformation> {

        const ontologyIrisToQuery = ontologyIris.filter(
            ontologyIri => {
                // return the ontology Iris that are not cached yet
                return this.cacheOntology.resourceClassIrisForOntology[ontologyIri] === undefined;
            });

        if (ontologyIrisToQuery.length > 0) {

            return this.getAndCacheOntologies(ontologyIrisToQuery).pipe(
                mergeMap(
                    results => {
                        return this.getOntologyInformationFromCache(ontologyIris);
                    }
                )
            );
        } else {

            return this.getOntologyInformationFromCache(ontologyIris);
        }

    }

    /**
     * Get definitions for the given resource class Iris.
     * If the definitions are not already in the cache, the will be retrieved from Knora and cached.
     *
     * @param resourceClassIris the given resource class Iris
     * @returns {Observable<OntologyCache>} an OntologyCache instance representing the requested resource classes (including properties).
     */
    public getResourceClassDefinitions(resourceClassIris: string[]): Observable<OntologyInformation> {

        const resClassIrisToQueryFor: string[] = resourceClassIris.filter(
            resClassIri => {

                // return the resource class Iris that are not cached yet
                return this.cacheOntology.resourceClasses[resClassIri] === undefined;

            });

        if (resClassIrisToQueryFor.length > 0) {

            // get a set of ontology Iris that have to be queried to obtain the missing resource classes
            const ontologyIris: string[] = resClassIrisToQueryFor.map(
                resClassIri => {
                    return Utils.getOntologyIriFromEntityIri(resClassIri);
                }
            ).filter(Utils.filterOutDuplicates);

            // obtain missing resource class information
            return this.getAndCacheOntologies(ontologyIris).pipe(
                mergeMap(
                    results => {

                        return this.getResourceClassDefinitionsFromCache(resourceClassIris);
                    }
                )
            );
        } else {

            return this.getResourceClassDefinitionsFromCache(resourceClassIris);

        }
    }

    /**
     * Get definitions for the given property Iris.
     * If the definitions are not already in the cache, the will be retrieved from Knora and cached.
     *
     * @param {string[]} propertyIris the Iris of the properties to be returned .
     * @returns {Observable<OntologyCache>}  an OntologyCache instance containing the requested properties.
     */
    public getPropertyDefinitions(propertyIris: string[]): Observable<OntologyInformation> {

        const propertiesToQuery: string[] = propertyIris.filter(
            propIri => {

                // ignore non Knora props: if propIri is contained in excludedProperties, skip this propIri
                if (this.excludedProperties.indexOf(propIri) > -1) {
                    return false;
                }

                // return the property Iris that are not cached yet
                return this.cacheOntology.properties[propIri] === undefined;
            }
        );

        if (propertiesToQuery.length > 0) {

            // get a set of ontology Iris that have to be queried to obtain the missing properties
            const ontologyIris: string[] = propertiesToQuery.map(
                propIri => {
                    return Utils.getOntologyIriFromEntityIri(propIri);
                }
            ).filter(Utils.filterOutDuplicates);

            // obtain missing resource class information
            return this.getAndCacheOntologies(ontologyIris).pipe(
                map(
                    results => {
                        if (results) {

                            return this.getPropertyDefinitionsFromCache(propertyIris);
                        } else {
                            throw new Error('Problem with: return this.getPropertyDefinitionsFromCache(propertyIris);');
                        }
                    }
                )
            );
        } else {
            return of(this.getPropertyDefinitionsFromCache(propertyIris));
        }
    }
}
