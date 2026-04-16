export interface AiPInfoXml {
  AiPInfo: {
    Process: {
      Start: {
        Date: string;
        UserUUID: string;
        Source: 'WebService' | 'WebGui' | 'FolderScan' | 'Import' | 'System' | 'Other' | string;
        MoreData?: MoreDataXml | MoreDataXml[];
      };
      End: {
        Date: string;
        UserUUID?: string;
        Source?: string;
        Status?: string;
        MoreData?: MoreDataXml | MoreDataXml[];
      };
      DocumentClass: {
        Name: string;
        Version: string;
        ArchiveUUID: string;
        AcceptedMIMEType?: {
          MIMEType?: MimeTypeXml | MimeTypeXml[];
        };
        PrecompiledValues?: {
          DefaultValue?: DefaultValueXml | DefaultValueXml[];
        };
        MoreData?: MoreDataXml | MoreDataXml[];
        '@_ark-aip:uuid': string;
      };
      Customization?: {
        Properties: MoreDataXml | MoreDataXml[];
        MoreData?: MoreDataXml | MoreDataXml[];
      };
      SubmissionSession: SubmissionSessionXml | SubmissionSessionXml[];
      PreservationSession: PreservationSessionXml;
      MoreData?: MoreDataXml | MoreDataXml[];
      '@_ark-aip:uuid': string;
    };
    '@_ark-aip:language'?: string;
    '@_ark-aip:schemaUri'?: string;
    '@_ark-aip:schemaVersion'?: string;
    '@_ark-aip:validFrom'?: string;
  };
}

export interface MoreDataXml {
  '#text'?: string;
  '@_ark-aip:name': string;
}

export interface MimeTypeXml {
  '#text'?: string;
  '@_ark-aip:MIMETypeExtension'?: string;
  '@_ark-aip:IRUUID'?: string;
}

export interface DefaultValueXml {
  '#text'?: string;
  '@_ark-aip:metadataName': string;
  '@_ark-aip:metadataXPath': string;
}

export interface SubmissionSessionXml {
  Start: AiPInfoXml['AiPInfo']['Process']['Start'];
  End: AiPInfoXml['AiPInfo']['Process']['End'];
  MoreData?: MoreDataXml | MoreDataXml[];
  '@_ark-aip:uuid': string;
}

export interface PreservationSessionXml {
  Start: AiPInfoXml['AiPInfo']['Process']['Start'];
  End?: AiPInfoXml['AiPInfo']['Process']['End'];
  HashEncoding?: 'Hex' | 'Base64' | string;
  AdvancedElectronicSignaturesFormat?:
    | 'XAdES'
    | 'PAdES'
    | 'CAdES'
    | 'JAdES'
    | 'ASiC'
    | 'Other'
    | string;
  DocumentsStats: {
    SipCount?: number | string;
    DocumentsCount: number | string;
    DocumentsFilesCount: number | string;
    DocumentsOverallSize: {
      '#text'?: string;
      '@_ark-aip:unit'?: 'bytes' | 'kilobytes' | 'megabytes' | 'gigabytes' | 'terabytes' | string;
    };
    MimeTypeStats?:
      | Array<{
          '#text'?: string;
          '@_ark-aip:MIMETypeExtension'?: string;
        }>
      | {
          '#text'?: string;
          '@_ark-aip:MIMETypeExtension'?: string;
        };
    MoreData?: MoreDataXml | MoreDataXml[];
  };
  MoreData?: MoreDataXml | MoreDataXml[];
  '@_ark-aip:uuid': string;
}
