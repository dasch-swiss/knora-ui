import { Component, OnInit, Input } from '@angular/core';
import { ApiServiceError } from '@knora/core';

export class KuiMessage {
   ApiServiceError: any;
}

@Component({
  selector: 'kui-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message: KuiMessage;

  constructor() { }

  ngOnInit() {
    this.message = new KuiMessage();

    console.log(this.message);
  }

}
