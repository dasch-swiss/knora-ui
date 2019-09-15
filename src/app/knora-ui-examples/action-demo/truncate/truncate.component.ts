import { Component, OnInit } from '@angular/core';
import { AppDemo } from 'src/app/app.config';
import { Example } from 'src/app/app.interfaces';
import { MatSliderChange } from '@angular/material';

@Component({
    selector: 'app-truncate',
    templateUrl: './truncate.component.html',
    styleUrls: ['./truncate.component.scss']
})
export class TruncateComponent implements OnInit {

    module = AppDemo.actionModule;

    length: Number = 24;

    longText: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vel pharetra vel turpis nunc eget lorem dolor. Euismod lacinia at quis risus sed vulputate. Ultrices gravida dictum fusce ut placerat orci nulla pellentesque. Tortor consequat id porta nibh venenatis cras. Turpis tincidunt id aliquet risus feugiat in ante metus. Dictum fusce ut placerat orci nulla pellentesque dignissim enim sit. Mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Mauris sit amet massa vitae tortor condimentum lacinia quis vel. Dictum sit amet justo donec enim diam vulputate. Dignissim convallis aenean et tortor. Ut tellus elementum sagittis vitae et. Pretium viverra suspendisse potenti nullam ac tortor vitae purus faucibus. Eget mauris pharetra et ultrices neque ornare aenean. Diam in arcu cursus euismod. Odio ut enim blandit volutpat maecenas volutpat. Suspendisse interdum consectetur libero id faucibus nisl tincidunt eget. Risus commodo viverra maecenas accumsan.';

    // demo configuration incl. code to display
    truncatePipe: Example = {
        title: 'Truncate Pipe',
        subtitle: '',
        name: 'truncatePipe',
        code: {
            html: `
<p>{{longText | kuiTruncate:[` + this.length + `]}}</p>
            `,
            ts: `
longText: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vel pharetra vel turpis nunc eget lorem dolor. Euismod lacinia at quis risus sed vulputate. Ultrices gravida dictum fusce ut placerat orci nulla pellentesque. Tortor consequat id porta nibh venenatis cras. Turpis tincidunt id aliquet risus feugiat in ante metus. Dictum fusce ut placerat orci nulla pellentesque dignissim enim sit. Mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Mauris sit amet massa vitae tortor condimentum lacinia quis vel. Dictum sit amet justo donec enim diam vulputate. Dignissim convallis aenean et tortor. Ut tellus elementum sagittis vitae et. Pretium viverra suspendisse potenti nullam ac tortor vitae purus faucibus. Eget mauris pharetra et ultrices neque ornare aenean. Diam in arcu cursus euismod. Odio ut enim blandit volutpat maecenas volutpat. Suspendisse interdum consectetur libero id faucibus nisl tincidunt eget. Risus commodo viverra maecenas accumsan.';
`,
            scss: ''
        }
    };

    constructor () {
    }

    ngOnInit() {

    }

    truncateStringBy(val: MatSliderChange) {
        this.length = val.value;

        // this.truncatePipe.code.html = `<p>{{longText | kuiTruncate:[` + this.length + `]}}</p>`;
    }

}
