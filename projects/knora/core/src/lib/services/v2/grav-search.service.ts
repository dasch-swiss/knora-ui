import { Injectable } from '@angular/core';
import { ExtendedSearchParams, SearchParamsService } from './search-params.service';
import { KnoraConstants, KnoraSchema, Utils } from '../../declarations';
import { PropertyWithValue } from '../../declarations/api/operators';

/**
 * Represents an error that occurred when generating KnarQL.
 */
class GravsearchGenerationError extends Error {

    constructor(msg: string) {
        super(msg);
    }
}

@Injectable({
    providedIn: 'root'
})
export class GravsearchGenerationService {

    // map of complex knora-api value types to simple ones
    public static typeConversionComplexToSimple = {
        'http://api.knora.org/ontology/knora-api/v2#IntValue': KnoraConstants.xsdInteger, // use computed property name: http://www.ecma-international.org/ecma-262/6.0/#sec-object-initializer
        'http://api.knora.org/ontology/knora-api/v2#DecimalValue': KnoraConstants.xsdDecimal,
        'http://api.knora.org/ontology/knora-api/v2#BooleanValue': KnoraConstants.xsdBoolean,
        'http://api.knora.org/ontology/knora-api/v2#TextValue': KnoraConstants.xsdString,
        'http://api.knora.org/ontology/knora-api/v2#DateValue': KnoraConstants.dateSimple,
        'http://api.knora.org/ontology/knora-api/v2#IntervalValue': KnoraConstants.intervalSimple,
        'http://api.knora.org/ontology/knora-api/v2#GeomValue': KnoraConstants.geomSimple,
        'http://api.knora.org/ontology/knora-api/v2#ColorValue': KnoraConstants.colorSimple,
        'http://api.knora.org/ontology/knora-api/v2#GeonameValue': KnoraConstants.geonameSimple,
        'http://api.knora.org/ontology/knora-api/v2#UriValue': KnoraConstants.xsdUri,
        'http://api.knora.org/ontology/knora-api/v2#StillImageFileValue': KnoraConstants.fileSimple,
        'http://api.knora.org/ontology/knora-api/v2#FileValue': KnoraConstants.fileSimple,
        'http://api.knora.org/ontology/knora-api/v2#MovingImageFileValue': KnoraConstants.fileSimple,
        'http://api.knora.org/ontology/knora-api/v2#DDDFileValue': KnoraConstants.fileSimple,
        'http://api.knora.org/ontology/knora-api/v2#AudioFileValue': KnoraConstants.fileSimple,
        'http://api.knora.org/ontology/knora-api/v2#DocumentFileValue': KnoraConstants.fileSimple,
        'http://api.knora.org/ontology/knora-api/v2#TextFileValue': KnoraConstants.fileSimple,
        'http://api.knora.org/ontology/knora-api/v2#ListValue': KnoraConstants.xsdString
    };

    constructor(private _searchParamsService: SearchParamsService) { }

    /**
       * Converts a complex type Iri to a simple type Iri.
       *
       * @param {string} complexType the Iri of a value type (knora-api complex).
       * @returns {string} the corresponding Iri of the simple type (knora-api simple).
       */
    private convertComplexTypeToSimpleType(complexType: string): string {

        const simpleType: string = GravsearchGenerationService.typeConversionComplexToSimple[complexType];

        if (simpleType !== undefined) {
            return simpleType;
        } else {
            throw new GravsearchGenerationError(`complex type ${complexType} could not be converted to simple type.`);
        }

    }

    /**
       * Generates a Gravsearch query from the provided arguments.
       *
       * @param {PropertyWithValue[]} properties the properties specified by the user.
       * @param {string} mainResourceClassOption the class of the main resource, if specified.
       * @param offset the offset to be used (nth page of results).
       * @returns {string} a KnarQL query string.
       */
    public createGravsearchQuery(properties: PropertyWithValue[], mainResourceClassOption?: string, offset: number = 0): string {

        // class restriction for the resource searched for
        let mainResourceClass = '';

        // if given, create the class restriction for the main resource
        if (mainResourceClassOption !== undefined) {
            mainResourceClass = `?mainRes a <${Utils.convertComplexKnoraApiEntityIritoSimple(mainResourceClassOption)}> .`;
        }

        // criteria for the order by statement
        const orderByCriteria = [];

        // statements to be returned in query results
        const returnStatements = [];

        // loop over given properties and create statements and Filters and type annotations from them
        const props: string[] = properties.map(
            (propWithVal: PropertyWithValue, index: number) => {

                const propIriSimple = Utils.convertComplexKnoraApiEntityIritoSimple(propWithVal.property.id);

                let simpleType;
                if (!propWithVal.property.isLinkProperty) {
                    simpleType = this.convertComplexTypeToSimpleType(propWithVal.property.objectType);
                } else {
                    simpleType = KnoraConstants.resourceSimple;
                }

                // represents the object of a statement
                let propValue;
                if (!propWithVal.property.isLinkProperty || propWithVal.valueLiteral.comparisonOperator.getClassName() === 'Exists') {
                    // it is not a linking property, create a variable for the value (to be used by a subsequent FILTER)
                    // OR the comparison operator Exists is used in which case we do not need to specify the object any further
                    propValue = `?propVal${index}`;
                } else {
                    // it is a linking property and the comparison operator is not Exists, use its IRI
                    propValue = propWithVal.valueLiteral.value.toSparql(KnoraSchema.simple);
                }

                // generate statement
                let statement: string = `?mainRes <${propIriSimple}> ${propValue} .`;

                // type annotations
                const propTypeAnnotation = `<${propIriSimple}> knora-api:objectType <${simpleType}> .`;
                const propValueAnnotation = `${propValue} a <${simpleType}> .`;

                // check if it is a linking property that has to be wrapped in a FILTER NOT EXISTS (comparison operator NOT_EQUALS) to negate it
                if (propWithVal.property.isLinkProperty && propWithVal.valueLiteral.comparisonOperator.getClassName() === 'NotEquals') {
                    // do not include statement in results, because the query checks for the absence of this statement
                    statement = `FILTER NOT EXISTS {
${statement}
${propTypeAnnotation}
${propValueAnnotation}
}`;
                } else {
                    // TODO: check if statement should be returned returned in results (Boolean flag from checkbox)
                    returnStatements.push(statement);
                    statement = `
${statement}
${propTypeAnnotation}
${propValueAnnotation}
`;
                }

                // generate filter if comparison operator is not Exists
                let filter: string = '';
                // only create a FILTER if the comparison operator is not EXISTS and it is not a linking property
                if (!propWithVal.property.isLinkProperty && propWithVal.valueLiteral.comparisonOperator.getClassName() !== 'Exists') {

                    if (propWithVal.valueLiteral.comparisonOperator.getClassName() === 'Like') {
                        // use regex function for LIKE
                        filter = `FILTER regex(${propValue}, ${propWithVal.valueLiteral.value.toSparql(KnoraSchema.simple)}, "i")`;
                    } else if (propWithVal.valueLiteral.comparisonOperator.getClassName() === 'Match') {
                        // use contains function for MATCH
                        filter = `FILTER <${KnoraConstants.matchFunction}>(${propValue}, ${propWithVal.valueLiteral.value.toSparql(KnoraSchema.simple)})`;
                    } else {
                        filter = `FILTER(${propValue} ${propWithVal.valueLiteral.comparisonOperator.type} ${propWithVal.valueLiteral.value.toSparql(KnoraSchema.simple)})`;
                    }
                }

                // check if current value is a sort criterion
                if (propWithVal.isSortCriterion) orderByCriteria.push(propValue);

                return `${statement}
${filter}
`;

            });

        let orderByStatement = '';

        if (orderByCriteria.length > 0) {
            orderByStatement = `
ORDER BY ${orderByCriteria.join(' ')};
`;
        }

        // template of the KnarQL query with dynamic components
        const gravsearchTemplate = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .

${returnStatements.join('\n')}

} WHERE {

?mainRes a knora-api:Resource .

${mainResourceClass}

${props.join('')}

}
${orderByStatement}`;

        // offset component of the KnarQL query
        const offsetTemplate = `
OFFSET ${offset}
`;

        // function that generates the same KnarQL query with the given offset
        const generateGravsearchQueryWithCustomOffset = (localOffset: number): string => {
            const offsetCustomTemplate = `
OFFSET ${localOffset}
`;

            return gravsearchTemplate + offsetCustomTemplate;
        };

        if (offset === 0) {
            // store the function so another KnarQL query can be created with an increased offset
            this._searchParamsService.changeSearchParamsMsg(new ExtendedSearchParams(generateGravsearchQueryWithCustomOffset));
        }

        // console.log(knarqlTemplate + offsetTemplate);

        return gravsearchTemplate + offsetTemplate;

    }

}
