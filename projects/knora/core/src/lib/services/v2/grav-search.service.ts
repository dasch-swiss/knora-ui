import { Injectable } from '@angular/core';

import { KnoraConstants, KnoraSchema } from '../../declarations';
import { PropertyWithValue } from '../../declarations/api/operators';

import { ExtendedSearchParams, SearchParamsService } from './search-params.service';

/**
 * @deprecated since v9.5.0
 * Request information about the future of this service on the repository `@knora/api` (github:dasch-swiss/knora-api-js-lib).
 *
 * Create GravSearch queries from provided parameters.
 */
@Injectable({
    providedIn: 'root'
})
export class GravsearchGenerationService {

    /**
     * @ignore
     *
     * Map of complex knora-api value types to simple ones.
     * Use computed property name: http://www.ecma-international.org/ecma-262/6.0/#sec-object-initializer.
     */
    public static typeConversionComplexToSimple = {
        'http://api.knora.org/ontology/knora-api/v2#IntValue': KnoraConstants.xsdInteger,
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
        'http://api.knora.org/ontology/knora-api/v2#ListValue': KnoraConstants.listNodeSimple
    };

    public static complexTypeToProp = {
        'http://api.knora.org/ontology/knora-api/v2#IntValue': KnoraConstants.integerValueAsInteger,
        'http://api.knora.org/ontology/knora-api/v2#DecimalValue': KnoraConstants.decimalValueAsDecimal,
        'http://api.knora.org/ontology/knora-api/v2#BooleanValue': KnoraConstants.booleanValueAsBoolean,
        'http://api.knora.org/ontology/knora-api/v2#TextValue': KnoraConstants.valueAsString,
        'http://api.knora.org/ontology/knora-api/v2#UriValue': KnoraConstants.uriValueAsUri,
        'http://api.knora.org/ontology/knora-api/v2#ListValue': KnoraConstants.listValueAsListNode
    };

    constructor(private _searchParamsService: SearchParamsService) { }

    /**
     * @deprecated since v9.5.0
     *
     * Generates a Gravsearch query from the provided arguments.
     *
     * @param {PropertyWithValue[]} properties the properties specified by the user.
     * @param {string} [mainResourceClassOption] the class of the main resource, if specified.
     * @param {number} offset the offset to be used (nth page of results).
     * @returns string - a KnarQL query string.
     */
    createGravsearchQuery(properties: PropertyWithValue[], mainResourceClassOption?: string, offset: number = 0): string {

        // class restriction for the resource searched for
        let mainResourceClass = '';

        // if given, create the class restriction for the main resource
        if (mainResourceClassOption !== undefined) {
            mainResourceClass = `?mainRes a <${mainResourceClassOption}> .`;
        }

        // criteria for the order by statement
        const orderByCriteria = [];

        // statements to be returned in query results
        const returnStatements = [];

        // loop over given properties and create statements and filters from them
        const props: string[] = properties.map(
            (propWithVal: PropertyWithValue, index: number) => {

                // represents the object of a statement
                let propValue;
                if (!propWithVal.property.isLinkProperty || propWithVal.valueLiteral.comparisonOperator.getClassName() === 'Exists') {
                    // it is not a linking property, create a variable for the value (to be used by a subsequent FILTER)
                    // OR the comparison operator Exists is used in which case we do not need to specify the object any further
                    propValue = `?propVal${index}`;
                } else {
                    // it is a linking property and the comparison operator is not Exists, use its IRI
                    propValue = propWithVal.valueLiteral.value.toSparql(KnoraSchema.complex);
                }

                // generate statement
                let statement: string = `?mainRes <${propWithVal.property.id}> ${propValue} .`;

                // check if it is a linking property that has to be wrapped in a FILTER NOT EXISTS (comparison operator NOT_EQUALS) to negate it
                if (propWithVal.property.isLinkProperty && propWithVal.valueLiteral.comparisonOperator.getClassName() === 'NotEquals') {
                    // do not include statement in results, because the query checks for the absence of this statement
                    statement = `FILTER NOT EXISTS {
${statement}


}`;
                } else {
                    // TODO: check if statement should be returned returned in results (Boolean flag from checkbox)
                    returnStatements.push(statement);
                    statement = `
${statement}


`;
                }

                // generate restricting expression (e.g., a FILTER) if comparison operator is not Exists
                let restriction: string = '';
                // only create a FILTER if the comparison operator is not EXISTS and it is not a linking property
                if (!propWithVal.property.isLinkProperty && propWithVal.valueLiteral.comparisonOperator.getClassName() !== 'Exists') {
                    // generate variable for value literal
                    const propValueLiteral = `${propValue}Literal`;

                    if (propWithVal.valueLiteral.comparisonOperator.getClassName() === 'Like') {
                        // generate statement to value literal
                        restriction = `${propValue} <${GravsearchGenerationService.complexTypeToProp[propWithVal.property.objectType]}> ${propValueLiteral}` + '\n';
                        // use regex function for LIKE
                        restriction += `FILTER regex(${propValueLiteral}, ${propWithVal.valueLiteral.value.toSparql(KnoraSchema.complex)}, "i")`;
                    } else if (propWithVal.valueLiteral.comparisonOperator.getClassName() === 'Match') {
                        // generate statement to value literal
                        restriction = `${propValue} <${GravsearchGenerationService.complexTypeToProp[propWithVal.property.objectType]}> ${propValueLiteral}` + '\n';
                        // use contains function for MATCH
                        restriction += `FILTER <${KnoraConstants.matchFunction}>(${propValueLiteral}, ${propWithVal.valueLiteral.value.toSparql(KnoraSchema.complex)})`;
                    } else if (propWithVal.property.objectType === KnoraConstants.DateValue) {
                        // handle date property
                        restriction = `FILTER(knora-api:toSimpleDate(${propValue}) ${propWithVal.valueLiteral.comparisonOperator.type} ${propWithVal.valueLiteral.value.toSparql(KnoraSchema.complex)})`;
                    } else if (propWithVal.property.objectType === KnoraConstants.ListValue) {
                        // handle list node
                        restriction = `${propValue} <${GravsearchGenerationService.complexTypeToProp[propWithVal.property.objectType]}> ${propWithVal.valueLiteral.value.toSparql(KnoraSchema.complex)}` + '\n';
                        // check for comparison operator "not equals"
                        if (propWithVal.valueLiteral.comparisonOperator.getClassName() === 'NotEquals') {
                            restriction = `FILTER NOT EXISTS {
                                ${restriction}
                            }`;
                        }
                    } else {
                        // generate statement to value literal
                        restriction = `${propValue} <${GravsearchGenerationService.complexTypeToProp[propWithVal.property.objectType]}> ${propValueLiteral}` + '\n';
                        // generate filter expression
                        restriction += `FILTER(${propValueLiteral} ${propWithVal.valueLiteral.comparisonOperator.type} ${propWithVal.valueLiteral.value.toSparql(KnoraSchema.complex)})`;
                    }
                }

                // check if current value is a sort criterion
                if (propWithVal.isSortCriterion) orderByCriteria.push(propValue);

                return `${statement}
${restriction}
`;

            });

        let orderByStatement = '';

        if (orderByCriteria.length > 0) {
            orderByStatement = `
ORDER BY ${orderByCriteria.join(' ')}
`;
        }

        // template of the Gravsearch query with dynamic components
        const gravsearchTemplate = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .

${returnStatements.join('\n')}

} WHERE {

?mainRes a knora-api:Resource .

${mainResourceClass}

${props.join('')}

}
${orderByStatement}`;

        // offset component of the Gravsearch query
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


        return gravsearchTemplate + offsetTemplate;

    }

}
