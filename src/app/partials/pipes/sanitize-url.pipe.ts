import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Pipe({
    name: 'sanitizeUrl'
})
export class SanitizeUrlPipe implements PipeTransform {

    constructor(private _sanitizer: DomSanitizer) {
    }

    transform(url: string): SafeResourceUrl {
        return this._sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}

