import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('DateFormatSalsah')
export class DateFormatSalsah {

    @JsonProperty('date', Date)
    public date: Date = undefined;

    @JsonProperty('format', String)
    public format: string = undefined;

    @JsonProperty('era', String)
    public era: string = undefined;

    @JsonProperty('calendar', String)
    public calendar: string = undefined;
}


@JsonObject('DateSalsah')
export class DateSalsah {

    @JsonProperty('start', DateFormatSalsah)
    public start: DateFormatSalsah = undefined;

    @JsonProperty('end', DateFormatSalsah, true)
    public end: DateFormatSalsah = undefined;
}
