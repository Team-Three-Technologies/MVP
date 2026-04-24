export interface PathPolicy {
  allowExact: string[];
  allowRegex: RegExp[];
  denyExact: string[];
  denyRegex: RegExp[];
  utilityExact: string[];
  utilityRegex: RegExp[];
}

const DEFAULT_POLICY: Required<PathPolicy> = {
  allowExact: [],
  allowRegex: [
    // SizeXml
    /^ArchimemoData\.DocumentInformation\.TotalSize\.(#text|@_unit)$/,
    /^ArchimemoData\.FileInformation\.\d+\.FileSize\.(#text|@_unit)$/,
    // MoreDataXml
    /^ArchimemoData\.MoreData\.\d+\.(#text|@_name)$/,
    /^ArchimemoData\.DocumentInformation\.MoreData\.\d+\.(#text|@_name)$/,
    /^ArchimemoData\.FileInformation\.\d+\.MoreData\.\d+\.(#text|@_name)$/,
    // FileInformationXml
    /^ArchimemoData\.FileInformation\.\d+\.(@_isPrimary|@_customerHasDeclaredHash|@_originalFileName)$/,
  ],
  denyExact: [],
  denyRegex: [/(^|\.)@_/, /(^|\.)#text$/],
  utilityExact: [],
  utilityRegex: [/[a-zA-Z]+\.Soggetti\.Ruolo\.\d+\.[a-zA-Z]+\.[a-zA-Z]+$/],
};

export class MetadataPathPolicy {
  private policy: Required<PathPolicy>;

  constructor(policy?: PathPolicy) {
    this.policy = {
      allowExact: policy?.allowExact ?? DEFAULT_POLICY.allowExact,
      allowRegex: policy?.allowRegex ?? DEFAULT_POLICY.allowRegex,
      denyExact: policy?.denyExact ?? DEFAULT_POLICY.denyExact,
      denyRegex: policy?.denyRegex ?? DEFAULT_POLICY.denyRegex,
      utilityExact: policy?.utilityExact ?? DEFAULT_POLICY.utilityExact,
      utilityRegex: policy?.utilityRegex ?? DEFAULT_POLICY.utilityRegex,
    };
  }

  public include(path: string): boolean {
    if (this.policy.allowExact.includes(path) || this.policy.allowRegex.some((r) => r.test(path))) {
      return true;
    }

    if (this.policy.denyExact.includes(path) || this.policy.denyRegex.some((r) => r.test(path))) {
      return false;
    }

    return true;
  }

  public utility(path: string): boolean {
    if (
      this.policy.utilityExact.includes(path) ||
      this.policy.utilityRegex.some((r) => r.test(path))
    ) {
      return true;
    }

    return false;
  }
}
