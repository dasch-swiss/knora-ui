import { Injectable } from '@angular/core';
import { ApiServiceResult } from '../../declarations/api-service-result';
import { KnoraConstants } from '../../declarations/api/knora-constants';
import { Utils } from '../../declarations/utils';
import { OntologyService } from './ontology.service';
import { forkJoin, from, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

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
     * @hideconstructor
     *
     * @param {string} id Iri identifying the ontology.
     * @param {string} label a label describing the ontology.
     */
    constructor(readonly id: string,
        readonly label: string) {

    }

}


/**
 * Occurrence of a property for a resource class (its cardinality).
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
     * @param {string} id Iri identifying the resource class.
     * @param {string} icon path to an icon representing the resource class.
     * @param {string} comment comment on the resource class.
     * @param {string} label label describing the resource class.
     * @param {Cardinality[]} cardinalities the resource class's properties.
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
     * @param {string} id Iri identifying the property definition.
     * @param {string} objectType the property's object constraint.
     * @param {string} comment comment on the property definition.
     * @param {string} label label describing the property definition.
     * @param {string[]} subPropertyOf Iris of properties the given property is a subproperty of.
     * @param {boolean} isEditable indicates whether the given property can be edited by the client.
     * @param {boolean} isLinkProperty indicates whether the given property is a linking property.
     * @param {boolean} isLinkValueProperty indicates whether the given property refers to a link value.
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
 * This cache is updated whenever new definitions are requested from Knora.
 *
 * Requested ontology information by a service is represented by [[OntologyInformation]].
 */
class OntologyCache {

    /**
     * @param {OntologyMetadata[]} ontologies An array of all existing ontologies.
     */
    ontologies: Array<OntologyMetadata>;

    /**
     * @param {ResourceClassIrisForOntology} resourceClassIrisForOntology list of all resource class Iris for a named graph.
     */
    resourceClassIrisForOntology: ResourceClassIrisForOntology;

    /**
     * @param {ResourceClasses} resourceClasses resource class definitions.
     */
    resourceClasses: ResourceClasses;

    /**
     * @param {Properties} properties property definitions.
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
 *
 * For every request, an instance of this class is returned containing the requested information.
 */
export class OntologyInformation {

    /**
     * @param {ResourceClassIrisForOntology} resourceClassesForOntology all resource class Iris for a given ontology.
     * @param {ResourceClasses} resourceClasses resource class definitions.
     * @param {Properties} properties property definitions.
     */
    constructor(
        private resourceClassesForOntology: ResourceClassIrisForOntology,
        private resourceClasses: ResourceClasses,
        private properties: Properties) {
    }

    /**
     * Merge the given [[OntologyInformation]] into the current instance,
     * updating the existing information.
     * This is necessary when a service like the search fetches new results
     * that have to be added to an existing collection.
     * The existing ontology information must not be lost.
     *
     * @param {OntologyInformation} ontologyInfo the given definitions that have to be integrated.
     * @returns void
     */
    updateOntologyInformation(ontologyInfo: OntologyInformation): void {

        // get new resourceClassIrisForOntology
        const newResourceClassesForOntology: ResourceClassIrisForOntology = ontologyInfo.getResourceClassForOntology();

        // update new resourceClassIrisForOntology
        // tslint:disable-next-line:forin
        for (const newResClassForOntology in newResourceClassesForOntology) {
            this.resourceClassesForOntology[newResClassForOntology] = newResourceClassesForOntology[newResClassForOntology];
        }

        // get new resource class definitions
        const newResourceClasses = ontologyInfo.getResourceClasses();

        // update resourceClasses
        // tslint:disable-next-line:forin
        for (const newResClass in newResourceClasses) {
            this.resourceClasses[newResClass] = newResourceClasses[newResClass];
        }

        // get new property definitions
        const newProperties = ontologyInfo.getProperties();

        // update properties
        // tslint:disable-next-line:forin
        for (const newProp in newProperties) {
            this.properties[newProp] = newProperties[newProp];
        }

    }

    /**
     * Returns resource class definitions for ontologies.
     *
     * @returns ResourceClassIrisForOntology - all resource class definitions grouped by ontologies.
     */
    getResourceClassForOntology(): ResourceClassIrisForOntology {
        return this.resourceClassesForOntology;
    }

    /**
     * Returns all resource classes as an object.
     *
     * @returns ResourceClasses - all resource class definitions as an object.
     */
    getResourceClasses(): ResourceClasses {
        return this.resourceClasses;
    }

    /**
     * Returns all resource classes as an array.
     *
     * @param {boolean} sortAsc sort resource classes by label in ascending order by default
     * @returns ResourceClass[]
     */
    getResourceClassesAsArray(sortAsc: boolean = true): Array<ResourceClass> {

        const resClasses: Array<ResourceClass> = [];

        // tslint:disable-next-line:forin
        for (const resClassIri in this.resourceClasses) {
            const resClass: ResourceClass = this.resourceClasses[resClassIri];
            resClasses.push(resClass);
        }

        // resourceClasses order by label in ascending order
        resClasses.sort((a: ResourceClass, b: ResourceClass) => {
            // dealing with 'undefined' labels
            if (a.label === undefined) {
                return 1;
            } else if (b.label === undefined) {
                return -1;
            }

            if (a.label.toLowerCase() < b.label.toLowerCase()) {
                return -1;
            } else if (a.label.toLowerCase() > b.label.toLowerCase()) {
                return 1;
            } else {
                return 0;
            }
        });

        // resourceClasses order by label in descending order
        if (!sortAsc) {
            resClasses.reverse();
        }

        return resClasses;

    }

    /**
     * Returns a resource class's label.
     *
     * @param {string} resClass resource class to query for.
     * @returns string - the resource class's label.
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
     * Returns all properties as an object.
     *
     * @returns Properties - all properties as an object.
     */
    getProperties(): Properties {
        return this.properties;
    }

    /**
     * Returns all properties as an array.
     *
     * @param {boolean} sortAsc sort properties by label in ascending order by default
     * @returns Property[] - all properties as an array.
     */
    getPropertiesAsArray(sortAsc: boolean = true): Array<Property> {

        const properties: Array<Property> = [];

        // tslint:disable-next-line:forin
        for (const propIri in this.properties) {
            const prop: Property = this.properties[propIri];
            properties.push(prop);
        }

        // properties order by label in ascending order
        properties.sort((a: Property, b: Property) => {
            // dealing with 'undefined' labels
            if (a.label === undefined) {
                return 1;
            } else if (b.label === undefined) {
                return -1;
            }

            if (a.label.toLowerCase() < b.label.toLowerCase()) {
                return -1;
            } else if (a.label.toLowerCase() > b.label.toLowerCase()) {
                return 1;
            } else {
                return 0;
            }
        });

        // properties order by label in descending order
        if (!sortAsc) {
            properties.reverse();
        }

        return properties;

    }

    /**
     * Returns a property's label.
     *
     * @param {string} property to query for.
     * @returns string - the property's label.
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
 * Requests ontology information from Knora and caches it.
 * Other components or services obtain ontology information through this service.
 */
@Injectable({
    providedIn: 'root'
})
export class OntologyCacheService {

    /**
     * Ontologies ingored by this service.
     * @param {string[]} excludedOntologies
     */
    private excludedOntologies: Array<string> = [KnoraConstants.SalsahGuiOntology, KnoraConstants.StandoffOntology];

    /**
     * @param {string[]} excludedProperties properties that Knora is not responsible for and that have to be ignored because they cannot be resolved at the moment.
     */
    private excludedProperties: Array<string> = [KnoraConstants.RdfsLabel];

    /**
     * @param {string[]} nonResourceClasses class definitions that are not be treated as Knora resource classes
     */
    private nonResourceClasses: Array<string> = [KnoraConstants.ForbiddenResource, KnoraConstants.XMLToStandoffMapping, KnoraConstants.ListNode];

    /**
     * @param {OntologyCache} cacheOntology central instance that caches all definitions
     */
    private cacheOntology: OntologyCache = new OntologyCache();

    constructor(private _ontologyService: OntologyService) {
    }

    /**
     * Requests the metadata of all ontologies from Knora.
     *
     * @returns Observable<object> - metadata for all ontologies as JSON-LD (no prefixes, all Iris fully expanded).
     */
    private getOntologiesMetadataFromKnora(): Observable<object> {

        return this._ontologyService.getOntologiesMetadata().pipe(
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
     * Requests all entity definitions (resource classes and properties) for the given ontology from Knora.
     *
     * @param {string} ontologyIri the Iri of the requested ontology.
     * @returns Observable<object> - metadata for all entity definitions for ontology from Knora.
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
     * @param {object[]} ontologies metadata of all existing ontologies as JSON-LD.
     * @returns a new OntologyMetadata object
     */
    private convertAndWriteOntologiesMetadataToCache(ontologies: object[]) {

        this.cacheOntology.ontologies = ontologies.map(
            ontology => {
                return new OntologyMetadata(ontology['@id'], ontology[KnoraConstants.RdfsLabel]);
            }
        );
    }

    /**
     * Returns all ontologies' metadata from the cache and returns them.
     *
     * @returns Array<OntologyMetadata> - metadata of all existing ontologies.
     */
    private getAllOntologiesMetadataFromCache(): Array<OntologyMetadata> {

        return this.cacheOntology.ontologies;

    }

    /**
     * Returns resource class Iris from the ontology response.
     * `knora-api:Resource` will be excluded.
     *
     * @param {Array<object>} classDefinitions the class definitions in an ontology response.
     * @returns string[] - resource class Iris from the given class definitions.
     */
    private getResourceClassIrisFromOntologyResponse(classDefinitions: Array<object>): string[] {
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
     * Knora automatically includes the property definitions referred to in the cardinalities of resource classes.
     * If they are defined in another ontology, that ontology is requested from Knora too.
     *
     * @param {Object} ontology the ontology to be cached.
     * @returns void
     */
    private convertAndWriteAllEntityDefinitionsForOntologyToCache(ontology: object): void {

        const graph = ontology['@graph'];

        // get all class definitions
        const classDefs = graph.filter(
            (entity: Object) => {
                const entityType = entity['@type'];
                return entityType === KnoraConstants.OwlClass;
            });

        // get all property definitions
        const propertyDefs = graph.filter(
            (entity: Object) => {
                const entityType = entity['@type'];
                return entityType === KnoraConstants.OwlObjectProperty ||
                    entityType === KnoraConstants.OwlDatatypeProperty ||
                    entityType === KnoraConstants.OwlAnnotationProperty ||
                    entityType === KnoraConstants.RdfProperty;
            });


        // cache all resource class Iris belonging to the current ontology
        this.cacheOntology.resourceClassIrisForOntology[ontology['@id']] = this.getResourceClassIrisFromOntologyResponse(classDefs);

        // write class and property defintions to cache
        this.convertAndWriteEntityDefinitionsToCache(classDefs, propertyDefs);

    }

    /**
     * Returns definitions for the requested ontologies from the cache.
     *
     * @param {string[]} ontologyIris the ontologies for which definitions should be returned.
     * @returns Observable<OntologyInformation> - the definitions for the requested ontologies.
     */
    private getOntologyInformationFromCache(ontologyIris: string[]): Observable<OntologyInformation> {

        const resourceClassesForOntology = new ResourceClassIrisForOntology();

        // collect resource class Iris for all requested named graphs
        let allResourceClassIris = [];

        for (const ontologyIri of ontologyIris) {

            if (this.cacheOntology.resourceClassIrisForOntology[ontologyIri] === undefined) {
                throw new OntologyCacheError(`getResourceClassesForOntologiesFromCache: ontology not found in cache: ${ontologyIri}`);
            }

            // add information for the given ontology
            resourceClassesForOntology[ontologyIri] = this.cacheOntology.resourceClassIrisForOntology[ontologyIri];

            // add all resource class Iris of this ontology
            allResourceClassIris = allResourceClassIris.concat(this.cacheOntology.resourceClassIrisForOntology[ontologyIri]);
        }

        // get resource class definitions for all requested ontologies
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
     * @param {object[]} resourceClassDefinitions the resource class definitions returned by Knora.
     * @param {object[]} propertyClassDefinitions the property definitions returned by Knora.
     * @returns void
     */
    private convertAndWriteEntityDefinitionsToCache(resourceClassDefinitions: Array<object>, propertyClassDefinitions: Array<object>): void {

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

                        // TODO: get gui order


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

        // cache the property definitions
        this.convertAndWriteKnoraPropertyDefinitionsToOntologyCache(propertyClassDefinitions);
    }

    /**
     * Gets information about resource classes from the cache.
     * The answer includes the property definitions referred to by the cardinalities of the given resource classes.
     *
     * @param {string[]} resClassIris the given resource class Iris
     * @returns Observable<OntologyInformation> - an [[OntologyCache]] representing the requested resource classes.
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
                        // get property definition for each cardinality
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
     * Converts a Knora response for ontology information about properties
     * into an internal representation and cache it.
     *
     * @param {object[]} propertyDefinitionsFromKnora the property definitions returned by Knora
     * @returns void
     */
    private convertAndWriteKnoraPropertyDefinitionsToOntologyCache(propertyDefinitionsFromKnora: Array<object>): void {

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
     * Returns property definitions from the cache.
     *
     * @param {string[]} propertyIris the property definitions to be returned.
     * @returns OntologyInformation - requested property defintions.
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
     * Returns metadata about all ontologies.
     *
     * @returns Observable<Array<OntologyMetadata>> - metadata about all ontologies.
     */
    public getOntologiesMetadata(): Observable<Array<OntologyMetadata>> {

        if (this.cacheOntology.ontologies.length === 0) {
            // nothing in cache yet, get metadata from Knora
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
            // return metadata from cache
            return of(this.getAllOntologiesMetadataFromCache());
        }

    }


    /**
     * Requests the requested ontologies from Knora, adding them to the cache.
     *
     * @param {string[]} ontologyIris Iris of the ontologies to be requested.
     * @returns Observable<any[]>
     */
    private getAndCacheOntologies(ontologyIris: string[]): Observable<any[]> {

        // array to be populated with Observables
        const observables = [];

        // do a request for each ontology
        ontologyIris.forEach(ontologyIri => {
            // push an Observable onto `observables`
            observables.push(this.getAllEntityDefinitionsForOntologyFromKnora(ontologyIri).pipe(
                map(
                    (ontology: object) => {
                        // write response to cache
                        this.convertAndWriteAllEntityDefinitionsForOntologyToCache(ontology);
                    }
                )
            ));
        });

        // forkJoin returns an Observable of an array of results
        // returned by each Observable contained in `observables`
        // a subscription to the Observable returned by forkJoin is executed
        // once all Observables have been completed
        return forkJoin(observables);
    }


    /**
     * Returns the entity definitions for the requested ontologies.
     *
     * @param {string[]} ontologyIris Iris of the ontologies to be queried.
     * @returns Observable<OntologyInformation> - all ontology metadata from the cache
     */
    public getEntityDefinitionsForOntologies(ontologyIris: string[]): Observable<OntologyInformation> {

        const ontologyIrisToQuery = ontologyIris.filter(
            ontologyIri => {
                // return the ontology Iris that are not cached yet
                return this.cacheOntology.resourceClassIrisForOntology[ontologyIri] === undefined;
            });

        // get ontologies that are mot cached yet
        if (ontologyIrisToQuery.length > 0) {

            return this.getAndCacheOntologies(ontologyIrisToQuery).pipe(
                mergeMap(
                    results => {
                        // executed once all ontologies have been cached
                        return this.getOntologyInformationFromCache(ontologyIris);
                    }
                )
            );
        } else {

            return this.getOntologyInformationFromCache(ontologyIris);
        }

    }

    /**
     * Returns the definitions for the given resource class Iris.
     * If the definitions are not already in the cache, the will be retrieved from Knora and cached.
     *
     * Properties contained in the cardinalities will be returned too.
     *
     * @param {string[]} resourceClassIris the given resource class Iris
     * @returns Observable<OntologyInformation> - the requested resource classes (including properties).
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
     * @returns Observable<OntologyInformation> - the requested property definitions.
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
