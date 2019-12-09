/**
 * @deprecated sind v9.5.0
 *
 * You have to use Constants from `@knora/api`
 *
 *
 */
export class KnoraConstantsDepr {

    // The following version of Knora is needed to work properly with this module
    public static KnoraVersion: string = '10.0.0';

    public static KnoraApi: string = 'http://api.knora.org/ontology/knora-api';
    public static PathSeparator: string = '#';

    public static KnoraOntologyPath: string = 'http://www.knora.org/ontology';
    public static KnoraBase: string = KnoraConstantsDepr.KnoraOntologyPath + '/knora-base';
    public static KnoraAdmin: string = KnoraConstantsDepr.KnoraOntologyPath + '/knora-admin';

    public static DefaultSharedOntologyIRI: string = KnoraConstantsDepr.KnoraAdmin + '#DefaultSharedOntologiesProject';
    public static SystemProjectIRI: string = KnoraConstantsDepr.KnoraAdmin + '#SystemProject';
    public static SystemAdminGroupIRI: string = KnoraConstantsDepr.KnoraAdmin + '#SystemAdmin';
    public static ProjectAdminGroupIRI: string = KnoraConstantsDepr.KnoraAdmin + '#ProjectAdmin';
    public static ProjectMemberGroupIRI: string = KnoraConstantsDepr.KnoraAdmin + '#ProjectMember';

    public static KnoraApiV2WithValueObjectPath: string = KnoraConstantsDepr.KnoraApi + '/v2' + KnoraConstantsDepr.PathSeparator;
    public static KnoraApiV2SimplePath: string = KnoraConstantsDepr.KnoraApi + '/simple/v2' + KnoraConstantsDepr.PathSeparator;

    // iri base url in Knora
    public static iriBase: string = 'http://rdfh.ch/';
    public static iriProjectsBase: string = KnoraConstantsDepr.iriBase + 'projects/';
    public static iriUsersBase: string = KnoraConstantsDepr.iriBase + 'users/';
    public static iriListsBase: string = KnoraConstantsDepr.iriBase + 'lists/';

    public static SalsahGuiOntology: string = 'http://api.knora.org/ontology/salsah-gui/v2';

    public static SalsahGuiOrder: string = KnoraConstantsDepr.SalsahGuiOntology + '#guiOrder';
    public static SalsahGuiAttribute: string = KnoraConstantsDepr.SalsahGuiOntology + '#guiAttribute';

    public static StandoffOntology: string = 'http://api.knora.org/ontology/standoff/v2';

    public static Resource: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'Resource';
    public static TextValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'TextValue';
    public static IntValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'IntValue';
    public static BooleanValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'BooleanValue';
    public static UriValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'UriValue';
    public static DecimalValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'DecimalValue';
    public static DateValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'DateValue';
    public static ColorValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'ColorValue';
    public static GeomValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'GeomValue';
    public static ListValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'ListValue';
    public static IntervalValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'IntervalValue';
    public static LinkValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'LinkValue';
    public static GeonameValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'GeonameValue';
    public static FileValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'FileValue';
    public static AudioFileValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'AudioFileValue';
    public static DDDFileValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'DDDFileValue';
    public static DocumentFileValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'DocumentFileValue';
    public static StillImageFileValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'StillImageFileValue';
    public static MovingImageFileValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'MovingImageFileValue';
    public static TextFileValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'TextFileValue';
    public static IsResourceClass: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'isResourceClass';
    public static IsValueClass: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'isValueClass';
    public static ForbiddenResource: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'ForbiddenResource';
    public static XMLToStandoffMapping: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'XMLToStandoffMapping';
    public static ListNode: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'ListNode';

    public static ArkUrl: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'arkUrl';
    public static versionArkUrl: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'versionArkUrl';
    public static ObjectType = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'objectType';

    public static ResourceIcon: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'resourceIcon';
    public static isEditable: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'isEditable';
    public static isLinkProperty: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'isLinkProperty';
    public static isLinkValueProperty: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'isLinkValueProperty';
    public static hasGeometry: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'hasGeometry';

    public static schemaName: string = 'http://schema.org/name';
    public static schemaNumberOfItems: string = 'http://schema.org/numberOfItems';
    public static schemaItemListElement: string = 'http://schema.org/itemListElement';

    public static RdfProperty: string = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Property';
    public static RdfsSchema: string = 'http://www.w3.org/2000/01/rdf-schema' + KnoraConstantsDepr.PathSeparator;
    public static RdfsLabel: string = KnoraConstantsDepr.RdfsSchema + 'label';
    public static RdfsComment: string = KnoraConstantsDepr.RdfsSchema + 'comment';
    public static RdfsSubclassOf: string = KnoraConstantsDepr.RdfsSchema + 'subClassOf';
    public static subPropertyOf: string = KnoraConstantsDepr.RdfsSchema + 'subPropertyOf';

    public static owl: string = 'http://www.w3.org/2002/07/owl';

    public static OwlClass: string = KnoraConstantsDepr.owl + '#Class';
    public static OwlObjectProperty: string = KnoraConstantsDepr.owl + '#ObjectProperty';
    public static OwlDatatypeProperty: string = KnoraConstantsDepr.owl + '#DatatypeProperty';
    public static OwlAnnotationProperty: string = KnoraConstantsDepr.owl + '#AnnotationProperty';
    public static OwlOnProperty: string = KnoraConstantsDepr.owl + '#onProperty';
    public static OwlMaxCardinality: string = KnoraConstantsDepr.owl + '#maxCardinality';
    public static OwlMinCardinality: string = KnoraConstantsDepr.owl + '#minCardinality';
    public static OwlCardinality: string = KnoraConstantsDepr.owl + '#cardinality';
    public static OwlRestriction: string = KnoraConstantsDepr.owl + '#Restriction';

    public static creationDate: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'creationDate';
    public static lastModificationDate: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'lastModificationDate';
    public static hasPermissions: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'hasPermissions';
    public static userHasPermission: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'userHasPermission';
    public static attachedToProject: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'attachedToProject';
    public static attachedToUser: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'attachedToUser';

    public static Region: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'Region';

    public static ReadTextValueAsHtml: string = 'ReadTextValueAsHtml';
    public static ReadTextValueAsString: string = 'ReadTextValueAsString';
    public static ReadTextValueAsXml: string = 'ReadTextValueAsXml';
    public static ReadDateValue: string = 'ReadDateValue';
    public static ReadLinkValue: string = 'ReadLinkValue';
    public static ReadIntegerValue: string = 'ReadIntegerValue';
    public static ReadDecimalValue: string = 'ReadDecimalValue';
    public static ReadStillImageFileValue: string = 'ReadStillImageFileValue';
    public static ReadMovingImageFileValue: string = 'ReadMovingImageFileValue';
    public static ReadAudioFileValue: string = 'ReadAudioFileValue';
    public static ReadTextFileValue: string = 'ReadTextFileValue';
    public static ReadDDDFileValue: string = 'ReadDDDFileValue';
    public static ReadDocumentFileValue: string = 'ReadDocumentFileValue';
    public static ReadGeomValue: string = 'ReadGeomValue';
    public static ReadColorValue: string = 'ReadColorValue';
    public static ReadUriValue: string = 'ReadUriValue';
    public static ReadBooleanValue: string = 'ReadBooleanValue';
    public static ReadIntervalValue: string = 'ReadIntervalValue';
    public static ReadListValue: string = 'ReadListValue';

    public static valueAsString: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'valueAsString';

    public static textValueAsHtml: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'textValueAsHtml';
    public static textValueAsXml: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'textValueAsXml';
    public static textValueHasMapping: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'textValueHasMapping';

    public static hasStandoffLinkToValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'hasStandoffLinkToValue';

    public static dateValueHasStartYear: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'dateValueHasStartYear';
    public static dateValueHasEndYear: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'dateValueHasEndYear';
    public static dateValueHasStartEra: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'dateValueHasStartEra';
    public static dateValueHasEndEra: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'dateValueHasEndEra';
    public static dateValueHasStartMonth: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'dateValueHasStartMonth';
    public static dateValueHasEndMonth: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'dateValueHasEndMonth';
    public static dateValueHasStartDay: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'dateValueHasStartDay';
    public static dateValueHasEndDay: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'dateValueHasEndDay';
    public static dateValueHasCalendar: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'dateValueHasCalendar';

    public static linkValueHasTarget: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'linkValueHasTarget';
    public static linkValueHasSource: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'linkValueHasSource';
    public static linkValueHasSourceIri: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'linkValueHasSourceIri';
    public static linkValueHasTargetIri: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'linkValueHasTargetIri';

    public static integerValueAsInteger: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'intValueAsInt';

    public static decimalValueAsDecimal: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'decimalValueAsDecimal';

    public static fileValueAsUrl: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'fileValueAsUrl';
    public static fileValueIsPreview: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'fileValueIsPreview';
    public static fileValueHasFilename: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'fileValueHasFilename';

    public static hasStillImageFileValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'hasStillImageFileValue';
    public static stillImageFileValueHasDimX: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'stillImageFileValueHasDimX';
    public static stillImageFileValueHasDimY: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'stillImageFileValueHasDimY';
    public static stillImageFileValueHasIIIFBaseUrl: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'stillImageFileValueHasIIIFBaseUrl';

    public static hasMovingImageFileValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'hasMovingImageFileValue';
    public static movingImageFileValueHasDimX: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'movingImageFileValueHasDimX';
    public static movingImageFileValueHasDimY: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'movingImageFileValueHasDimY';
    public static movingImageFileValueHasDuration: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'movingImageFileValueHasDuration';
    public static movingImageFileValueHasFps: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'movingImageFileValueHasFps';

    public static hasAudioFileValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'hasAudioFileValue';
    public static audioFileValueHasDuration: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'audioFileValueHasDuration';

    public static hasDocumentFileValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'hasDocumentFileValue';

    public static hasDDDFileValue: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'hasDDDFileValue';

    public static colorValueAsColor: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'colorValueAsColor';
    public static geometryValueAsGeometry: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'geometryValueAsGeometry';
    public static uriValueAsUri: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'uriValueAsUri';
    public static booleanValueAsBoolean: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'booleanValueAsBoolean';

    public static intervalValueHasStart: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'intervalValueHasStart';
    public static intervalValueHasEnd: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'intervalValueHasEnd';

    public static listValueAsListNode: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'listValueAsListNode';

    public static Xsd: string = 'http://www.w3.org/2001/XMLSchema#';

    public static xsdString: string = KnoraConstantsDepr.Xsd + 'string';
    public static xsdBoolean: string = KnoraConstantsDepr.Xsd + 'boolean';
    public static xsdInteger: string = KnoraConstantsDepr.Xsd + 'integer';
    public static xsdDecimal: string = KnoraConstantsDepr.Xsd + 'decimal';
    public static xsdUri: string = KnoraConstantsDepr.Xsd + 'anyURI';

    public static resourceSimple: string = KnoraConstantsDepr.KnoraApiV2SimplePath + 'Resource';
    public static dateSimple: string = KnoraConstantsDepr.KnoraApiV2SimplePath + 'Date';
    public static intervalSimple: string = KnoraConstantsDepr.KnoraApiV2SimplePath + 'Interval';
    public static geomSimple: string = KnoraConstantsDepr.KnoraApiV2SimplePath + 'Geom';
    public static colorSimple: string = KnoraConstantsDepr.KnoraApiV2SimplePath + 'Color';
    public static geonameSimple: string = KnoraConstantsDepr.KnoraApiV2SimplePath + 'Geoname';
    public static fileSimple: string = KnoraConstantsDepr.KnoraApiV2SimplePath + 'File';
    public static listNodeSimple: string = KnoraConstantsDepr.KnoraApiV2SimplePath + 'ListNode';

    public static matchFunction: string = KnoraConstantsDepr.KnoraApiV2WithValueObjectPath + 'match';

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

    public static SalsahLink: string = 'salsah-link'; // class on an HTML <a> element that indicates a link to a Knora resource
    public static RefMarker: string = 'ref-marker'; // class on an HTML element that refers to another element in the same document

    public static GNDPrefix: string = '(DE-588)';
    public static GNDResolver: string = 'http://d-nb.info/gnd/';

    public static VIAFPrefix: string = '(VIAF)';
    public static VIAFResolver: string = 'https://viaf.org/viaf/';

}


export enum KnoraSchema {
    complex = 0,
    simple = 1
}
