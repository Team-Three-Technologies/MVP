import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { GetDocumentDetailsUseCase } from './get-document-details.use-case';
import {
  DocumentDetailsResponseDTO,
  SubjectDTO,
} from '../../../shared/response/document-details.response.dto';
import { DocumentRepository } from '../repositories/document.repository.interface';

@injectable()
export class GetDocumentDetailsService implements GetDocumentDetailsUseCase {
  constructor(
    @inject(TOKENS.DocumentRepository)
    private readonly documentRepository: DocumentRepository,
  ) {}

  private unwrapSubject(subject: Record<string, string>, index: number): SubjectDTO {
    const tipoSoggetto = subject['TipoSoggetto'];
    let name = '';

    switch (tipoSoggetto) {
      case 'PF': {
        const cognome = subject['PF.Cognome'] ?? '';
        const nome = subject['PF.Nome'] ?? '';
        name = `${cognome} ${nome}`.trim();
        break;
      }
      case 'PG': {
        const org = subject['PG.DenominazioneOrganizzazione'] ?? '';
        const ufficio = subject['PG.DenominazioneUfficio'];
        name = ufficio ? `${org}, Ufficio: ${ufficio}` : org;
        break;
      }
      case 'PAI': {
        const parts: string[] = [];

        const ammDen = subject['PAI.IPAAmm.Denominazione'];
        const ammIpa = subject['PAI.IPAAmm.CodiceIPA'];
        if (ammDen) parts.push(`${ammDen} (IPA: ${ammIpa})`);

        const aooDen = subject['PAI.IPAAOO.Denominazione'];
        const aooIpa = subject['PAI.IPAAOO.CodiceIPA'];
        if (aooDen) parts.push(`${aooDen} (IPA: ${aooIpa})`);

        const uorDen = subject['PAI.IPAUOR.Denominazione'];
        const uorIpa = subject['PAI.IPAUOR.CodiceIPA'];
        if (uorDen) parts.push(`${uorDen} (IPA: ${uorIpa})`);

        name = parts.join(', ');
        break;
      }
      case 'PAE': {
        const amm = subject['PAE.DenominazioneAmministrazione'] ?? '';
        const ufficio = subject['PAE.DenominazioneUfficio'];
        name = ufficio ? `${amm}, Ufficio: ${ufficio}` : amm;
        break;
      }
      case 'AS': {
        const cognome = subject['AS.Cognome'] ?? '';
        const nome = subject['AS.Nome'] ?? '';
        const person = `${cognome} ${nome}`.trim();

        const org = subject['AS.DenominazioneOrganizzazione'];
        if (org) {
          const ufficio = subject['AS.DenominazioneUfficio'] ?? '';
          name = `${org}, Ufficio: ${ufficio}${person ? ` — ${person}` : ''}`;
        } else {
          const parts: string[] = [];
          const ammDen = subject['AS.IPAAmm.Denominazione'];
          const ammIpa = subject['AS.IPAAmm.CodiceIPA'];
          if (ammDen) parts.push(`${ammDen} (IPA: ${ammIpa})`);

          const aooDen = subject['AS.IPAAOO.Denominazione'];
          const aooIpa = subject['AS.IPAAOO.CodiceIPA'];
          if (aooDen) parts.push(`${aooDen} (IPA: ${aooIpa})`);

          const uorDen = subject['AS.IPAUOR.Denominazione'];
          const uorIpa = subject['AS.IPAUOR.CodiceIPA'];
          if (uorDen) parts.push(`${uorDen} (IPA: ${uorIpa})`);

          name = `${parts.join(', ')}${person ? ` — ${person}` : ''}`;
        }
        break;
      }
      case 'RUP': {
        const cognome = subject['RUP.Cognome'] ?? '';
        const nome = subject['RUP.Nome'] ?? '';
        const person = `${cognome} ${nome}`.trim();

        const parts: string[] = [];
        const ammDen = subject['RUP.IPAAmm.Denominazione'];
        const ammIpa = subject['RUP.IPAAmm.CodiceIPA'];
        if (ammDen) parts.push(`${ammDen} (IPA: ${ammIpa})`);

        const aooDen = subject['RUP.IPAAOO.Denominazione'];
        const aooIpa = subject['RUP.IPAAOO.CodiceIPA'];
        if (aooDen) parts.push(`${aooDen} (IPA: ${aooIpa})`);

        const uorDen = subject['RUP.IPAUOR.Denominazione'];
        const uorIpa = subject['RUP.IPAUOR.CodiceIPA'];
        if (uorDen) parts.push(`${uorDen} (IPA: ${uorIpa})`);

        name = `${person}${parts.length ? ` — ${parts.join(', ')}` : ''}`;
        break;
      }
      case 'SW': {
        name = subject['SW.DenominazioneSistema'] ?? '';
        break;
      }
      default:
        name = '';
    }

    return {
      id: index,
      role: subject['TipoRuolo'],
      name,
      type: tipoSoggetto,
    };
  }

  public async execute(documentUuid: string): Promise<DocumentDetailsResponseDTO> {
    const document = await this.documentRepository.findByUuid(documentUuid, true);

    if (!document) {
      throw new Error(`Non esiste un documento con questo UUID: ${documentUuid}`);
    }

    const subjectMetadata = document
      .getMetadata()
      .filter((met) => met.getName().match(/[a-zA-Z]+\.Soggetti\.Ruolo\.\d+\./));

    const subjectsMap = new Map<string, Record<string, string>>();

    for (const meta of subjectMetadata) {
      const match = meta.getName().match(/\.Soggetti\.Ruolo\.(\d+)\.\w+\.(.+)$/);
      if (!match) continue;

      const [, index, field] = match;

      if (!subjectsMap.has(index)) {
        subjectsMap.set(index, {});
      }

      subjectsMap.get(index)![field] = meta.getValue();
    }

    const subjects = Array.from(subjectsMap.entries())
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([, fields]) => fields);

    const dto = {
      uuid: document.getUuid(),
      name: document.getMain().getFilename(),
      extension: document.getMain().getExtension(),
      registrationType:
        document.getMetadataValueByRegex(
          /[a-zA-Z]+\.DatiDiRegistrazione\.TipoRegistro\.\w+\.TipoRegistro/,
        ) ?? '',
      registrationDate:
        document.getMetadataValueByRegex(
          /[a-zA-Z]+\.DatiDiRegistrazione\.TipoRegistro\.\w+\.Data\w+/,
        ) ?? '',
      registrationTime:
        document.getMetadataValueByRegex(
          /[a-zA-Z]+\.DatiDiRegistrazione\.TipoRegistro\.\w+\.Ora\w+/,
        ) ?? '',
      content: document.getMetadataValueByRegex(/[a-zA-Z]+\.ChiaveDescrittiva\.Oggetto$/) ?? '',
      version: document.getMetadataValueByRegex(/[a-zA-Z]+\.VersioneDelDocumento$/) ?? '',
      filesCount: Number(
        document.getMetadataValueByName('ArchimemoData.DocumentInformation.FilesCount'),
      ),
      totalSize: `${document.getMetadataValueByName('ArchimemoData.DocumentInformation.TotalSize.#text')} ${document.getMetadataValueByName('ArchimemoData.DocumentInformation.TotalSize.@_unit')}`,
      attachmentsCount: document.getAttachments().length,
      attachments: document.getAttachments().map((att) => {
        return {
          uuid: att.getUuid(),
          path: att.getPath(),
          extension: att.getExtension(),
        };
      }),
      documentType: document.getMetadataValueByRegex(/[a-zA-Z]+\.TipologiaDocumentale$/) ?? '',
      documentNumber:
        document.getMetadataValueByRegex(
          /[a-zA-Z]+\.DatiDiRegistrazione\.TipoRegistro\.\S+\.Numero[a-zA-Z]*Documento$/,
        ) ?? '',
      registryCode:
        document.getMetadataValueByRegex(
          /[a-zA-Z]+\.DatiDiRegistrazione\.TipoRegistro\.\S+\.CodiceRegistro$/,
        ) ?? '',
      aggregationType:
        document.getMetadataValueByRegex(/[a-zA-Z]+\.Agg\.TipoAgg\.\d+\.TipoAggregazione$/) ?? '',
      subjects: subjects.map((subject, i) => this.unwrapSubject(subject, i)),
    };

    return dto;
  }
}
