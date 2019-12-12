import { JsonConvert, OperationMode, ValueCheckingMode } from 'json2typescript';

import { List, ListNode, ListNodeResponse, ListResponse, ListsResponse } from '../../declarations';

const jsonConvert: JsonConvert = new JsonConvert(OperationMode.ENABLE, ValueCheckingMode.ALLOW_NULL);



// needed by ListsService test
export const incunabulaProjectIri = 'http://rdfh.ch/projects/0803';

// ---- Lists ----
// needed by ListsService test
export const listsResponseJson: any = { 'lists': [{ 'id': 'http: //rdfh.ch/lists/FFFF/ynm01', 'labels': [{ 'value': 'Die Ja,  Nein,  Vielleicht Liste', 'language': 'de' }, { 'value': 'The Yes,  No,  Maybe List', 'language': 'en' }], 'projectIri': 'http: //www.knora.org/ontology/knora-base#SystemProject', 'isRootNode': true, 'comments': [{ 'value': 'Diese Liste kann von allen Projekten verwendet werden.', 'language': 'de' }, { 'value': 'This list can be used by all projects.', 'language': 'en' }] }] };
export const listsResponse: ListsResponse = jsonConvert.deserializeObject(listsResponseJson, ListsResponse);
export const listsTestData: ListNode[] = listsResponse.lists;

export const yesNoMaybeListResponseJson: any = { 'list': { 'listinfo': { 'id': 'http://rdfh.ch/lists/FFFF/ynm01', 'projectIri': 'http://www.knora.org/ontology/knora-base#SystemProject', 'labels': [{ 'value': 'The Yes, No, Maybe List', 'language': 'en' }, { 'value': 'Die Ja, Nein, Vielleicht Liste', 'language': 'de' }], 'comments': [{ 'value': 'This list can be used by all projects.', 'language': 'en' }, { 'value': 'Diese Liste kann von allen Projekten verwendet werden.', 'language': 'de' }] }, 'children': [{ 'children': [], 'name': 'yes', 'id': 'http://rdfh.ch/lists/FFFF/ynm01-01', 'labels': [{ 'value': 'Yes' }], 'position': 0, 'comments': [] }, { 'children': [], 'name': 'no', 'id': 'http://rdfh.ch/lists/FFFF/ynm01-02', 'labels': [{ 'value': 'No' }], 'position': 1, 'comments': [] }, { 'children': [], 'name': 'maybe', 'id': 'http://rdfh.ch/lists/FFFF/ynm01-03', 'labels': [{ 'value': 'Maybe' }], 'position': 2, 'comments': [] }] } };
export const yesNoMaybeListResponse: ListResponse = jsonConvert.deserializeObject(yesNoMaybeListResponseJson, ListResponse);
export const yesNoMaybeListTestData: List = yesNoMaybeListResponse.list;

export const yesNodeInfoResponseJson: any = { 'nodeinfo': { 'name': 'yes', 'id': 'http://rdfh.ch/lists/FFFF/ynm01-01', 'labels': [{ 'value': 'Yes', 'language': 'en' }, { 'value': 'Ja', 'language': 'de' }], 'position': 0, 'comments': [] } };
export const yesNodeInfoResponse: ListNodeResponse = jsonConvert.deserializeObject(yesNodeInfoResponseJson, ListNodeResponse);
export const yesNodeInfoTestData: ListNode = yesNodeInfoResponse.nodeinfo;
