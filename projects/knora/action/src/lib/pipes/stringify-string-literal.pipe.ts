import { Pipe, PipeTransform } from '@angular/core';
import { StringLiteral } from '@knora/core';

@Pipe({
    name: 'stringifyStringLiteral'
})
export class StringifyStringLiteralPipe implements PipeTransform {

    transform(value: StringLiteral[]): string {
        let stringified: string = '';

        let i = 0;
        for (const sl of value) {
            const delimiter = (i > 0 ? ' / ' : '');
            stringified += delimiter + sl.value + ' (' + sl.language + ')';

            i++;
        }
        return stringified;
    }

}
