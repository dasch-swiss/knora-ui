import { Pipe, PipeTransform } from '@angular/core';
import { StringLiteral } from '@knora/core';

/**
 * This pipe stringifies an array of StringLiterals. With the parameter 'all' it concats all values and appends the corresponing language in brackets.
 *
 * Otherwise it displays the value corresponding to the default language which comes from user profile (if a user is logged-in) or from browser. With the predefined language it checks, if a value exists for it, otherwise it shows the first value from the array
 */
@Pipe({
    name: 'kuiStringifyStringLiteral'
})
export class StringifyStringLiteralPipe implements PipeTransform {

    transform(value: StringLiteral[], args: string): string {
        let stringified: string = '';

        let language: string;

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
