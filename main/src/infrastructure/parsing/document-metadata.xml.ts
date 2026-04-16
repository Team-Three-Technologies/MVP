export interface DocumentMetadataXml {
  Document: {
    DocumentoInformatico: DocumentoInformaticoXml;
    CustomMetadata?: CustomMetadataXml;
    ArchimemoData: ArchimemoDataXml;
  };
}

export interface DocumentoInformaticoXml {
  IdDoc: IdDocXml;
  ModalitaDiFormazione: string;
  TipologiaDocumentale: string;
  DatiDiRegistrazione: DatiDiRegistrazioneXml;
  Soggetti: SoggettiXml;
  ChiaveDescrittiva: ChiaveDescrittivaXml;
  Allegati: AllegatiXml;
  Classificazione?: ClassificazioneXml;
  Riservato: boolean;
  IdentificativoDelFormato: IdentificativoDelFormatoXml;
  Verifica: VerificaXml;
  Agg: AggXml;
  IdIdentificativoDocumentoPrimario?: IdDocXml;
  NomeDelDocumento: string;
  VersioneDelDocumento: string;
  TracciatureModificheDocumento?: TracciatureModificheDocumentoXml[];
  TempoDiConservazione?: number;
  Note?: string;
}

export interface IdDocXml {
  ImprontaCrittograficaDelDocumento: ImprontaCrittograficaDelDocumentoXml;
  Identificativo: string;
}

export interface ImprontaCrittograficaDelDocumentoXml {
  Impronta: string;
  Algoritmo?: string;
}

export interface DatiDiRegistrazioneXml {
  TipologiaDiFlusso: 'E' | 'U' | 'I' | string;
  TipoRegistro: TipoRegistroXml;
}

export interface TipoRegistroXml {
  Nessuno?: NoRegistroXml;
  ProtocolloOrdinario_ProtocolloEmergenza?: ProtocolloXml;
  Repertorio_Registro?: NoProtocolloXml;
}

export interface NoRegistroXml {
  TipoRegistro: string;
  DataDocumento: string;
  OraDocumento?: string;
  NumeroDocumento: string;
}

export interface ProtocolloXml {
  TipoRegistro: string;
  DataProtocollazioneDocumento: string;
  OraProtocollazioneDocumento?: string;
  NumeroProtocolloDocumento: string;
  CodiceRegistro: string;
}

export interface NoProtocolloXml {
  TipoRegistro: string;
  DataRegistrazioneDocumento: string;
  OraRegistrazioneDocumento?: string;
  NumeroRegistrazioneDocumento: string;
  CodiceRegistro: string;
}

export interface SoggettiXml {
  Ruolo: RuoloXml[];
}

export interface RuoloXml {
  SoggettoCheEffettuaLaRegistrazione?: TipoSoggetto21Xml;
  Assegnatario?: TipoSoggetto22Xml;
  Destinatario?: TipoSoggetto11Xml;
  Mittente?: TipoSoggetto12Xml;
  Autore?: TipoSoggetto31Xml;
  Operatore?: TipoSoggetto32Xml;
  ResponsabileGestioneDocumentale?: TipoSoggetto33Xml;
  ResponsabileServizioProtocollo?: TipoSoggetto34Xml;
  Produttore?: TipoSoggetto4Xml;
  Altro?: TipoSoggetto13Xml;
}

export interface TipoSoggetto11Xml {
  TipoRuolo: string;
  PF?: PFXml;
  PG?: PGXml;
  PAI?: PAIXml;
  PAE?: PAEXml;
}
export interface TipoSoggetto12Xml {
  TipoRuolo: string;
  PF?: PFXml;
  PG?: PGXml;
  PAI?: PAIXml;
  PAE?: PAEXml;
}
export interface TipoSoggetto13Xml {
  TipoRuolo: string;
  PF?: PFXml;
  PG?: PGXml;
  PAI?: PAIXml;
  PAE?: PAEXml;
}
export interface TipoSoggetto21Xml {
  TipoRuolo: string;
  PF?: PFXml;
  PG?: PGXml;
}
export interface TipoSoggetto22Xml {
  TipoRuolo: string;
  AS: ASXml;
}
export interface TipoSoggetto31Xml {
  TipoRuolo: string;
  PF?: PFXml;
  PG?: PGXml;
  PAI?: PAIXml;
  PAE?: PAEXml;
}
export interface TipoSoggetto32Xml {
  TipoRuolo: string;
  PF: PFXml;
}
export interface TipoSoggetto33Xml {
  TipoRuolo: string;
  PF: PFXml;
}
export interface TipoSoggetto34Xml {
  TipoRuolo: string;
  PF: PFXml;
}
export interface TipoSoggetto4Xml {
  TipoRuolo: string;
  SW: SWXml;
}

export interface PFXml {
  Cognome: string;
  Nome: string;
  CodiceFiscale?: string;
  IndirizziDigitaliDiRiferimento?: string[];
}

export interface PGXml {
  DenominazioneOrganizzazione: string;
  CodiceFiscale_PartitaIva?: string;
  DenominazioneUfficio?: string;
  IndirizziDigitaliDiRiferimento?: string[];
}

export interface PAIXml {
  IPAAmm: CodiceIPAXml;
  IPAAOO?: CodiceIPAXml;
  IPAUOR?: CodiceIPAXml;
  IndirizziDigitaliDiRiferimento?: string[];
}

export interface PAEXml {
  DenominazioneAmministrazione: string;
  DenominazioneUfficio?: string;
  IndirizziDigitaliDiRiferimento?: string[];
}

export interface CodiceIPAXml {
  Denominazione: string;
  CodiceIPA: string;
}

export interface ASXml {
  Cognome?: string;
  Nome?: string;
  CodiceFiscale?: string;
  DenominazioneOrganizzazione: string;
  DenominazioneUfficio: string;
  IndirizziDigitaliDiRiferimento?: string[];
}

export interface SWXml {
  DenominazioneSistema: string;
}

export interface ChiaveDescrittivaXml {
  Oggetto: string;
  ParoleChiave?: string[];
}

export interface AllegatiXml {
  NumeroAllegati: number | string;
  IndiceAllegati?: IndiceAllegatiXml[];
}

export interface IndiceAllegatiXml {
  IdDoc: IdDocXml;
  Descrizione: string;
}

export interface ClassificazioneXml {
  IndiceDiClassificazione?: string;
  Descrizione?: string;
  PianoDiClassificazione?: string;
}

export interface IdentificativoDelFormatoXml {
  Formato: string;
  ProdottoSoftware?: ProdottoSoftwareXml;
}

export interface ProdottoSoftwareXml {
  NomeProdotto?: string;
  VersioneProdotto?: string;
  Produttore?: string;
}

export interface VerificaXml {
  FirmatoDigitalmente: boolean;
  SigillatoElettronicamente: boolean;
  MarcaturaTemporale: boolean;
  ConformitaCopieImmagineSuSupportoInformatico: boolean;
}

export interface AggXml {
  TipoAgg?: IdAggXml[];
}

export interface IdAggXml {
  TipoAggregazione: 'Fascicolo' | 'Serie Documentale' | 'Serie Di Fascicoli' | string;
  IdAggregazione: string;
}

export interface TracciatureModificheDocumentoXml {
  TipoModifica: 'Annullamento' | 'Rettifica' | 'Integrazione' | 'Annotazione' | string;
  SoggettoAutoreDellaModifica: PFXml;
  DataModifica: string;
  OraModifica?: string;
  IdDocVersionePrecedente: IdDocXml;
}

export interface CustomMetadataXml {
  '@_cmLanguage'?: string;
  '@_cmSchemaUri'?: string;
  '@_cmSchemaVersion'?: string;
  '@_cmValidFrom'?: string;
}

export interface ArchimemoDataXml {
  '@_adLanguage'?: string;
  '@_adSchemaUri'?: string;
  '@_adSchemaVersion'?: string;
  '@_adValidFrom': string;

  DocumentInformation: DocumentInformationXml;
  FileInformation?: FileInformationXml[];
  MoreData?: MoreDataXml[];
}

export interface DocumentInformationXml {
  PreservationProcessUUID: string;
  PreservationProcessDate: string;
  DocumentUUID: string;
  FilesCount: number | string;
  TotalSize: SizeXml;
  MoreData?: MoreDataXml[];
}

export interface FileInformationXml {
  '@_isPrimary'?: boolean;
  '@_customerHasDeclaredHash'?: boolean;
  '@_originalFileName'?: string;

  FileUUID: string;
  FileLocalName?: string;
  FileSize: SizeXml;
  CustomHashValue?: string;
  MoreData?: MoreDataXml[];
}

export interface SizeXml {
  '#text'?: string;
  '@_unit'?: 'bytes' | 'chilobytes' | 'megabytes' | 'gigabytes' | 'terabytes' | string;
}

export interface MoreDataXml {
  '#text'?: string;
  '@_name': string;
}
