import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

import { Md5 } from 'ts-md5/dist/md5';
import { AdminImageConfig } from './admin-image.config';


/**
 * You can use the admin image module for user avatar together with gravatar.com and for project logos.
 *
 * The feature of this module ist the error handling: In case of a 404 error of the image source (img src) the module shows a default image-not-found image. Or a default user profile icon (type=user), or a default project icon (type=project).
 *
 */
@Directive({
    selector: '[kuiAdminImage]'
})
export class AdminImageDirective implements OnChanges {

    /**
     * @param {string} image
     *
     * source of the image;
     * - in case of user (gr)avatar it's the e-mail address,
     * - in case of project logo it's the image url
     */
    @Input() image: string;

    /**
     * @param {string} type
     *
     * type of image; you can use it with
     * - project
     * - user
     */
    @Input() type: string;


    /**
     * @ignore
     */
    source: string;


    /**
     * @ignore
     */
    onError: string = AdminImageConfig.defaultNotFound;


    /**
     * @ignore
     */
    constructor(private _renderer: Renderer2,
                private _ele: ElementRef) {
    }

    /**
     * @ignore
     */
    ngOnChanges() {

        this.source = this.image;

        switch (this.type) {

            case 'user':
                if (this.image === null || this.image === undefined) {
                    this.source = AdminImageConfig.defaultUser;
                } else {
                    this.source = 'http://www.gravatar.com/avatar/' + Md5.hashStr(this.image) + '?d=mp&s=256';
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
