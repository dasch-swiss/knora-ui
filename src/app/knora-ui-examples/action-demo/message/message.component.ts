import { Component, OnInit } from '@angular/core';
import { AppDemo } from 'src/app/app.config';
import { Example } from 'src/app/app.interfaces';
import { KuiMessageData } from '@knora/action';
import { ApiServiceError } from '@knora/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  module = AppDemo.actionModule;

  noteExample: Example = {
    title: 'Short version',
    subtitle: '',
    name: 'kui-message',
    code: {
        html: `
<kui-message [message]="shortMessage" [short]="true"></kui-message>
<kui-message [message]="errorMessage" [short]="true"></kui-message>
`,
        ts: `
// short message example
shortMessage: KuiMessageData = {
    status: 200,
    statusMsg: 'Success',
    statusText: 'You just update the user profile.',
    type: 'Note',
    footnote: 'Close it'
  };

// error message example
errorMessage: ApiServiceError = {
  status: 403,
  errorInfo:
    'Http failure response for http://0.0.0.0:3333/admin/projects/shortcode/001/members: 400 Bad Request',
  statusText: 'Bad Request',
  url: 'http://0.0.0.0:3333/admin/projects/shortcode/001/members'
};
        `,
        scss: ''
    }
};

errorExample: Example = {
  title: 'Error message',
  subtitle: '',
  name: 'kui-message',
  code: {
      html: `
<kui-message [message]="errorMessage"></kui-message>
`,
      ts: `
// error message example
errorMessage: ApiServiceError = {
  status: 403,
  errorInfo:
    'Http failure response for http://0.0.0.0:3333/admin/projects/shortcode/001/members: 400 Bad Request',
  statusText: 'Bad Request',
  url: 'http://0.0.0.0:3333/admin/projects/shortcode/001/members'
};
      `,
      scss: ''
  }
};

// short message example
shortMessage: KuiMessageData = {
  status: 200,
  statusMsg: 'Success',
  statusText: 'You just updated the user profile.',
  type: 'Note',
  footnote: 'Close it'
};

// error message example
errorMessage: ApiServiceError = {
  status: 403,
  errorInfo:
    'Http failure response for http://0.0.0.0:3333/admin/projects/shortcode/001/members: 400 Bad Request',
  statusText: 'Bad Request',
  url: 'http://0.0.0.0:3333/admin/projects/shortcode/001/members'
};

// note message example
noteMessage: KuiMessageData = {
  status: 200,
  statusMsg: 'status message',
  statusText: 'status text',
  type: 'Note',
  footnote: 'Just a footnote'
};

// warning message example
warningMessage: KuiMessageData = {
  status: 300,
  statusMsg: 'status message',
  statusText: 'status text',
  type: 'Warning',
  footnote: 'Just a footnote'
};

  constructor() { }

  ngOnInit() {
  }

}
