import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'jsdocDepr'
})
export class JsdocDeprPipe implements PipeTransform {

    description: string;

    line1: string;
    line2: string;


    constructor(private _sanitizer: DomSanitizer) {
    }

    transform(str: string): SafeHtml {

        const array = str.split('\n');

        this.line1 = (array[0] ? array[0] : str);

        this.description = (array[1] ? array[1] : '');


        const ghLink = 'dasch-swiss/knora-api-js-lib';
        const ghReg: RegExp = new RegExp('github:' + ghLink, 'i');
        const tmpLine2 = this.description.replace(ghReg, '<a href="https://github.com/' + ghLink + '">' + ghLink + '</a>');

        const code = '@knora/api';
        const codeReg: RegExp = new RegExp('`' + code + '`', 'gi');
        this.line2 = tmpLine2.replace(codeReg, '<code>' + code + '</code>');





        const newStr: string = '<p class="warn"><strong>Deprecated </strong>' + this.line1 + '</p>' + this.line2;

        return this._sanitizer.bypassSecurityTrustHtml(newStr);
    }

}
