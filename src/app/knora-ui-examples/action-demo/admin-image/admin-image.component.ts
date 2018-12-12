import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../../app.config';
import { Example } from '../../../app.interfaces';

@Component({
    selector: 'app-admin-image-demo',
    templateUrl: './admin-image.component.html',
    styleUrls: ['./admin-image.component.scss']
})
export class AdminImageComponent implements OnInit {

    module = AppDemo.actionModule;

    // demo configuration incl. code to display
    userAvatar: Example = {
        title: 'User Avatar',
        subtitle: '',
        name: 'userAvatar',
        code: {
            html: `
            // Default user profile image
            <img kuiAdminImage [image]="imgDefaultUser" [type]="'user'" />

            // Avatar example: 'salsah' user
            <img kuiAdminImage [image]="imgSalsahUser" [type]="'user'" />

            // User image on error
            <img kuiAdminImage [image]="null" [type]="'user'" />

            // Default error image
            <img kuiAdminImage [image]="'null'" />
            `,
            ts: `
            imgDefaultUser: string = 'root@example.com';
            imgSalsahUser: string = 'salsah@milchkannen.ch';
            `,
            scss: ''
        }
    };

    projectLogo: Example = {
        title: 'Project Logo',
        subtitle: '',
        name: 'projectLogo',
        code: {
            html: `
            // Default project image
            <img kuiAdminImage [image]="imgDefaultProject" [type]="'project'" />

            // Logo example: 'dasch' project
            <img kuiAdminImage [image]="imgDaschProject" [type]="'project'" />
            `,
            ts: `
            imgDefaultProject: string = undefined;
            imgDaschProject: string = 'http://dasch.swiss/content/images/2017/11/DaSCH_Logo_RGB.png';
            `,
            scss: ''
        }
    };

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
