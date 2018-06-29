import {Component, OnInit} from '@angular/core';
import {AppDemo} from '../../../app.config';

@Component({
    selector: 'app-admin-image-demo',
    templateUrl: './admin-image.component.html',
    styleUrls: ['./admin-image.component.scss']
})
export class AdminImageComponent implements OnInit {

    module = AppDemo.actionModule;

    imgDefaultProject: string = undefined;
    // imgSalsahProject: string = 'https://dhlab-basel.github.io/Salsah/assets/images/salsah-logo.png';
    imgDaschProject: string = 'http://dasch.swiss/content/images/2017/11/DaSCH_Logo_RGB.png';

    imgDefaultUser: string = 'root@example.com';
    imgSalsahUser: string = 'salsah@milchkannen.ch';

    constructor() {
    }

    ngOnInit() {
    }

}
