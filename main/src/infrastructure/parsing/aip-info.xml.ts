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
        '@_uuid'?: string;
      };
      Customization?: {
        Properties: MoreDataXml | MoreDataXml[];
        MoreData?: MoreDataXml | MoreDataXml[];
      };
      SubmissionSession: SubmissionSessionXml | SubmissionSessionXml[];
      PreservationSession: PreservationSessionXml;
      MoreData?: MoreDataXml | MoreDataXml[];
      '@_uuid'?: string;
    };
    '@_language'?: string;
    '@_schemaUri'?: string;
    '@_schemaVersion'?: string;
    '@_validFrom'?: string;
  };
}

export interface MoreDataXml {
  '#text'?: string;
  '@_name': string;
}

export interface MimeTypeXml {
  '#text'?: string;
  '@_MIMETypeExtension'?: string;
  '@_IRUUID'?: string;
}

export interface DefaultValueXml {
  '#text'?: string;
  '@_metadataName': string;
  '@_metadataXPath': string;
}

export interface SubmissionSessionXml {
  Start: AiPInfoXml['AiPInfo']['Process']['Start'];
  End: AiPInfoXml['AiPInfo']['Process']['End'];
  MoreData?: MoreDataXml | MoreDataXml[];
  '@_uuid'?: string;
}

export interface PreservationSessionXml {
  Start: AiPInfoXml['AiPInfo']['Process']['Start'];
  End?: AiPInfoXml['AiPInfo']['Process']['End'];
  HashEncoding?: 'Hex' | 'Base64' | string;
  AdvancedElectronicSignaturesFormat?: 'XAdES' | 'PAdES' | 'CAdES' | 'JAdES' | 'ASiC' | 'Other' | string;
  DocumentsStats: {
    SipCount?: number | string;
    DocumentsCount: number | string;
    DocumentsFilesCount: number | string;
    DocumentsOverallSize: {
      '#text'?: string;
      '@_unit'?: 'bytes' | 'kilobytes' | 'megabytes' | 'gigabytes' | 'terabytes' | string;
    };
    MimeTypeStats?: Array<{
      '#text'?: string;
      '@_MIMETypeExtension'?: string;
    }> | {
      '#text'?: string;
      '@_MIMETypeExtension'?: string;
    };
    MoreData?: MoreDataXml | MoreDataXml[];
  };
  MoreData?: MoreDataXml | MoreDataXml[];
  '@_uuid'?: string;
}