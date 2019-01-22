export class KnoraConstants {

    public static KnoraApi: string = 'http://api.knora.org/ontology/knora-api';
    public static PathSeparator: string = '#';

    public static KnoraOntologyPath: string = 'http://www.knora.org/ontology';
    public static KnoraBase: string = KnoraConstants.KnoraOntologyPath + '/knora-base';

    public static SystemProjectIRI: string = KnoraConstants.KnoraBase + '#SystemProject';
    public static SystemAdminGroupIRI: string = KnoraConstants.KnoraBase + '#SystemAdmin';
    public static ProjectAdminGroupIRI: string = KnoraConstants.KnoraBase + '#ProjectAdmin';
    public static ProjectMemberGroupIRI: string = KnoraConstants.KnoraBase + '#ProjectMember';

    public static KnoraApiV2WithValueObjectPath: string = KnoraConstants.KnoraApi + '/v2' + KnoraConstants.PathSeparator;
    public static KnoraApiV2SimplePath: string = KnoraConstants.KnoraApi + '/simple/v2' + KnoraConstants.PathSeparator;

    public static SalsahGuiOntology: string = 'http://api.knora.org/ontology/salsah-gui/v2';

    public static SalsahGuiOrder: string = KnoraConstants.SalsahGuiOntology + '#guiOrder';

    public static StandoffOntology: string = 'http://api.knora.org/ontology/standoff/v2';

    public static Resource: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'Resource';
    public static TextValue: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'TextValue';
    public static IntValue: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'IntValue';
    public static BooleanValue: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'BooleanValue';
    public static UriValue: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'UriValue';
    public static DecimalValue: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'DecimalValue';
    public static DateValue: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'DateValue';
    public static ColorValue: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'ColorValue';
    public static GeomValue: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'GeomValue';
    public static ListValue: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'ListValue';
    public static IntervalValue: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'IntervalValue';
    public static LinkValue: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'LinkValue';
    public static GeonameValue: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'GeonameValue';
    public static FileValue: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'FileValue';
    public static AudioFileValue: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'AudioFileValue';
    public static DDDFileValue: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'DDDFileValue';
    public static DocumentFileValue: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'DocumentFileValue';
    public static StillImageFileValue: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'StillImageFileValue';
    public static MovingImageFileValue: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'MovingImageFileValue';
    public static TextFileValue: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'TextFileValue';
    public static IsResourceClass: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'isResourceClass';
    public static IsValueClass: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'isValueClass';
    public static ForbiddenResource: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'ForbiddenResource';
    public static XMLToStandoffMapping: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'XMLToStandoffMapping';
    public static ListNode: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'ListNode';

    public static ObjectType: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'objectType';
    public static ResourceIcon: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'resourceIcon';
    public static isEditable: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'isEditable';
    public static isLinkProperty: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'isLinkProperty';
    public static isLinkValueProperty: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'isLinkValueProperty';
    public static hasGeometry: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'hasGeometry';

    public static schemaName: string = 'http://schema.org/name';
    public static schemaNumberOfItems: string = 'http://schema.org/numberOfItems';
    public static schemaItemListElement: string = 'http://schema.org/itemListElement';


    public static RdfProperty: string = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Property';
    public static RdfsSchema: string = 'http://www.w3.org/2000/01/rdf-schema' + KnoraConstants.PathSeparator;
    public static RdfsLabel: string = KnoraConstants.RdfsSchema + 'label';
    public static RdfsComment: string = KnoraConstants.RdfsSchema + 'comment';
    public static RdfsSubclassOf: string = KnoraConstants.RdfsSchema + 'subClassOf';
    public static subPropertyOf: string = KnoraConstants.RdfsSchema + 'subPropertyOf';

    public static owl: string = 'http://www.w3.org/2002/07/owl';

    public static OwlClass: string = KnoraConstants.owl + '#Class';
    public static OwlObjectProperty: string = KnoraConstants.owl + '#ObjectProperty';
    public static OwlDatatypeProperty: string = KnoraConstants.owl + '#DatatypeProperty';
    public static OwlAnnotationProperty: string = KnoraConstants.owl + '#AnnotationProperty';
    public static OwlOnProperty: string = KnoraConstants.owl + '#onProperty';
    public static OwlMaxCardinality: string = KnoraConstants.owl + '#maxCardinality';
    public static OwlMinCardinality: string = KnoraConstants.owl + '#minCardinality';
    public static OwlCardinality: string = KnoraConstants.owl + '#cardinality';
    public static OwlRestriction: string = KnoraConstants.owl + '#Restriction';

    public static creationDate: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'creationDate';
    public static lastModificationDate: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'lastModificationDate';
    public static hasPermissions: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'hasPermissions';
    public static attachedToProject: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'attachedToProject';
    public static attachedToUser: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'attachedToUser';

    public static Region: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'Region';

    public static ReadTextValueAsHtml: string = 'ReadTextValueAsHtml';
    public static ReadTextValueAsString: string = 'ReadTextValueAsString';
    public static ReadTextValueAsXml: string = 'ReadTextValueAsXml';
    public static ReadDateValue: string = 'ReadDateValue';
    public static ReadLinkValue: string = 'ReadLinkValue';
    public static ReadIntegerValue: string = 'ReadIntegerValue';
    public static ReadDecimalValue: string = 'ReadDecimalValue';
    public static ReadStillImageFileValue: string = 'ReadStillImageFileValue';
    public static ReadTextFileValue: string = 'ReadTextFileValue';
    public static ReadGeomValue: string = 'ReadGeomValue';
    public static ReadColorValue: string = 'ReadColorValue';
    public static ReadUriValue: string = 'ReadUriValue';
    public static ReadBooleanValue: string = 'ReadBooleanValue';
    public static ReadIntervalValue: string = 'ReadIntervalValue';
    public static ReadListValue: string = 'ReadListValue';

    public static valueAsString: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'valueAsString';

    public static textValueAsHtml: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'textValueAsHtml';
    public static textValueAsXml: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'textValueAsXml';
    public static textValueHasMapping: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'textValueHasMapping';

    public static hasStandoffLinkToValue: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'hasStandoffLinkToValue';

    public static dateValueHasStartYear: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'dateValueHasStartYear';
    public static dateValueHasEndYear: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'dateValueHasEndYear';
    public static dateValueHasStartEra: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'dateValueHasStartEra';
    public static dateValueHasEndEra: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'dateValueHasEndEra';
    public static dateValueHasStartMonth: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'dateValueHasStartMonth';
    public static dateValueHasEndMonth: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'dateValueHasEndMonth';
    public static dateValueHasStartDay: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'dateValueHasStartDay';
    public static dateValueHasEndDay: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'dateValueHasEndDay';
    public static dateValueHasCalendar: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'dateValueHasCalendar';

    public static linkValueHasTarget: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'linkValueHasTarget';
    public static linkValueHasSource: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'linkValueHasSource';
    public static linkValueHasSourceIri: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'linkValueHasSourceIri';
    public static linkValueHasTargetIri: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'linkValueHasTargetIri';

    public static integerValueAsInteger: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'intValueAsInt';

    public static decimalValueAsDecimal: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'decimalValueAsDecimal';

    public static fileValueAsUrl: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'fileValueAsUrl';
    public static fileValueIsPreview: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'fileValueIsPreview';
    public static fileValueHasFilename: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'fileValueHasFilename';

    public static hasStillImageFileValue: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'hasStillImageFileValue';

    public static stillImageFileValueHasDimX: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'stillImageFileValueHasDimX';
    public static stillImageFileValueHasDimY: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'stillImageFileValueHasDimY';
    public static stillImageFileValueHasIIIFBaseUrl: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'stillImageFileValueHasIIIFBaseUrl';

    public static colorValueAsColor: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'colorValueAsColor';
    public static geometryValueAsGeometry: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'geometryValueAsGeometry';
    public static uriValueAsUri: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'uriValueAsUri';
    public static booleanValueAsBoolean: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'booleanValueAsBoolean';

    public static intervalValueHasStart: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'intervalValueHasStart';
    public static intervalValueHasEnd: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'intervalValueHasEnd';

    public static listValueAsListNode: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'listValueAsListNode';
    public static listValueAsListNodeLabel: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'listValueAsListNodeLabel';

    public static Xsd: string = 'http://www.w3.org/2001/XMLSchema#';

    public static xsdString: string = KnoraConstants.Xsd + 'string';
    public static xsdBoolean: string = KnoraConstants.Xsd + 'boolean';
    public static xsdInteger: string = KnoraConstants.Xsd + 'integer';
    public static xsdDecimal: string = KnoraConstants.Xsd + 'decimal';
    public static xsdUri: string = KnoraConstants.Xsd + 'anyURI';

    public static resourceSimple: string = KnoraConstants.KnoraApiV2SimplePath + 'Resource';
    public static dateSimple: string = KnoraConstants.KnoraApiV2SimplePath + 'Date';
    public static intervalSimple: string = KnoraConstants.KnoraApiV2SimplePath + 'Interval';
    public static geomSimple: string = KnoraConstants.KnoraApiV2SimplePath + 'Geom';
    public static colorSimple: string = KnoraConstants.KnoraApiV2SimplePath + 'Color';
    public static geonameSimple: string = KnoraConstants.KnoraApiV2SimplePath + 'Geoname';
    public static fileSimple: string = KnoraConstants.KnoraApiV2SimplePath + 'File';

    public static matchFunction: string = KnoraConstants.KnoraApiV2SimplePath + 'match';

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
