import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-introduction',
    templateUrl: './main-intro.component.html',
    styleUrls: ['./main-intro.component.scss']
})
export class MainIntroComponent implements OnInit {

    modules = [
        {
            name: 'core',
            title: 'Services for API requests',
            description: 'The core module contains every service to use Knora\'s RESTful webapi /v2 and /admin. Therefore a JsonLD converter and an ontology cache service.'
        },
        {
            name: 'authentication',
            title: 'Login, Logout, Session',
            description: 'The authentication module contains the login form, a logout button and it offers a session service, but also an authentication guard.'
        },
        {
            name: 'search',
            title: 'Complete search panel',
            description: 'Search module allows to make fulltext or extended searches in Knora. Filter by resource class and its properties related to an ontology.'
        },
        {
            name: 'viewer',
            title: 'Resources, Properties, Lists',
            description: 'The viewer module contains object components to show a resource class representation, the property gui-elements and various view frameworks.'
        },
        {
            name: 'action',
            title: 'Special pipes and buttons',
            description: 'The action module contains special pipes to sort lists or to get the index key in arrays, but also directives for images, sort buttons and s.o.'
        }
    ];

    constructor() {
    }

    ngOnInit() {
    }

}
