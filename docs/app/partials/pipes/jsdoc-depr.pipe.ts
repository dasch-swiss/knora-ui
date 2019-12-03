import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'jsdocDepr'
})
export class JsdocDeprPipe implements PipeTransform {

    description: string;

    constructor(private _sanitizer: DomSanitizer) {
    }



    transform(str: string): SafeHtml {
        const array = str.split('\n');

        this.description = array[0];

        if (this.description) {
            const descArray = this.description.split('github:');

            this.description = descArray[0];

            if (descArray[1]) {
                this.description += ' <a href="https://github.com/' + descArray[1] + '">' + descArray[1] + '</a>';
            }
        }

        let newStr: string = '<strong>Deprecated </strong>' + array[0] + '<br>' + this.description;

        return this._sanitizer.bypassSecurityTrustHtml(newStr);
    }

}
