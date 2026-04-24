import { MetadataTypeEnum } from '../domain/metadata-type.enum';

export interface TypePolicy {
  booleanExact: string[];
  booleanRegex: RegExp[];
  numberExact: string[];
  numberRegex: RegExp[];
  base64Exact: string[];
  base64Regex: RegExp[];
  dateExact: string[];
  dateRegex: RegExp[];
  timeExact: string[];
  timeRegex: RegExp[];
}

const DEFAULT_POLICY: Required<TypePolicy> = {
  booleanExact: [
    'DocumentoInformatico.Riservato',
    'DocumentoInformatico.Verifica.FirmatoDigitalmente',
    'DocumentoInformatico.Verifica.SigillatoElettronicamente',
    'DocumentoInformatico.Verifica.MarcaturaTemporale',
    'DocumentoInformatico.Verifica.ConformitaCopieImmagineSuSupportoInformatico',
  ],
  booleanRegex: [],
  numberExact: [
    'DocumentoInformatico.Allegati.NumeroAllegati',
    'DocumentoInformatico.TempoDiConservazione',
    'ArchimemoData.DocumentInformation.FilesCount',
  ],
  numberRegex: [],
  base64Exact: [],
  base64Regex: [/(^|\.)(Impronta)(\.|$)/i],
  dateExact: [],
  dateRegex: [/(^|\.)(Data[A-Z_a-z]*)(\.|$)/],
  timeExact: [],
  timeRegex: [/(^|\.)(Ora[A-Z_a-z]*)(\.|$)/],
};

export class MetadataTypePolicy {
  private policy: Required<TypePolicy>;

  constructor(policy?: TypePolicy) {
    this.policy = {
      booleanExact: policy?.booleanExact ?? DEFAULT_POLICY.booleanExact,
      booleanRegex: policy?.booleanRegex ?? DEFAULT_POLICY.booleanRegex,
      numberExact: policy?.numberExact ?? DEFAULT_POLICY.numberExact,
      numberRegex: policy?.numberRegex ?? DEFAULT_POLICY.numberRegex,
      base64Exact: policy?.base64Exact ?? DEFAULT_POLICY.base64Exact,
      base64Regex: policy?.base64Regex ?? DEFAULT_POLICY.base64Regex,
      dateExact: policy?.dateExact ?? DEFAULT_POLICY.dateExact,
      dateRegex: policy?.dateRegex ?? DEFAULT_POLICY.dateRegex,
      timeExact: policy?.timeExact ?? DEFAULT_POLICY.timeExact,
      timeRegex: policy?.timeRegex ?? DEFAULT_POLICY.timeRegex,
    };
  }

  public type(path: string): MetadataTypeEnum {
    if (
      this.policy.booleanExact.includes(path) ||
      this.policy.booleanRegex.some((r) => r.test(path))
    ) {
      return MetadataTypeEnum.BOOLEAN;
    }

    if (this.policy.numberExact.includes(path) || this.policy.numberRegex.some((r) => r.test(path))) {
      return MetadataTypeEnum.NUMBER;
    }

    if (this.policy.base64Exact.includes(path) || this.policy.base64Regex.some((r) => r.test(path))) {
      return MetadataTypeEnum.BASE64;
    }

    if (this.policy.dateExact.includes(path) || this.policy.dateRegex.some((r) => r.test(path))) {
      return MetadataTypeEnum.DATE;
    }

    if (this.policy.timeExact.includes(path) || this.policy.timeRegex.some((r) => r.test(path))) {
      return MetadataTypeEnum.TIME;
    }

    return MetadataTypeEnum.STRING;
  }
}
