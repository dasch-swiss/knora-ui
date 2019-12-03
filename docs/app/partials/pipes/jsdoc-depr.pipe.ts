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

        this.description = array[1];

        if (this.description) {
            const descArray = this.description.split('github:');

            this.description = descArray[0];

            const npmArray = this.description.split('`');

            console.log(npmArray);

            if (npmArray[1]) {
                this.description = npmArray[0] + '<code>' + npmArray[1] + '</code>' + npmArray[2];
            }

            if (descArray[1]) {
                this.description += '<a href="https://github.com/' + descArray[1] + '">' + descArray[1] + '</a>';
                console.log('description with link', this.description);
            }
        }

        const newStr: string = '<p class="warn"><strong>Deprecated </strong>' + array[0] + '</p>' + this.description;

        return this._sanitizer.bypassSecurityTrustHtml(newStr);
    }

}
