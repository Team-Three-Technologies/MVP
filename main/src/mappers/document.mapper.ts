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

export class DocumentMapper {
  toDomain(parsedDocument: DocumentParsingResult): Document {
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
        ? [new Metadata('TempoDiConservazione', parsedDocument.documentMetadata.Document.DocumentoInformatico.TempoDiConservazione?.toString(), MetadataTypeEnum.NUMBER)] : []),
      ...(parsedDocument.documentMetadata.Document.DocumentoInformatico.Note
        ? [new Metadata('Note', parsedDocument.documentMetadata.Document.DocumentoInformatico.Note, MetadataTypeEnum.STRING)] : [])
    ]);

    const tipoRegistro = parsedDocument.documentMetadata.Document.DocumentoInformatico.DatiDiRegistrazione.TipoRegistro;

    if (tipoRegistro.Nessuno) {
      const r = tipoRegistro.Nessuno;
      metadata.push(...[
        new Metadata('DatiDiRegistrazione.TipoRegistro', r.TipoRegistro, MetadataTypeEnum.STRING),
        new Metadata('DatiDiRegistrazione.TipoRegistro.Nessuno.DataDocumento', r.DataDocumento, MetadataTypeEnum.STRING),
        ...(r.OraDocumento
          ? [new Metadata('DatiDiRegistrazione.TipoRegistro.Nessuno.OraDocumento', r.OraDocumento, MetadataTypeEnum.STRING)]
          : []),
        new Metadata('DatiDiRegistrazione.TipoRegistro.Nessuno.NumeroDocumento', r.NumeroDocumento, MetadataTypeEnum.STRING),
      ]);
    } else if (tipoRegistro.ProtocolloOrdinario_ProtocolloEmergenza) {
      const r = tipoRegistro.ProtocolloOrdinario_ProtocolloEmergenza;
      metadata.push(...[
        new Metadata('DatiDiRegistrazione.TipoRegistro', r.TipoRegistro, MetadataTypeEnum.STRING),
        new Metadata('DatiDiRegistrazione.TipoRegistro.ProtocolloOrdinario_ProtocolloEmergenza.DataProtocollazioneDocumento', r.DataProtocollazioneDocumento, MetadataTypeEnum.STRING),
        ...(r.OraProtocollazioneDocumento
          ? [new Metadata('DatiDiRegistrazione.TipoRegistro.ProtocolloOrdinario_ProtocolloEmergenza.OraProtocollazioneDocumento', r.OraProtocollazioneDocumento, MetadataTypeEnum.STRING)]
          : []),
        new Metadata('DatiDiRegistrazione.TipoRegistro.ProtocolloOrdinario_ProtocolloEmergenza.NumeroProtocolloDocumento', r.NumeroProtocolloDocumento, MetadataTypeEnum.STRING),
        new Metadata('DatiDiRegistrazione.TipoRegistro.ProtocolloOrdinario_ProtocolloEmergenza.CodiceRegistro', r.CodiceRegistro, MetadataTypeEnum.STRING),
      ]);
    } else {
      const r = tipoRegistro.Repertorio_Registro!;
      metadata.push(...[
        new Metadata('DatiDiRegistrazione.TipoRegistro', r.TipoRegistro, MetadataTypeEnum.STRING),
        new Metadata('DatiDiRegistrazione.TipoRegistro.Repertorio_Registro.DataRegistrazioneDocumento', r.DataRegistrazioneDocumento, MetadataTypeEnum.STRING),
        ...(r.OraRegistrazioneDocumento
          ? [new Metadata('DatiDiRegistrazione.TipoRegistro.Repertorio_Registro.OraRegistrazioneDocumento', r.OraRegistrazioneDocumento, MetadataTypeEnum.STRING)]
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
        new Metadata(`TracciatureModificheDocumento.DataModifica.${i}`, mod.DataModifica, MetadataTypeEnum.STRING),
        new Metadata(`TracciatureModificheDocumento.OraModifica.${i}`, mod.OraModifica ?? '', MetadataTypeEnum.STRING),
        new Metadata(`TracciatureModificheDocumento.IdDocVersionePrecedente.Identificativo.${i}`, mod.IdDocVersionePrecedente.Identificativo, MetadataTypeEnum.STRING),
        new Metadata(`TracciatureModificheDocumento.IdDocVersionePrecedente.ImprontaCrittograficaDelDocumento.Impronta.${i}`, mod.IdDocVersionePrecedente.ImprontaCrittograficaDelDocumento.Impronta, MetadataTypeEnum.BASE64),
        new Metadata(`TracciatureModificheDocumento.IdDocVersionePrecedente.ImprontaCrittograficaDelDocumento.Algoritmo.${i}`, mod.IdDocVersionePrecedente.ImprontaCrittograficaDelDocumento.Algoritmo ?? '', MetadataTypeEnum.STRING),
      ]));
      
    const entries = parsedDocument.documentMetadata.Document.DocumentoInformatico.Soggetti.Ruolo.map((role, index) => {
      if (role.Altro) {
        if (role.Altro.PF) {
          return { roleType: RolesTypeEnum.ALT, subject: new PFSubject(index, role.Altro.PF.Nome, role.Altro.PF.Cognome, role.Altro.PF.CodiceFiscale, role.Altro.PF.IndirizziDigitaliDiRiferimento ?? []) };
        } else if (role.Altro.PG) {
          return { roleType: RolesTypeEnum.ALT, subject: new PGSubject(index, role.Altro.PG.DenominazioneOrganizzazione, role.Altro.PG.CodiceFiscale_PartitaIva, role.Altro.PG.DenominazioneUfficio, role.Altro.PG.IndirizziDigitaliDiRiferimento ?? []) };
        } else if (role.Altro.PAI) {
          return { roleType: RolesTypeEnum.ALT, subject: new PAISubject(index, role.Altro.PAI.IPAAmm.Denominazione, role.Altro.PAI.IPAAmm.CodiceIPA, role.Altro.PAI.IPAAOO?.Denominazione, role.Altro.PAI.IPAAOO?.CodiceIPA, role.Altro.PAI.IPAUOR?.Denominazione, role.Altro.PAI.IPAUOR?.CodiceIPA, role.Altro.PAI.IndirizziDigitaliDiRiferimento ?? []) };
        } else if (role.Altro.PAE) {
          return { roleType: RolesTypeEnum.ALT, subject: new PAESubject(index, role.Altro.PAE.DenominazioneAmministrazione, role.Altro.PAE.DenominazioneUfficio, role.Altro.PAE.IndirizziDigitaliDiRiferimento ?? []) };
        }
      } else if (role.Assegnatario) {
        return { roleType: RolesTypeEnum.ASS, subject: new ASSubject(index, role.Assegnatario.AS.Nome, role.Assegnatario.AS.Cognome, role.Assegnatario.AS.CodiceFiscale, role.Assegnatario.AS.DenominazioneOrganizzazione, role.Assegnatario.AS.DenominazioneUfficio, role.Assegnatario.AS.IndirizziDigitaliDiRiferimento ?? []) };
      } else if (role.Autore) {
        if (role.Autore.PF) {
          return { roleType: RolesTypeEnum.AUT, subject: new PFSubject(index, role.Autore.PF.Nome, role.Autore.PF.Cognome, role.Autore.PF.CodiceFiscale, role.Autore.PF.IndirizziDigitaliDiRiferimento ?? []) };
        } else if (role.Autore.PG) {
          return { roleType: RolesTypeEnum.AUT, subject: new PGSubject(index, role.Autore.PG.DenominazioneOrganizzazione, role.Autore.PG.CodiceFiscale_PartitaIva, role.Autore.PG.DenominazioneUfficio, role.Autore.PG.IndirizziDigitaliDiRiferimento ?? []) };
        } else if (role.Autore.PAI) {
          return { roleType: RolesTypeEnum.AUT, subject: new PAISubject(index, role.Autore.PAI.IPAAmm.Denominazione, role.Autore.PAI.IPAAmm.CodiceIPA, role.Autore.PAI.IPAAOO?.Denominazione, role.Autore.PAI.IPAAOO?.CodiceIPA, role.Autore.PAI.IPAUOR?.Denominazione, role.Autore.PAI.IPAUOR?.CodiceIPA, role.Autore.PAI.IndirizziDigitaliDiRiferimento ?? []) };
        } else if (role.Autore.PAE) {
          return { roleType: RolesTypeEnum.AUT, subject: new PAESubject(index, role.Autore.PAE.DenominazioneAmministrazione, role.Autore.PAE.DenominazioneUfficio, role.Autore.PAE.IndirizziDigitaliDiRiferimento ?? []) };
        }
      } else if (role.Destinatario) {
        if (role.Destinatario.PF) {
          return { roleType: RolesTypeEnum.DES, subject: new PFSubject(index, role.Destinatario.PF.Nome, role.Destinatario.PF.Cognome, role.Destinatario.PF.CodiceFiscale, role.Destinatario.PF.IndirizziDigitaliDiRiferimento ?? []) };
        } else if (role.Destinatario.PG) {
          return { roleType: RolesTypeEnum.DES, subject: new PGSubject(index, role.Destinatario.PG.DenominazioneOrganizzazione, role.Destinatario.PG.CodiceFiscale_PartitaIva, role.Destinatario.PG.DenominazioneUfficio, role.Destinatario.PG.IndirizziDigitaliDiRiferimento ?? []) };
        } else if (role.Destinatario.PAI) {
          return { roleType: RolesTypeEnum.DES, subject: new PAISubject(index, role.Destinatario.PAI.IPAAmm.Denominazione, role.Destinatario.PAI.IPAAmm.CodiceIPA, role.Destinatario.PAI.IPAAOO?.Denominazione, role.Destinatario.PAI.IPAAOO?.CodiceIPA, role.Destinatario.PAI.IPAUOR?.Denominazione, role.Destinatario.PAI.IPAUOR?.CodiceIPA, role.Destinatario.PAI.IndirizziDigitaliDiRiferimento ?? []) };
        } else if (role.Destinatario.PAE) {
          return { roleType: RolesTypeEnum.DES, subject: new PAESubject(index, role.Destinatario.PAE.DenominazioneAmministrazione, role.Destinatario.PAE.DenominazioneUfficio, role.Destinatario.PAE.IndirizziDigitaliDiRiferimento ?? []) };
        }
      } else if (role.Mittente) {
        if (role.Mittente.PF) {
          return { roleType: RolesTypeEnum.MIT, subject: new PFSubject(index, role.Mittente.PF.Nome, role.Mittente.PF.Cognome, role.Mittente.PF.CodiceFiscale, role.Mittente.PF.IndirizziDigitaliDiRiferimento ?? []) };
        } else if (role.Mittente.PG) {
          return { roleType: RolesTypeEnum.MIT, subject: new PGSubject(index, role.Mittente.PG.DenominazioneOrganizzazione, role.Mittente.PG.CodiceFiscale_PartitaIva, role.Mittente.PG.DenominazioneUfficio, role.Mittente.PG.IndirizziDigitaliDiRiferimento ?? []) };
        } else if (role.Mittente.PAI) {
          return { roleType: RolesTypeEnum.MIT, subject: new PAISubject(index, role.Mittente.PAI.IPAAmm.Denominazione, role.Mittente.PAI.IPAAmm.CodiceIPA, role.Mittente.PAI.IPAAOO?.Denominazione, role.Mittente.PAI.IPAAOO?.CodiceIPA, role.Mittente.PAI.IPAUOR?.Denominazione, role.Mittente.PAI.IPAUOR?.CodiceIPA, role.Mittente.PAI.IndirizziDigitaliDiRiferimento ?? []) };
        } else if (role.Mittente.PAE) {
          return { roleType: RolesTypeEnum.MIT, subject: new PAESubject(index, role.Mittente.PAE.DenominazioneAmministrazione, role.Mittente.PAE.DenominazioneUfficio, role.Mittente.PAE.IndirizziDigitaliDiRiferimento ?? []) };
        }
      } else if (role.Operatore) {
        return { roleType: RolesTypeEnum.OPE, subject: new PFSubject(index, role.Operatore.PF.Nome, role.Operatore.PF.Cognome, role.Operatore.PF.CodiceFiscale, role.Operatore.PF.IndirizziDigitaliDiRiferimento ?? []) };
      } else if (role.Produttore) {
        return { roleType: RolesTypeEnum.PRO, subject: new SWSubject(index, role.Produttore.SW.DenominazioneSistema) };
      } else if (role.ResponsabileGestioneDocumentale) {
        return { roleType: RolesTypeEnum.RGD, subject: new PFSubject(index, role.ResponsabileGestioneDocumentale.PF.Nome, role.ResponsabileGestioneDocumentale.PF.Cognome, role.ResponsabileGestioneDocumentale.PF.CodiceFiscale, role.ResponsabileGestioneDocumentale.PF.IndirizziDigitaliDiRiferimento ?? []) };
      } else if (role.ResponsabileServizioProtocollo) {
        return { roleType: RolesTypeEnum.RSP, subject: new PFSubject(index, role.ResponsabileServizioProtocollo.PF.Nome, role.ResponsabileServizioProtocollo.PF.Cognome, role.ResponsabileServizioProtocollo.PF.CodiceFiscale, role.ResponsabileServizioProtocollo.PF.IndirizziDigitaliDiRiferimento ?? []) };
      } else if (role.SoggettoCheEffettuaLaRegistrazione) {
        if (role.SoggettoCheEffettuaLaRegistrazione.PF) {
          return { roleType: RolesTypeEnum.SER, subject: new PFSubject(index, role.SoggettoCheEffettuaLaRegistrazione.PF.Nome, role.SoggettoCheEffettuaLaRegistrazione.PF.Cognome, role.SoggettoCheEffettuaLaRegistrazione.PF.CodiceFiscale, role.SoggettoCheEffettuaLaRegistrazione.PF.IndirizziDigitaliDiRiferimento ?? []) };
        } else if (role.SoggettoCheEffettuaLaRegistrazione.PG) {
          return { roleType: RolesTypeEnum.SER, subject: new PGSubject(index, role.SoggettoCheEffettuaLaRegistrazione.PG.DenominazioneOrganizzazione, role.SoggettoCheEffettuaLaRegistrazione.PG.CodiceFiscale_PartitaIva, role.SoggettoCheEffettuaLaRegistrazione.PG.DenominazioneUfficio, role.SoggettoCheEffettuaLaRegistrazione.PG.IndirizziDigitaliDiRiferimento ?? []) };
        }
      }
    })
    .filter(e => e !== undefined);

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