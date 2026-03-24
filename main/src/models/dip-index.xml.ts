export interface XmlDipIndex {
  complianceStatements: XmlComplianceStatement[];
  packageInfo: XmlPackageInfo;
  packageContent: XmlPackageContent;
}

export interface XmlComplianceStatement {
  title: string;
  body: string;
  lang: string;
}

export interface XmlPackageInfo {
  creatingApplication: XmlCreatingApplication;
  processUUID: string;
  creationDate: Date;
  documentsCount: number;
  aipCount: number;
}

export interface XmlCreatingApplication {
  name: string;
  version: string;
  producer: string;
}

export interface XmlPackageContent {
  dipDocuments: XmlDipDocuments;
  representationInformation?: XmlRepresentationInformation[];
}

export interface XmlDipDocuments {
  documentClasses: XmlDocumentClass[];
}

export interface XmlDocumentClass {
  uuid: string;
  name: string;
  version: string;
  validFrom: Date;
  validTo?: Date;
  representationInformationUUIDs?: string[];
  aips: XmlAip[];
  moreData?: XmlMoreData[];
}

export interface XmlAip {
  uuid: string;
  aipRoot: string;
  reports?: XmlReport[];
  sips?: XmlSip[];
  documents: XmlDocument[];
}

export interface XmlReport {
  uuid: string;
  name: string;
  path: string;
}

export interface XmlSip {
  uuid: string;
  path: string;
}

export interface XmlDocument {
  uuid: string;
  documentPath: string;
  files: XmlDocumentFiles;
}

export interface XmlDocumentFiles {
  filesCount: number;
  metadata: XmlDipFile;
  primary: XmlDipFile;
  attachments?: XmlDipFile[];
}

export interface XmlDipFile {
  uuid: string;
  path: string;
}

export interface XmlRepresentationInformation {
  uuid: string;
  name: string;
  description: string;
  mimeType: string;
  contents: XmlDipFile[];
}

export interface XmlMoreData {
  name: string;
  value: string;
}