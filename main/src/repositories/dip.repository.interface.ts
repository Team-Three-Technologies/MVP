import {Dip, DocumentClass, ConservationProcess, Document} from '../domain/dip-structure.barrel';

export interface DipRepository {
    saveDip(dip: Dip): void;
    saveDocumentClass(docClass: DocumentClass): void;
    saveConservationProcess(consProc: ConservationProcess): void;
    saveDocument(doc:Document): void;
    /*
    removeDip(uuid:string): void;
    getDocument(uuid:string):Document;
    getDocsFromDip(dipUuid:string):Document[];
    getDip(uuid:string):Dip;
    searchDocuments(filters: Map<string, any>):Document[];
    */
}
