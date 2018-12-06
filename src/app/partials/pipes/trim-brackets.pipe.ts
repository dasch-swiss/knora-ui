import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'trimBrackets'
})
export class TrimBracketsPipe implements PipeTransform {

    transform(value: string): string {
        const val = value.replace(/\[/g, '');
        return val.replace(/\]/g, '');
    }

}
