import {Directive, ElementRef, Input, OnChanges, Renderer2} from '@angular/core';
import {AdminImageConfig} from './admin-image.config';

import {Md5} from 'ts-md5/dist/md5';


/**
 * You can use the admin image module for user avatar together with gravatar.com and for project logos. The feature of this module ist the error handling. In case of a 404 error of the image source (img src) the module shows a default image-not-found image. Or — in case of user — a default user profile icon, or — in case of project — a default project icon.
 */
@Directive({
  selector: '[kuiAdminImage]'
})
export class AdminImageDirective implements OnChanges {

    @Input() image: string;
    @Input() type: string;

    source: string;
    onError: string = AdminImageConfig.defaultNotFound;

    constructor(private _renderer: Renderer2,
                private _ele: ElementRef) {
    }

    ngOnChanges() {

        this.source = this.image;

        switch (this.type) {

            case 'user':
                if (this.image === null || this.image === undefined) {
                    this.source = AdminImageConfig.defaultUser;
                } else {
                    this.source = 'http://www.gravatar.com/avatar/' + Md5.hashStr(this.image);
                }

                break;

            case 'project':

                if (this.image === null || this.image === undefined) {

                    this.source = AdminImageConfig.defaultProject;
                }

                break;

            default:
                this.source = this.image;
        }

        this._renderer.setAttribute(this._ele.nativeElement, 'src', this.source);
        this._renderer.setAttribute(this._ele.nativeElement, 'onError', 'this.src=\'' + this.onError + '\'');

    }

}
