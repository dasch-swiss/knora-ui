/**
 * Collection of useful utility functions.
 */
import { KnoraConstants } from './api/knora-constants';

// @dynamic
export class Utils {
    /**
     * A regex to validate Email address.
     *
     * @type {RegExp}
     */
    public static readonly RegexEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    /**
     * A regex to validate Username.
     *
     * @type {RegExp}
     */
    public static readonly RegexUsername = /^[a-zA-Z0-9]+$/;

    /**
     * A regex to validate URLs.
     *
     * @type {RegExp}
     */
    public static readonly RegexUrl = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}(:[0-9]{1,5})?(\/.*)?$/i;

    /**
     * A regex to validate Passwords
     *
     * @type {RegExp}
     */
    public static readonly RegexPassword = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/i;

    /**
     * A regex to validate Hexadecimal values
     *
     * @type {RegExp}
     */
    public static readonly RegexHex = /^[0-9A-Fa-f]+$/;

    /**
     * A regex to validate shortname in projects
     *
     * @type {RegExp}
     */
    public static readonly RegexShortname = /^[a-zA-Z]+\S*$/;


    /**
     * Lambda function eliminating duplicates in a collection to be passed to [[filter]].
     *
     * @param elem element of an Array that is currently being looked at.
     * @param index current elements index.
     * @param self reference to the whole Array.
     * @returns {boolean} true if the same element does not already exist in the Array.
     */
    public static filterOutDuplicates = (elem, index: number, self) => {

        // https://stackoverflow.com/questions/16747798/delete-duplicate-elements-from-an-array
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter?v=example

        // returns true if the element's index equals the index of the leftmost element
        // -> this means that there is no identical element before this index, hence it is not a duplicate
        // for all other elements, false is returned
        return index === self.indexOf(elem);

    }

    /**
     * Given a Knora entity IRI, gets the ontology Iri.
     *
     * @param {string} entityIri an entity Iri.
     * @return {string} the ontology IRI
     */
    public static getOntologyIriFromEntityIri(entityIri: string) {

        // split class Iri on "#"
        const segments: string[] = entityIri.split(KnoraConstants.PathSeparator);

        if (segments.length !== 2) console.error(`Error: ${entityIri} is not a valid entity IRI.`);

        return segments[0];

    }

    /**
     * Converts a complex knora-api entity Iri to a knora-api simple entity Iri.
     *
     * @param {string} complexEntityIri
     * @returns {string}
     */
    public static convertComplexKnoraApiEntityIritoSimple(complexEntityIri: string) {

        // split entity Iri on "#"
        const segments: string[] = complexEntityIri.split('v2' + KnoraConstants.PathSeparator);

        if (segments.length !== 2) console.error(`Error: ${complexEntityIri} is not a valid entity IRI.`);

        // add 'simple' to base path
        return segments[0] + 'simple/v2' + KnoraConstants.PathSeparator + segments[1];

    }


}
