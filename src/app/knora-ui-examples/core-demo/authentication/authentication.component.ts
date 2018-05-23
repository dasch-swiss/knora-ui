import {Component, OnInit} from '@angular/core';
import {ApiService, AuthenticationService} from '@knora/core';
import {ApiServiceError} from '../../../../../projects/knora/core/src/lib/declarations';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

    errorMessage: ApiServiceError;

    constructor(private _authenticationService: AuthenticationService) {
    }

    ngOnInit() {

        this._authenticationService.authenticate()
            .subscribe(
                (result: any) => {
                    console.log(result);
                },
                (error: ApiServiceError) => {

                    this.errorMessage = error;
                    // console.error(error);
                }
            );
    }

}
