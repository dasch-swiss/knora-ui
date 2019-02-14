import { Component, OnInit } from '@angular/core';
import { ListService } from '@knora/core';

@Component({
  selector: 'app-list-pg',
  templateUrl: './list-pg.component.html',
  styleUrls: ['./list-pg.component.scss']
})
export class ListPgComponent implements OnInit {

  constructor(private _listService: ListService) { }

  private listRootNodeIri = 'http://rdfh.ch/lists/0801/subject_index';

  private listNode = 'http://rdfh.ch/lists/0801/complex_numbers';

  ngOnInit() {

      this._listService.getList(this.listRootNodeIri).subscribe(
          (list: object) => {
              console.log(list);
          }
      );

      this._listService.getListNode(this.listNode).subscribe(
          (list: object) => {
              console.log(list);
          }
      );
  }

}
