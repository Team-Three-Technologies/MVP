export interface DiPIndexXml {
  DiPIndex: {
    ComplianceStatement: ComplianceStatementXml[];
    PackageInfo: PackageInfoXml;
    PackageContent: PackageContentXml;
  };
}

export interface ComplianceStatementXml {
  Title: string;
  Body: string;
  '@_lang': string;
}

export interface PackageInfoXml {
  CreatingApplication: CreatingApplicationXml;
  ProcessUUID: string;
  CreationDate: string;
  DocumentsCount: number;
  AiPCount: number;
}

export interface CreatingApplicationXml {
  Name: string;
  Version: string;
  Producer: string;
}

export interface PackageContentXml {
  DiPDocuments: DiPDocumentsXml;
  RepresentationInformation?: RepresentationInformationXml[];
}

export interface DiPDocumentsXml {
  Statement: StatementXml[];
  DocumentClass: DocumentClassXml[];
}

export interface StatementXml {
  '#text': string;
  '@_lang': string;
}

export interface DocumentClassXml {
  '@_uuid': string;
  '@_name': string;
  '@_version': string;
  '@_validFrom': string;
  '@_validTo'?: string;
  RappresentationInformationUUID?: string[];
  AiP: AiPXml[];
  MoreData?: MoreDataXml[];
}

export interface AiPXml {
  '@_uuid': string;
  AiPRoot: string;
  Report?: ReportXml[];
  SiP?: SiPXml[];
  Document: DocumentXml[];
}

export interface ReportXml {
  '#text': string;
  '@_uuid': string;
  '@_name': string;
}

export interface SiPXml {
  '#text': string;
  '@_uuid': string;
}

export interface DocumentXml {
  '@_uuid': string;
  DocumentPath: string;
  Files: DocumentFilesXml;
}

export interface DocumentFilesXml {
  '@_FilesCount': number;
  Metadata: FileXml;
  Primary: FileXml;
  Attachments?: FileXml[];
}

export interface FileXml {
  '#text': string;
  '@_uuid': string;
}

export interface RepresentationInformationXml {
  '@_uuid': string;
  Name: string;
  Description: string;
  MimeType: string;
  Content: FileXml[];
}

export interface MoreDataXml {
  '#text': string;
  '@_name': string;
}
