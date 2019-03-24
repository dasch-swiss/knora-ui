import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusMsgService, ApiServiceError } from '@knora/core';

export interface KuiMessageData {
    status: number;
    statusMsg?: string;
    statusText?: string;
    type?: string;
    route?: string;
    footnote?: string;
}

@Component({
    selector: 'kui-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
    /**
     * message content
     * @type {KuiMessageData}
     */
    @Input() message: KuiMessageData;

    /**
     * show a short message only
     *
     * @type {boolean}
     */
    @Input() short?: boolean = false;

    //    message: MessageData;

    statusMsg: any;

    isLoading: boolean = true;

    showLinks: boolean = false;

    // disable message
    disable: boolean = false;

    /**
     *
     * default link list, which will be used in message content to give a user some possibilities
     * what he can do in the case of an error
     *
     */
    links: any = {
        title: 'You have the following possibilities now',
        list: [
            {
                label: 'go to the start page',
                route: '/',
                icon: 'keyboard_arrow_right'
            },
            {
                label: 'try to login',
                route: '/login',
                icon: 'keyboard_arrow_right'
            },
            {
                label: 'go back',
                route: '<--',
                icon: 'keyboard_arrow_left'
            }
        ]
    };

    footnote: any = {
        text: 'If you think it\'s a mistake, please',
        team: {
            knora:
                '<a href=\'https://github.com/dhlab-basel/knora\' target=\'_blank\'> inform the Knora team </a>',
            salsah:
                '<a href=\'https://github.com/dhlab-basel/salsah\' target=\'_blank\'> inform the Salsah developers </a>'
        }
    };

    constructor(
        private _statusMsgService: StatusMsgService,
        private _router: Router,
        private _location: Location,
        private _activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        // get the http status message from the statusMsg data json package (stored in assets/data)
        // TODO: we have to implement this data in the multilingual settings
        this._statusMsgService.getStatusMsg().subscribe(
            (result: any) => {
                this.statusMsg = result;
                //                    this.statusMsg = result.getBody();

                if (!this.message) {
                    this._activatedRoute.data.subscribe((v: any) => {
                        this.message = <KuiMessageData>{
                            status: v.status
                        };
                    });
                }
                this.message = this.setMessage(this.message);
                this.isLoading = false;
            },
            (error: ApiServiceError) => {
                console.log(error);
            }
        );
    }

    setMessage(msg: KuiMessageData) {
        const tmpMsg: KuiMessageData = <KuiMessageData>{};

        const s: number = msg.status === 0 ? 503 : msg.status;

        tmpMsg.status = s;
        tmpMsg.route = msg.route;
        tmpMsg.statusMsg = msg.statusMsg;
        tmpMsg.statusText = msg.statusText;
        tmpMsg.route = msg.route;
        tmpMsg.footnote = msg.footnote;

        switch (true) {
            case s > 0 && s < 300:
                // the message is a note
                tmpMsg.type = 'note';
                //                console.log('the message is a note');
                break;
            case s >= 300 && s < 400:
                // the message is a warning
                tmpMsg.type = 'warning';
                //                console.log('the message is a warning');

                break;
            case s >= 400 && s < 500:
                // the message is a client side (salsah-gui) error
                // console.log('the message is a client side (salsah-gui) error', s);
                tmpMsg.type = 'error';
                tmpMsg.statusMsg =
                    msg.statusMsg !== undefined
                        ? msg.statusMsg
                        : this.statusMsg[s].message;
                tmpMsg.statusText =
                    msg.statusText !== undefined
                        ? msg.statusText
                        : this.statusMsg[s].description;
                tmpMsg.footnote =
                    this.footnote.text + ' ' + this.footnote.team.salsah;
                this.showLinks = true;

                break;
            case s >= 500 && s < 600:
                // the message is a server side (knora-api) error
                // console.log('the message is a server side (knora-api) error');
                tmpMsg.type = 'error';
                tmpMsg.statusMsg =
                    msg.statusMsg !== undefined
                        ? msg.statusMsg
                        : this.statusMsg[s].message;
                tmpMsg.statusText =
                    msg.statusText !== undefined
                        ? msg.statusText
                        : this.statusMsg[s].description;
                tmpMsg.footnote =
                    this.footnote.text + ' ' + this.footnote.team.knora;
                this.showLinks = false;
                break;
            default:
                // no default configuration?
                break;
        }

        return tmpMsg;
    }

    goToLocation(route) {
        if (route === '<--') {
            this._location.back();
        } else {
            this._router.navigate([route]);
        }
    }

    closeMessage() {
        this.disable = !this.disable;
    }
}
