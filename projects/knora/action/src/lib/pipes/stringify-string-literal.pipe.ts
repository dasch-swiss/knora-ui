import { Pipe, PipeTransform } from '@angular/core';
import { StringLiteral } from '@knora/api';

/**
 * This pipe stringifies an array of StringLiterals. With the parameter 'all', the pipe concats all values and appends the corresponding language in brackets.
 *
 * Otherwise the pipe displays the value corresponding to the default language which comes from the user profile (if a user is logged-in) or from the browser. With the predefined language the pipe checks, if a value exists in the array, otherwise it shows the first value.
 */
@Pipe({
    name: 'kuiStringifyStringLiteral'
})
export class StringifyStringLiteralPipe implements PipeTransform {

    transform(value: StringLiteral[], args: string): string {
        let stringified: string = '';

        let language: string;

        if (!value || !value.length) {
            return;
        }

        if (args === 'all') {
            // show all values
            let i = 0;
            for (const sl of value) {
                const delimiter = (i > 0 ? ' / ' : '');
                stringified += delimiter + sl.value + ' (' + sl.language + ')';

                i++;
            }
            return stringified;
        } else {
            // show only one value, depending on default language
            // the language is defined in user profile if a user is logged-in
            // otherwise it takes the language from browser
            if (localStorage.getItem('session') !== null) {
                // get language from the logged-in user profile data
                language = JSON.parse(localStorage.getItem('session')).user.lang;
            } else {
                // get default language from browser
                language = navigator.language.substr(0, 2);
            }
            // does the defined language exists and does it have a value?
            const index = value.findIndex(i => i.language === language);

            if (value[index] && value[index].value.length > 0) {
                return value[index].value;
            } else {
                return value[0].value;
            }

        }

    }

}
