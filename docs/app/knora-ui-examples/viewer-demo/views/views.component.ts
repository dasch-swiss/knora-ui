import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.scss']
})
export class ViewsComponent implements OnInit {

    partOf: any;

    constructor(private _route: ActivatedRoute) {
        this._route.data
            .subscribe(
                (mod: any) => {
                    this.partOf = mod.partOf;
                }
            );
    }

  ngOnInit() {
  }

}
