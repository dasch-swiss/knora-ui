import { JsonObject, JsonProperty } from 'json2typescript';

/**
 * Start / End date format for Salsah or any other GUI
 * = Zeitpunkt
 */
@JsonObject('DateFormatSalsah')
export class DateFormatSalsah {

    @JsonProperty('date', Date)
    public date: Date = new Date();

    @JsonProperty('format', String)
    public format: string = undefined;

    @JsonProperty('era', String)
    public era: string = undefined;

    @JsonProperty('calendar', String)
    public calendar: string = undefined;
}


/**
 * Date format for Salsah
 * = Period (even when there's only a start date)
 */
@JsonObject('DateSalsah')
export class DateSalsah {

    @JsonProperty('start', DateFormatSalsah)
    public start: DateFormatSalsah = undefined;

    @JsonProperty('end', DateFormatSalsah, true)
    public end: DateFormatSalsah = undefined;
}

/**
 * date value, which is needed by the JSON-LD converter
 */
@JsonObject('DateValue')
export class DateValue {

    @JsonProperty('calendar', String)
    public calendar: string = undefined;

    @JsonProperty('id', String)
    public id: string = undefined;

    @JsonProperty('propIri', String)
    public propIri: string = undefined;

    @JsonProperty('type', String)
    public type: string = undefined;

    @JsonProperty('startDay', Number)
    public startDay: number = undefined;

    @JsonProperty('startMonth', Number)
    public startMonth: number = undefined;

    @JsonProperty('startYear', Number)
    public startYear: number = undefined;

    @JsonProperty('startEra', String)
    public startEra: string = undefined;

    @JsonProperty('endDay', Number)
    public endDay: number = undefined;

    @JsonProperty('endMonth', Number)
    public endMonth: number = undefined;

    @JsonProperty('endYear', Number)
    public endYear: number = undefined;

    @JsonProperty('endEra', String)
    public endEra: string = undefined;

    // we don't need the separator anymore!?
    @JsonProperty('separator', String, true)
    public separator: string = undefined;

}
