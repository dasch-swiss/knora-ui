export class KnoraConstants {

    public static api: string = 'http://api.knora.org/ontology/knora-api';
    public static PathSeparator = '#';

    public static KnoraApiV2WithValueObjectPath: string = KnoraConstants.api + '/v2' + KnoraConstants.PathSeparator;

    public static SalsahGuiOntology = 'http://api.knora.org/ontology/salsah-gui/v2';
    public static StandoffOntology = 'http://api.knora.org/ontology/standoff/v2';

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
    public static ObjectType = KnoraConstants.KnoraApiV2WithValueObjectPath + 'objectType';
    public static ResourceIcon: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'resourceIcon';
    public static isEditable: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'isEditable';
    public static isLinkProperty: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'isLinkProperty';
    public static isLinkValueProperty: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'isLinkValueProperty';
    public static hasGeometry = KnoraConstants.KnoraApiV2WithValueObjectPath + 'hasGeometry';

    public static schemaName = 'http://schema.org/name';
    public static schemaNumberOfItems = 'http://schema.org/numberOfItems';
    public static schemaItemListElement = 'http://schema.org/itemListElement';


    public static RdfProperty: string = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Property';
    public static RdfsLabel = 'http://www.w3.org/2000/01/rdf-schema#label';
    public static RdfsComment = 'http://www.w3.org/2000/01/rdf-schema#comment';
    public static RdfsSubclassOf = 'http://www.w3.org/2000/01/rdf-schema#subClassOf';
    public static subPropertyOf: string = 'http://www.w3.org/2000/01/rdf-schema#subPropertyOf';

    public static owl: string = 'http://www.w3.org/2002/07/owl';

    public static OwlClass: string = KnoraConstants.owl + '#Class';
    public static OwlObjectProperty: string = KnoraConstants.owl + '#ObjectProperty';
    public static OwlDatatypeProperty: string = KnoraConstants.owl + '#DatatypeProperty';
    public static OwlAnnotationProperty: string = KnoraConstants.owl + '#AnnotationProperty';
    public static OwlOnProperty: string = KnoraConstants.owl + '#onProperty';
    public static OwlMaxCardinality: string = KnoraConstants.owl + '#maxCardinality';
    public static OwlMinCardinality: string = KnoraConstants.owl + '#minCardinality';
    public static OwlCardinality: string = KnoraConstants.owl + '#cardinality';
    public static OwlRestriction = KnoraConstants.owl + '#Restriction';


    public static ReadTextValueAsHtml: string = 'ReadTextValueAsHtml';
    public static ReadTextValueAsString: string = 'ReadTextValueAsString';
    public static ReadTextValueAsXml: string = 'ReadTextValueAsXml';
    public static ReadDateValue: string = 'ReadDateValue';
    public static ReadLinkValue: string = 'ReadLinkValue';
    public static ReadIntegerValue: string = 'ReadIntegerValue';
    public static ReadDecimalValue: string = 'ReadDecimalValue';
    public static ReadStillImageFileValue: string = 'ReadStillImageFileValue';
    public static ReadGeomValue: string = 'ReadGeomValue';
    public static ReadColorValue: string = 'ReadColorValue';
    public static ReadUriValue: string = 'ReadUriValue';
    public static ReadBooleanValue: string = 'ReadBooleanValue';
    public static ReadIntervalValue: string = 'ReadIntervalValue';
    public static ReadListValue: string = 'ReadListValue';

    public static dateValueHasStartYear: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'dateValueHasStartYear';
    public static dateValueHasEndYear: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'dateValueHasEndYear';
    public static dateValueHasStartEra: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'dateValueHasStartEra';
    public static dateValueHasEndEra: string = KnoraConstants.KnoraApiV2WithValueObjectPath + 'dateValueHasEndEra';
    public static dateValueHasStartMonth = KnoraConstants.KnoraApiV2WithValueObjectPath + 'dateValueHasStartMonth';
    public static dateValueHasEndMonth = KnoraConstants.KnoraApiV2WithValueObjectPath + 'dateValueHasEndMonth';
    public static dateValueHasStartDay = KnoraConstants.KnoraApiV2WithValueObjectPath + 'dateValueHasStartDay';
    public static dateValueHasEndDay = KnoraConstants.KnoraApiV2WithValueObjectPath + 'dateValueHasEndDay';
    public static dateValueHasCalendar = KnoraConstants.KnoraApiV2WithValueObjectPath + 'dateValueHasCalendar';

    public static linkValueHasTarget = KnoraConstants.KnoraApiV2WithValueObjectPath + 'linkValueHasTarget';
    public static linkValueHasSource = KnoraConstants.KnoraApiV2WithValueObjectPath + 'linkValueHasSource';
    public static linkValueHasSourceIri = KnoraConstants.KnoraApiV2WithValueObjectPath + 'linkValueHasSourceIri';
    public static linkValueHasTargetIri = KnoraConstants.KnoraApiV2WithValueObjectPath + 'linkValueHasTargetIri';

    public static integerValueAsInteger = KnoraConstants.KnoraApiV2WithValueObjectPath + 'intValueAsInt';

    public static decimalValueAsDecimal = KnoraConstants.KnoraApiV2WithValueObjectPath + 'decimalValueAsDecimal';



}
