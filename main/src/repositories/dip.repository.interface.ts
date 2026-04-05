import {Dip, DocumentClass, ConservationProcess, Document} from '../domain/dip-structure.barrel';

export interface DipRepository {
    save(dip: Dip, documentClass: DocumentClass[], conservationProcesses: ConservationProcess[], documents:Document[]): void;
    /*
    removeDip(uuid:string): void;
    getDocument(uuid:string):Document;
    getDocsFromDip(dipUuid:string):Document[];
    getDip(uuid:string):Dip;
    searchDocuments(filters: Map<string, any>):Document[];
    */
}
