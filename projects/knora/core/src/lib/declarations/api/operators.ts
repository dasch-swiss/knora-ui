import { KnoraConstants, KnoraSchema } from './knora-constants';
import { Property } from '../../services/knora-v2/ontology-cache.service';
import { GravSearchService } from '../../services/v2/grav-search.service';


/**
 * An abstract interface representing a comparison operator.
 * This interface is implemented for the supported comparison operators.
 */
export interface ComparisonOperator {

    // type of comparison operator
    type: string;

    // the label of the comparison operator to be presented to the user.
    label: string;

    // returns the class name when called on an instance
    getClassName(): string;
}

export class Equals implements ComparisonOperator {

    type = KnoraConstants.EqualsComparisonOperator;
    label = KnoraConstants.EqualsComparisonLabel;

    constructor() {
    }

    getClassName() {
        return 'Equals';
    }
}


export class NotEquals implements ComparisonOperator {

    type = KnoraConstants.NotEqualsComparisonOperator;
    label = KnoraConstants.NotEqualsComparisonLabel;

    constructor() {
    }

    getClassName() {
        return 'NotEquals';
    }
}

export class GreaterThanEquals implements ComparisonOperator {

    type = KnoraConstants.GreaterThanEqualsComparisonOperator;
    label = KnoraConstants.GreaterThanEqualsComparisonLabel;

    constructor() {
    }

    getClassName() {
        return 'GreaterThanEquals';
    }
}

export class GreaterThan implements ComparisonOperator {

    type = KnoraConstants.GreaterThanComparisonOperator;
    label = KnoraConstants.GreaterThanComparisonLabel;

    constructor() {
    }

    getClassName() {
        return 'GreaterThan';
    }
}

export class LessThan implements ComparisonOperator {

    type = KnoraConstants.LessThanComparisonOperator;
    label = KnoraConstants.LessThanComparisonLabel;

    constructor() {
    }

    getClassName() {
        return 'LessThan';
    }
}

export class LessThanEquals implements ComparisonOperator {

    type = KnoraConstants.LessThanEqualsComparisonOperator;
    label = KnoraConstants.LessThanQualsComparisonLabel;

    constructor() {
    }

    getClassName() {
        return 'LessThanEquals';
    }
}


export class Exists implements ComparisonOperator {

    type = KnoraConstants.ExistsComparisonOperator;
    label = KnoraConstants.ExistsComparisonLabel;

    constructor() {
    }

    getClassName() {
        return 'Exists';
    }
}

export class Like implements ComparisonOperator {

    type = KnoraConstants.LikeComparisonOperator;
    label = KnoraConstants.LikeComparisonLabel;

    constructor() {
    }

    getClassName() {
        return 'Like';
    }

}

export class Match implements ComparisonOperator {

    type = KnoraConstants.MatchComparisonOperator;
    label = KnoraConstants.MatchComparisonLabel;

    constructor() {
    }

    getClassName() {
        return 'Match';
    }

}

/**
 * Combination of a comparison operator and a value literal or an IRI.
 * In case the comparison operator is 'Exists', no value is given.
 */
export class ComparisonOperatorAndValue {

    constructor(readonly comparisonOperator: ComparisonOperator, readonly value?: Value) {
    }
}

/**
 * An abstract interface representing a value: an IRI or a literal.
 */
export interface Value {

    /**
     * Turns the value into a SPARQL string representation.
     *
     * @param schema indicates the Knora schema to be used.
     * @returns {string} SPARQL representation of the value.
     */
    toSparql(schema: KnoraSchema): string;

}

/**
 * Represents a property's value as a literal with the indication of its type.
 */
export class ValueLiteral implements Value {

    /**
     * Constructs a [ValueLiteral].
     *
     * @param {string} value the literal representation of the value.
     * @param {string} type the type of the value (making use of xsd).
     */
    constructor(
        public readonly value: string,
        public readonly type: string,
        private _gravSearchService?: GravSearchService) {
    }


    /**
    * Creates a type annotated value literal to be used in a SPARQL query.
    *
    * @param schema indicates the Knora schema to be used.
    * @returns {string}
    */
    public toSparql(schema: KnoraSchema): string {

        let literalType: string;

        // check if a Knora schema conversion is necessary, e.g., knora-api:dateValue (complex) to knora-api:date (simple).
        // xsd types will remain unchanged
        if (schema === KnoraSchema.simple && this._gravSearchService.typeConversionComplexToSimple[this.type] !== undefined) {
            // convert to simple schema
            literalType = this._gravSearchService.typeConversionComplexToSimple[this.type];
        } else {
            // do not convert
            literalType = this.type;
        }

        return `"${this.value}"^^<${literalType}>`;
    }

}

/**
 * Represents an IRI.
 */
export class IRI implements Value {

    /**
     * Constructs an [IRI].
     *
     * @param {string} iri the IRI of a resource instance.
     */
    constructor(readonly iri: string) {
    }

    /**
    * Creates a SPARQL representation of the IRI.
    *
    * @param schema indicates the Knora schema to be used.
    * @returns {string}
    */
    public toSparql(schema: KnoraSchema): string {
        // this is an instance Iri and does not have to be converted.
        return `<${this.iri}>`;
    }

}

/**
 * An abstract interface that represents a value.
 * This interface has to be implemented for all value types (value component classes).
 */
export interface PropertyValue {

    /**
     * Type of the value.
     */
    type: string;

    /**
     * Returns the value.
     *
     * @returns {Value}.
     */
    getValue(): Value;

}

/**
 * Represents a property, the specified comparison operator, and value.
 */
export class PropertyWithValue {

    /**
     * Constructs a [PropertyWithValue].
     *
     * @param {Property} property the specified property.
     * @param {ComparisonOperatorAndValue} valueLiteral the specified comparison operator and value.
     * @param isSortCriterion indicates if the property is used as a sort criterion.
     */
    constructor(
        readonly property: Property,
        readonly valueLiteral: ComparisonOperatorAndValue,
        readonly isSortCriterion: Boolean) {
    }

}

