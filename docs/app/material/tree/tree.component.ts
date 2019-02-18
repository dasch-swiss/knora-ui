import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';

/**
 * File node data with nested structure.
 * Each node has a filename, and a type or a list of children.
 */
export class FileNode {
    children: FileNode[];
    filename: string;
    type: any;
}

/** Flat node with expandable and level information */
export class FileFlatNode {
    filename: string;
    type: any;
    level: number;
    expandable: boolean;
}

/**
 * The file structure tree data in string. The data could be parsed into a Json object
 */
const TREE_DATA = `
  {
    "Documents": {
      "angular": {
        "src": {
          "core": "ts",
          "compiler": "ts"
        }
      },
      "material2": {
        "src": {
          "button": "ts",
          "checkbox": "ts",
          "input": "ts"
        }
      }
    },
    "Downloads": {
        "Tutorial": "html",
        "November": "pdf",
        "October": "pdf"
    },
    "Pictures": {
        "Sun": "png",
        "Woods": "jpg",
        "Photo Booth Library": {
          "Contents": "dir",
          "Pictures": "dir"
        }
    },
    "Applications": {
        "Chrome": "app",
        "Calendar": "app",
        "Webstorm": "app"
    }
}`;

const LIST_INFO = `
{
    "listinfo": {
        "id": "http://rdfh.ch/lists/00FF/73d0ec0302",
        "projectIri": "http://rdfh.ch/projects/00FF",
        "labels": [
            {
                "value": "Titel",
                "language": "de"
            },
            {
                "value": "Titre",
                "language": "fr"
            },
            {
                "value": "Title",
                "language": "en"
            }
        ],
        "comments": [
            {
                "value": "Hierarchisches Stichwortverzeichnis / Signatur der Bilder",
                "language": "de"
            }
        ]
    },
    "children": []
}`;

/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable()
export class FileDatabase {
    dataChange: BehaviorSubject<FileNode[]> = new BehaviorSubject<FileNode[]>([]);

    get data(): FileNode[] {
        return this.dataChange.value;
    }

    constructor() {
        this.initialize();
    }

    initialize() {
        // Parse the string to json object.
//        const dataObject = JSON.parse(TREE_DATA);
        const listDataObject = JSON.parse(LIST_INFO);

        // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
        //     file node as children.
//        const data = this.buildFileTree(dataObject, 0);

        const list = this.buildFileTree(listDataObject, 0);

        // Notify the change.
//        this.dataChange.next(data);
        this.dataChange.next(list);
    }

    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `FileNode`.
     */
    buildFileTree(value: any, level: number): FileNode[] {
        const data: any[] = [];
        for (const k in value) {
            const v = value[k];
            const node = new FileNode();
            node.filename = `${k}`;
            if (v === null || v === undefined) {
                // no action
            } else if (typeof v === 'object') {
                node.children = this.buildFileTree(v, level + 1);
            } else {
                node.type = v;
            }
            data.push(node);
        }
        return data;
    }
}

/**
 * @title Tree with flat nodes
 */
@Component({
    selector: 'app-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.scss'],
    providers: [FileDatabase]
})
export class TreeComponent implements OnInit {

    treeControl: FlatTreeControl<FileFlatNode>;

    treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;

    dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;

    constructor(database: FileDatabase) {
        this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
            this._isExpandable, this._getChildren);
        this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

        database.dataChange.subscribe(data => {
            this.dataSource.data = data;
        });
    }

    ngOnInit() {

    }

    transformer = (node: FileNode, level: number) => {
        const flatNode = new FileFlatNode();
        flatNode.filename = node.filename;
        flatNode.type = node.type;
        flatNode.level = level;
        flatNode.expandable = !!node.children;

        // console.log(flatNode);
        return flatNode;
    }

    private _getLevel = (node: FileFlatNode) => {
        return node.level;
    }

    private _isExpandable = (node: FileFlatNode) => {
        return node.expandable;
    }

    private _getChildren = (node: FileNode): Observable<FileNode[]> => {
        return observableOf(node.children);
    }

    hasChild = (_: number, _nodeData: FileFlatNode) => {
        return _nodeData.expandable;
    }
}
