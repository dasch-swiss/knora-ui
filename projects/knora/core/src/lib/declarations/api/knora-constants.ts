export class KnoraConstants {

    // The following version of Knora is needed to work properly with this module
    public static KnoraVersion: string = '12.0.0';

    public static KnoraApi: string = 'http://api.knora.org/ontology/knora-api';
    public static PathSeparator: string = '#';

    // Simple
    public static KnoraApiV2SimplePath: string = KnoraConstants.KnoraApi + '/simple/v2' + KnoraConstants.PathSeparator;
    public static resourceSimple: string = KnoraConstants.KnoraApiV2SimplePath + 'Resource';
    public static dateSimple: string = KnoraConstants.KnoraApiV2SimplePath + 'Date';
    public static intervalSimple: string = KnoraConstants.KnoraApiV2SimplePath + 'Interval';
    public static geomSimple: string = KnoraConstants.KnoraApiV2SimplePath + 'Geom';
    public static colorSimple: string = KnoraConstants.KnoraApiV2SimplePath + 'Color';
    public static geonameSimple: string = KnoraConstants.KnoraApiV2SimplePath + 'Geoname';
    public static fileSimple: string = KnoraConstants.KnoraApiV2SimplePath + 'File';
    public static listNodeSimple: string = KnoraConstants.KnoraApiV2SimplePath + 'ListNode';

    // comparison operators --> TODO: should be moved to search-module!?
    public static EqualsComparisonOperator: string = '=';
    public static EqualsComparisonLabel: string = 'is equal to';

    public static NotEqualsComparisonOperator: string = '!=';
    public static NotEqualsComparisonLabel: string = 'is not equal to';

    public static GreaterThanComparisonOperator: string = '>';
    public static GreaterThanComparisonLabel: string = 'is greater than';

    public static GreaterThanEqualsComparisonOperator: string = '>=';
    public static GreaterThanEqualsComparisonLabel: string = 'is greater than equals to';

    public static LessThanComparisonOperator: string = '<';
    public static LessThanComparisonLabel: string = 'is less than';

    public static LessThanEqualsComparisonOperator: string = '<=';
    public static LessThanQualsComparisonLabel: string = 'is less than equals to';

    public static ExistsComparisonOperator: string = 'E';
    public static ExistsComparisonLabel: string = 'exists';

    public static LikeComparisonOperator: string = 'regex';
    public static LikeComparisonLabel: string = 'is like';

    public static MatchComparisonOperator: string = 'contains';
    public static MatchComparisonLabel: string = 'matches';

    public static MatchFunction: string = KnoraConstants.KnoraApi + '/v2' + KnoraConstants.PathSeparator + 'match';

}

// Knora Schema
export enum KnoraSchema {
    complex = 0,
    simple = 1
}
