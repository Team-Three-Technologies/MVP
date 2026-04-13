import { Document } from '../domain/document.model';
import { File } from '../domain/file.model';
import { Metadata } from '../domain/metadata.model';
import { Subject } from '../domain/subject.model';
import { RolesTypeEnum } from '../domain/roles-type.enum';
import { DocumentParsingResult } from '../infrastructure/parsing/document-parsing.result';
import { MetadataTypeEnum } from '../domain/metadata-type.enum';
import { ASSubject } from '../domain/as-subject.model';
import { PFSubject } from '../domain/pf-subject.model';
import { PGSubject } from '../domain/pg-subject.model';
import { PAESubject } from '../domain/pae-subject.model';
import { PAISubject } from '../domain/pai-subject.model';
import { SWSubject } from '../domain/sw-subject.model';
import { Person } from '../domain/person.model';
import { RuoloXml, TipoSoggetto11Xml, TipoSoggetto12Xml, TipoSoggetto13Xml, TipoSoggetto21Xml, TipoSoggetto22Xml, TipoSoggetto31Xml, TipoSoggetto32Xml, TipoSoggetto33Xml, TipoSoggetto34Xml, TipoSoggetto4Xml } from '../infrastructure/parsing/document-metadata.xml';

type SubjectRoleEntry = {
  roleType: RolesTypeEnum;
  subject: Subject;
}

type RolePayload =
  | TipoSoggetto11Xml
  | TipoSoggetto12Xml
  | TipoSoggetto13Xml
  | TipoSoggetto21Xml
  | TipoSoggetto22Xml
  | TipoSoggetto31Xml
  | TipoSoggetto32Xml
  | TipoSoggetto33Xml
  | TipoSoggetto34Xml
  | TipoSoggetto4Xml;

export class DocumentMapper {
  private toSubjectFromPayload(payload: RolePayload): Subject | undefined {
    if ('AS' in payload && payload.AS) {
      return new ASSubject(
        null,
        new Person(payload.AS.Nome, payload.AS.Cognome, payload.AS.CodiceFiscale),
        payload.AS.DenominazioneOrganizzazione,
        payload.AS.DenominazioneUfficio,
        payload.AS.IndirizziDigitaliDiRiferimento ?? []
      );
    }

    if ('SW' in payload && payload.SW) {
      return new SWSubject(null, payload.SW.DenominazioneSistema);
    }

    if ('PF' in payload && payload.PF) {
      return new PFSubject(
        null,
        new Person(payload.PF.Nome, payload.PF.Cognome, payload.PF.CodiceFiscale),
        payload.PF.IndirizziDigitaliDiRiferimento ?? []
      );
    }

    if ('PG' in payload && payload.PG) {
      return new PGSubject(
        null,
        payload.PG.DenominazioneOrganizzazione,
        payload.PG.CodiceFiscale_PartitaIva,
        payload.PG.DenominazioneUfficio,
        payload.PG.IndirizziDigitaliDiRiferimento ?? []
      );
    }

    if ('PAI' in payload && payload.PAI) {
      return new PAISubject(
        null,
        payload.PAI.IPAAmm.Denominazione,
        payload.PAI.IPAAmm.CodiceIPA,
        payload.PAI.IPAAOO?.Denominazione,
        payload.PAI.IPAAOO?.CodiceIPA,
        payload.PAI.IPAUOR?.Denominazione,
        payload.PAI.IPAUOR?.CodiceIPA,
        payload.PAI.IndirizziDigitaliDiRiferimento ?? []
      );
    }

    if ('PAE' in payload && payload.PAE) {
      return new PAESubject(
        null,
        payload.PAE.DenominazioneAmministrazione,
        payload.PAE.DenominazioneUfficio,
        payload.PAE.IndirizziDigitaliDiRiferimento ?? []
      );
    }

    return undefined;
  }

  private pickRolePayload(role: RuoloXml): { roleType: RolesTypeEnum; payload: RolePayload } | undefined {
    if (role.Altro) return { roleType: RolesTypeEnum.ALT, payload: role.Altro };
    if (role.Assegnatario) return { roleType: RolesTypeEnum.ASS, payload: role.Assegnatario };
    if (role.Autore) return { roleType: RolesTypeEnum.AUT, payload: role.Autore };
    if (role.Destinatario) return { roleType: RolesTypeEnum.DES, payload: role.Destinatario };
    if (role.Mittente) return { roleType: RolesTypeEnum.MIT, payload: role.Mittente };
    if (role.Operatore) return { roleType: RolesTypeEnum.OPE, payload: role.Operatore };
    if (role.Produttore) return { roleType: RolesTypeEnum.PRO, payload: role.Produttore };
    if (role.ResponsabileGestioneDocumentale) return { roleType: RolesTypeEnum.RGD, payload: role.ResponsabileGestioneDocumentale };
    if (role.ResponsabileServizioProtocollo) return { roleType: RolesTypeEnum.RSP, payload: role.ResponsabileServizioProtocollo };
    if (role.SoggettoCheEffettuaLaRegistrazione) return { roleType: RolesTypeEnum.SER, payload: role.SoggettoCheEffettuaLaRegistrazione };
    return undefined;
  }

  private mapRuoli(ruoli: RuoloXml[]): SubjectRoleEntry[] {
    return ruoli
      .map((role) => {
        const picked = this.pickRolePayload(role);
        if (!picked) return undefined;

        const subject = this.toSubjectFromPayload(picked.payload);
        if (!subject) return undefined;

        return {
          roleType: picked.roleType,
          subject
        } as SubjectRoleEntry;
      })
      .filter((e): e is SubjectRoleEntry => e !== undefined);
  }

  public toDomain(parsedDocument: DocumentParsingResult): Document {
    const primary = parsedDocument.documentMetadata.Document.ArchimemoData.FileInformation?.find(f => f['@_isPrimary']);
    const uuid: string = parsedDocument.documentMetadata.Document.DocumentoInformatico.IdDoc.Identificativo;
    const documentPath: string = parsedDocument.documentPath;

    const main: File = new File(
      parsedDocument.uuid,
      parsedDocument.primaryFilePath,
      `${String(primary?.FileSize?.['#text'] ?? '')} ${String(primary?.FileSize?.['@_unit'] ?? '')}`.trim()
    );

    const attachments: File[] = parsedDocument.attachmentsFilesPath.map(a => {
      const attachmentXml = (parsedDocument.documentMetadata.Document.ArchimemoData.FileInformation ?? []).find(att => att.FileUUID === a[0]);

      return new File(
        a[0],
        a[1],
        `${String(attachmentXml?.FileSize?.['#text'] ?? '')} ${String(attachmentXml?.FileSize?.['@_unit'] ?? '')}`.trim()
      );
    });

    const metadata: Metadata[] = [
      new Metadata('IdDoc.Identificativo', parsedDocument.documentMetadata.Document.DocumentoInformatico.IdDoc.Identificativo, MetadataTypeEnum.STRING),
      new Metadata('IdDoc.ImprontaCrittograficaDelDocumento.Impronta', parsedDocument.documentMetadata.Document.DocumentoInformatico.IdDoc.ImprontaCrittograficaDelDocumento.Impronta, MetadataTypeEnum.BASE64),
      new Metadata('ModalitaDiFormazione', parsedDocument.documentMetadata.Document.DocumentoInformatico.ModalitaDiFormazione, MetadataTypeEnum.STRING),
      new Metadata('TipologiaDocumentale', parsedDocument.documentMetadata.Document.DocumentoInformatico.TipologiaDocumentale, MetadataTypeEnum.STRING),
      new Metadata('DatiDiRegistrazione.TipologiaDiFlusso', parsedDocument.documentMetadata.Document.DocumentoInformatico.DatiDiRegistrazione.TipologiaDiFlusso, MetadataTypeEnum.STRING),
      new Metadata('ChiaveDescrittiva.Oggetto', parsedDocument.documentMetadata.Document.DocumentoInformatico.ChiaveDescrittiva.Oggetto, MetadataTypeEnum.STRING),
      new Metadata('Allegati.NumeroAllegati', String(parsedDocument.documentMetadata.Document.DocumentoInformatico.Allegati.NumeroAllegati), MetadataTypeEnum.NUMBER),
      new Metadata('Riservato', String(parsedDocument.documentMetadata.Document.DocumentoInformatico.Riservato), MetadataTypeEnum.BOOLEAN),
      new Metadata('IdentificativoDelFormato.Formato', parsedDocument.documentMetadata.Document.DocumentoInformatico.IdentificativoDelFormato.Formato, MetadataTypeEnum.STRING),
      new Metadata('Verifica.FirmatoDigitalmente', String(parsedDocument.documentMetadata.Document.DocumentoInformatico.Verifica.FirmatoDigitalmente), MetadataTypeEnum.BOOLEAN),
      new Metadata('Verifica.SigillatoElettronicamente', String(parsedDocument.documentMetadata.Document.DocumentoInformatico.Verifica.SigillatoElettronicamente), MetadataTypeEnum.BOOLEAN),
      new Metadata('Verifica.MarcaturaTemporale', String(parsedDocument.documentMetadata.Document.DocumentoInformatico.Verifica.MarcaturaTemporale), MetadataTypeEnum.BOOLEAN),
      new Metadata('Verifica.ConformitaCopieImmagineSuSupportoInformatico', String(parsedDocument.documentMetadata.Document.DocumentoInformatico.Verifica.ConformitaCopieImmagineSuSupportoInformatico), MetadataTypeEnum.BOOLEAN),
      new Metadata('NomeDelDocumento', parsedDocument.documentMetadata.Document.DocumentoInformatico.NomeDelDocumento, MetadataTypeEnum.STRING),
      new Metadata('VersioneDelDocumento', parsedDocument.documentMetadata.Document.DocumentoInformatico.VersioneDelDocumento, MetadataTypeEnum.STRING),
    ];

    metadata.push(...[
      ...(parsedDocument.documentMetadata.Document.DocumentoInformatico.IdDoc.ImprontaCrittograficaDelDocumento.Algoritmo
        ? [new Metadata('IdDoc.ImprontaCrittograficaDelDocumento.Algoritmo', parsedDocument.documentMetadata.Document.DocumentoInformatico.IdDoc.ImprontaCrittograficaDelDocumento.Algoritmo, MetadataTypeEnum.STRING)] : []),
      ...(parsedDocument.documentMetadata.Document.DocumentoInformatico.Classificazione?.IndiceDiClassificazione
        ? [new Metadata('Classificazione.IndiceDiClassificazione', parsedDocument.documentMetadata.Document.DocumentoInformatico.Classificazione.IndiceDiClassificazione, MetadataTypeEnum.STRING)] : []),
      ...(parsedDocument.documentMetadata.Document.DocumentoInformatico.Classificazione?.Descrizione
        ? [new Metadata('Classificazione.Descrizione', parsedDocument.documentMetadata.Document.DocumentoInformatico.Classificazione.Descrizione, MetadataTypeEnum.STRING)] : []),
      ...(parsedDocument.documentMetadata.Document.DocumentoInformatico.Classificazione?.PianoDiClassificazione
        ? [new Metadata('Classificazione.PianoDiClassificazione', parsedDocument.documentMetadata.Document.DocumentoInformatico.Classificazione?.PianoDiClassificazione, MetadataTypeEnum.STRING)] : []),
      ...(parsedDocument.documentMetadata.Document.DocumentoInformatico.IdentificativoDelFormato.ProdottoSoftware?.NomeProdotto
        ? [new Metadata('IdentificativoDelFormato.ProdottoSoftware.NomeProdotto', parsedDocument.documentMetadata.Document.DocumentoInformatico.IdentificativoDelFormato.ProdottoSoftware?.NomeProdotto, MetadataTypeEnum.STRING)] : []),
      ...(parsedDocument.documentMetadata.Document.DocumentoInformatico.IdentificativoDelFormato.ProdottoSoftware?.VersioneProdotto
        ? [new Metadata('IdentificativoDelFormato.ProdottoSoftware.VersioneProdotto', parsedDocument.documentMetadata.Document.DocumentoInformatico.IdentificativoDelFormato.ProdottoSoftware?.VersioneProdotto, MetadataTypeEnum.STRING)] : []),
      ...(parsedDocument.documentMetadata.Document.DocumentoInformatico.IdentificativoDelFormato.ProdottoSoftware?.Produttore
        ? [new Metadata('IdentificativoDelFormato.ProdottoSoftware.Produttore', parsedDocument.documentMetadata.Document.DocumentoInformatico.IdentificativoDelFormato.ProdottoSoftware?.Produttore, MetadataTypeEnum.STRING)] : []),
      ...(parsedDocument.documentMetadata.Document.DocumentoInformatico.IdIdentificativoDocumentoPrimario?.Identificativo
        ? [new Metadata('IdIdentificativoDocumentoPrimario.Identificativo', parsedDocument.documentMetadata.Document.DocumentoInformatico.IdIdentificativoDocumentoPrimario?.Identificativo, MetadataTypeEnum.STRING)] : []),
      ...(parsedDocument.documentMetadata.Document.DocumentoInformatico.IdIdentificativoDocumentoPrimario?.ImprontaCrittograficaDelDocumento.Impronta
        ? [new Metadata('IdIdentificativoDocumentoPrimario.ImprontaCrittograficaDelDocumento.Impronta', parsedDocument.documentMetadata.Document.DocumentoInformatico.IdIdentificativoDocumentoPrimario?.ImprontaCrittograficaDelDocumento.Impronta, MetadataTypeEnum.BASE64)] : []),
      ...(parsedDocument.documentMetadata.Document.DocumentoInformatico.IdIdentificativoDocumentoPrimario?.ImprontaCrittograficaDelDocumento.Algoritmo
        ? [new Metadata('IdIdentificativoDocumentoPrimario.ImprontaCrittograficaDelDocumento.Algoritmo', parsedDocument.documentMetadata.Document.DocumentoInformatico.IdIdentificativoDocumentoPrimario?.ImprontaCrittograficaDelDocumento.Algoritmo, MetadataTypeEnum.STRING)] : []),
      ...(parsedDocument.documentMetadata.Document.DocumentoInformatico.TempoDiConservazione
        ? [new Metadata('TempoDiConservazione', String(parsedDocument.documentMetadata.Document.DocumentoInformatico?.TempoDiConservazione), MetadataTypeEnum.NUMBER)] : []),
      ...(parsedDocument.documentMetadata.Document.DocumentoInformatico.Note
        ? [new Metadata('Note', parsedDocument.documentMetadata.Document.DocumentoInformatico.Note, MetadataTypeEnum.STRING)] : [])
    ]);

    const tipoRegistro = parsedDocument.documentMetadata.Document.DocumentoInformatico.DatiDiRegistrazione.TipoRegistro;

    if (tipoRegistro.Nessuno) {
      const r = tipoRegistro.Nessuno;
      metadata.push(...[
        new Metadata('DatiDiRegistrazione.TipoRegistro', r.TipoRegistro, MetadataTypeEnum.STRING),
        new Metadata('DatiDiRegistrazione.TipoRegistro.Nessuno.DataDocumento', r.DataDocumento, MetadataTypeEnum.DATE),
        ...(r.OraDocumento
          ? [new Metadata('DatiDiRegistrazione.TipoRegistro.Nessuno.OraDocumento', r.OraDocumento, MetadataTypeEnum.TIME)]
          : []),
        new Metadata('DatiDiRegistrazione.TipoRegistro.Nessuno.NumeroDocumento', r.NumeroDocumento, MetadataTypeEnum.STRING),
      ]);
    } else if (tipoRegistro.ProtocolloOrdinario_ProtocolloEmergenza) {
      const r = tipoRegistro.ProtocolloOrdinario_ProtocolloEmergenza;
      metadata.push(...[
        new Metadata('DatiDiRegistrazione.TipoRegistro', r.TipoRegistro, MetadataTypeEnum.STRING),
        new Metadata('DatiDiRegistrazione.TipoRegistro.ProtocolloOrdinario_ProtocolloEmergenza.DataProtocollazioneDocumento', r.DataProtocollazioneDocumento, MetadataTypeEnum.DATE),
        ...(r.OraProtocollazioneDocumento
          ? [new Metadata('DatiDiRegistrazione.TipoRegistro.ProtocolloOrdinario_ProtocolloEmergenza.OraProtocollazioneDocumento', r.OraProtocollazioneDocumento, MetadataTypeEnum.TIME)]
          : []),
        new Metadata('DatiDiRegistrazione.TipoRegistro.ProtocolloOrdinario_ProtocolloEmergenza.NumeroProtocolloDocumento', r.NumeroProtocolloDocumento, MetadataTypeEnum.STRING),
        new Metadata('DatiDiRegistrazione.TipoRegistro.ProtocolloOrdinario_ProtocolloEmergenza.CodiceRegistro', r.CodiceRegistro, MetadataTypeEnum.STRING),
      ]);
    } else {
      const r = tipoRegistro.Repertorio_Registro!;
      metadata.push(...[
        new Metadata('DatiDiRegistrazione.TipoRegistro', r.TipoRegistro, MetadataTypeEnum.STRING),
        new Metadata('DatiDiRegistrazione.TipoRegistro.Repertorio_Registro.DataRegistrazioneDocumento', r.DataRegistrazioneDocumento, MetadataTypeEnum.DATE),
        ...(r.OraRegistrazioneDocumento
          ? [new Metadata('DatiDiRegistrazione.TipoRegistro.Repertorio_Registro.OraRegistrazioneDocumento', r.OraRegistrazioneDocumento, MetadataTypeEnum.TIME)]
          : []),
        new Metadata('DatiDiRegistrazione.TipoRegistro.Repertorio_Registro.NumeroRegistrazioneDocumento', r.NumeroRegistrazioneDocumento, MetadataTypeEnum.STRING),
        new Metadata('DatiDiRegistrazione.TipoRegistro.Repertorio_Registro.CodiceRegistro', r.CodiceRegistro, MetadataTypeEnum.STRING),
      ]);
    }

    metadata.push(...(parsedDocument.documentMetadata.Document.DocumentoInformatico.ChiaveDescrittiva.ParoleChiave ?? [])
      .map((pc, i) => new Metadata(`ChiaveDescrittiva.ParoleChiave.${i}`, pc, MetadataTypeEnum.STRING)));

    metadata.push(...(parsedDocument.documentMetadata.Document.DocumentoInformatico.Allegati.IndiceAllegati ?? [])
      .flatMap((all, i) => [
        new Metadata(`Allegati.IndiceAllegati.Descrizione.${i}`, all.Descrizione, MetadataTypeEnum.STRING),
        new Metadata(`Allegati.IndiceAllegati.IdDoc.Identificativo.${i}`, all.IdDoc.Identificativo, MetadataTypeEnum.STRING),
        new Metadata(`Allegati.IndiceAllegati.IdDoc.ImprontaCrittograficaDelDocumento.Impronta.${i}`, all.IdDoc.ImprontaCrittograficaDelDocumento.Impronta, MetadataTypeEnum.BASE64),
        new Metadata(`Allegati.IndiceAllegati.IdDoc.ImprontaCrittograficaDelDocumento.Algoritmo.${i}`, all.IdDoc.ImprontaCrittograficaDelDocumento.Algoritmo ?? '', MetadataTypeEnum.STRING)
      ]));

    metadata.push(...(parsedDocument.documentMetadata.Document.DocumentoInformatico.Agg.TipoAgg ?? [])
      .flatMap((agg, i) => [
        new Metadata(`Agg.TipoAggregazione.${i}`, agg.TipoAggregazione, MetadataTypeEnum.STRING),
        new Metadata(`Agg.IdAggregazione.${i}`, agg.IdAggregazione, MetadataTypeEnum.STRING)
      ]));

    metadata.push(...(parsedDocument.documentMetadata.Document.DocumentoInformatico.TracciatureModificheDocumento ?? [])
      .flatMap((mod, i) => [
        new Metadata(`TracciatureModificheDocumento.TipoModifica.${i}`, mod.TipoModifica, MetadataTypeEnum.STRING),
        new Metadata(`TracciatureModificheDocumento.DataModifica.${i}`, mod.DataModifica, MetadataTypeEnum.DATE),
        new Metadata(`TracciatureModificheDocumento.OraModifica.${i}`, mod.OraModifica ?? '', MetadataTypeEnum.TIME),
        new Metadata(`TracciatureModificheDocumento.IdDocVersionePrecedente.Identificativo.${i}`, mod.IdDocVersionePrecedente.Identificativo, MetadataTypeEnum.STRING),
        new Metadata(`TracciatureModificheDocumento.IdDocVersionePrecedente.ImprontaCrittograficaDelDocumento.Impronta.${i}`, mod.IdDocVersionePrecedente.ImprontaCrittograficaDelDocumento.Impronta, MetadataTypeEnum.BASE64),
        new Metadata(`TracciatureModificheDocumento.IdDocVersionePrecedente.ImprontaCrittograficaDelDocumento.Algoritmo.${i}`, mod.IdDocVersionePrecedente.ImprontaCrittograficaDelDocumento.Algoritmo ?? '', MetadataTypeEnum.STRING),
      ]));

    const entries = this.mapRuoli(parsedDocument.documentMetadata.Document.DocumentoInformatico.Soggetti.Ruolo);

    const subjects = new Map<Subject, RolesTypeEnum>(
      entries.map(e => [e.subject, e.roleType] as [Subject, RolesTypeEnum])
    );
    const conservationProcessUuid = parsedDocument.documentMetadata.Document.ArchimemoData.DocumentInformation.PreservationProcessUUID;

    return new Document(
      uuid,
      documentPath,
      main,
      attachments,
      metadata,
      subjects,
      conservationProcessUuid
    );
  }
}