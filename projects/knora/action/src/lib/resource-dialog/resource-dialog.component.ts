import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kui-resource-dialog',
  templateUrl: './resource-dialog.component.html',
  styleUrls: ['./resource-dialog.component.scss']
})
export class ResourceDialogComponent implements OnInit {

  fullSize: boolean = false;

  /**
   * Creates a configuration object for `MatDialog`.
   *
   * @param resourceIri the Iri of the resource to be displayed in a dialog.
   * @param widthPct width of the dialog in percentage.
   * @param heightPct height of the dialog in percentage.
   * @returns
   */
  static createConfiguration(resourceIri: string, widthPct: number = 60, heightPct: number = 60) {

    const config: MatDialogConfig = new MatDialogConfig();

    config.height = `${widthPct}%`;
    config.width = `${heightPct}%`;

    config.data = {
      iri: resourceIri
    };

    config.panelClass = 'resizable';

    return config;
  }

  constructor(public _dialogRef: MatDialogRef<ResourceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.fullSize = (!this.data.fullSize);

    // start in full size
    if (this._dialogRef) {
      this.toggleFullSize();
    }
  }

  toggleFullSize() {
    this.fullSize = (!this.fullSize);

    if (this.fullSize) {
      this._dialogRef.updateSize('100vw', '100vh');
      this._dialogRef.updatePosition();
    } else {
      this._dialogRef.updateSize('80vw', 'auto');
      this._dialogRef.updatePosition();
    }
  }

}
