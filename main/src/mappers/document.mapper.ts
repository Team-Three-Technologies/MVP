import { Document } from '../domain/document.model';
import { File } from '../domain/file.model';
import { Metadata } from '../domain/metadata.model';
import { Subject } from '../domain/subject.model';
import { RolesTypeEnum } from '../domain/roles-type.enum';
import { DocumentParsingResult } from '../infrastructure/parsing/dip-parsing-result';
import { MetadataTypeEnum } from '../domain/metadata-type.enum';

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
      // IdDoc
      new Metadata('Identificativo', parsedDocument.documentMetadata.Document.DocumentoInformatico.IdDoc.Identificativo, MetadataTypeEnum.STRING), // lo stesso uuid, inutile in teoria 
      // Impronta crittografica del documento
      new Metadata('Impronta', parsedDocument.documentMetadata.Document.DocumentoInformatico.IdDoc.ImprontaCrittograficaDelDocumento.Impronta, MetadataTypeEnum.BASE64),
      new Metadata('Algoritmo', parsedDocument.documentMetadata.Document.DocumentoInformatico.IdDoc.ImprontaCrittograficaDelDocumento.Algoritmo ?? 'SHA-256', MetadataTypeEnum.STRING),

      new Metadata('Modalità di formazione', parsedDocument.documentMetadata.Document.DocumentoInformatico.ModalitaDiFormazione, MetadataTypeEnum.STRING),

      new Metadata('Tipologia documentale', parsedDocument.documentMetadata.Document.DocumentoInformatico.TipologiaDocumentale, MetadataTypeEnum.STRING),

      // Dati di registrazione
      new Metadata('Tipologia di flusso', parsedDocument.documentMetadata.Document.DocumentoInformatico.DatiDiRegistrazione.TipologiaDiFlusso, MetadataTypeEnum.STRING),
      // TODO: Tipo registro

      // Chiave descrittiva
      new Metadata('Oggetto', parsedDocument.documentMetadata.Document.DocumentoInformatico.ChiaveDescrittiva.Oggetto, MetadataTypeEnum.STRING),
      // Parole chiave fatte dopo

      // Allegati
      new Metadata('Numero allegati', String(parsedDocument.documentMetadata.Document.DocumentoInformatico.Allegati.NumeroAllegati), MetadataTypeEnum.NUMBER),
      // TODO: Indice allegati

      // Classificazione
      new Metadata('Indice di classificazione', parsedDocument.documentMetadata.Document.DocumentoInformatico.Classificazione?.IndiceDiClassificazione ?? '', MetadataTypeEnum.STRING),
      new Metadata('Descrizione', parsedDocument.documentMetadata.Document.DocumentoInformatico.Classificazione?.Descrizione ?? '', MetadataTypeEnum.STRING),
      new Metadata('Piano di classificazione', parsedDocument.documentMetadata.Document.DocumentoInformatico.Classificazione?.PianoDiClassificazione ?? '', MetadataTypeEnum.STRING),

      new Metadata('Riservato', String(parsedDocument.documentMetadata.Document.DocumentoInformatico.Riservato), MetadataTypeEnum.BOOLEAN),

      // Identificativo del formato
      new Metadata('Formato', parsedDocument.documentMetadata.Document.DocumentoInformatico.IdentificativoDelFormato.Formato, MetadataTypeEnum.STRING),
      
      // Prodotto software
      new Metadata('Nome prodotto', parsedDocument.documentMetadata.Document.DocumentoInformatico.IdentificativoDelFormato.ProdottoSoftware?.NomeProdotto ?? '', MetadataTypeEnum.STRING),
      new Metadata('Versione prodotto', parsedDocument.documentMetadata.Document.DocumentoInformatico.IdentificativoDelFormato.ProdottoSoftware?.VersioneProdotto ?? '', MetadataTypeEnum.STRING),
      new Metadata('Produttore', parsedDocument.documentMetadata.Document.DocumentoInformatico.IdentificativoDelFormato.ProdottoSoftware?.Produttore ?? '', MetadataTypeEnum.STRING),

      // Verifica
      new Metadata('Firmato digitalmente', String(parsedDocument.documentMetadata.Document.DocumentoInformatico.Verifica.FirmatoDigitalmente), MetadataTypeEnum.BOOLEAN),
      new Metadata('Sigillato elettronicamente', String(parsedDocument.documentMetadata.Document.DocumentoInformatico.Verifica.SigillatoElettronicamente), MetadataTypeEnum.BOOLEAN),
      new Metadata('Marcatura temporale', String(parsedDocument.documentMetadata.Document.DocumentoInformatico.Verifica.MarcaturaTemporale), MetadataTypeEnum.BOOLEAN),
      new Metadata('Conformita copie immagine su supporto informatico', String(parsedDocument.documentMetadata.Document.DocumentoInformatico.Verifica.ConformitaCopieImmagineSuSupportoInformatico), MetadataTypeEnum.BOOLEAN),

      // Agg fatte dopo

      // IdDoc (primario)
      new Metadata('Identificativo documento primario', parsedDocument.documentMetadata.Document.DocumentoInformatico.IdIdentificativoDocumentoPrimario?.Identificativo ?? '', MetadataTypeEnum.STRING),
      // Impronta crittografica del documento (primario)
      new Metadata('Impronta documento primario', parsedDocument.documentMetadata.Document.DocumentoInformatico.IdIdentificativoDocumentoPrimario?.ImprontaCrittograficaDelDocumento.Impronta ?? '', MetadataTypeEnum.BASE64),
      new Metadata('Algoritmo documento primario', parsedDocument.documentMetadata.Document.DocumentoInformatico.IdIdentificativoDocumentoPrimario?.ImprontaCrittograficaDelDocumento.Algoritmo ?? 'SHA-256', MetadataTypeEnum.STRING),

      new Metadata('Nome del documento', parsedDocument.documentMetadata.Document.DocumentoInformatico.NomeDelDocumento, MetadataTypeEnum.STRING),

      new Metadata('Versione del documento', parsedDocument.documentMetadata.Document.DocumentoInformatico.VersioneDelDocumento, MetadataTypeEnum.STRING),

      // TODO: Tracciatura modifiche (capire se è un array)
      
      // Tempo di conservazione
      new Metadata('Tempo di conservazione', parsedDocument.documentMetadata.Document.DocumentoInformatico.TempoDiConservazione?.toString() ?? '', MetadataTypeEnum.NUMBER),

      new Metadata('Note', parsedDocument.documentMetadata.Document.DocumentoInformatico.Note ?? '', MetadataTypeEnum.STRING)
    ];

    metadata.push(...(parsedDocument.documentMetadata.Document.DocumentoInformatico.ChiaveDescrittiva.ParoleChiave ?? [])
      .map((pc, i) => new Metadata(`Parola chiave ${i}`, pc, MetadataTypeEnum.STRING)));

    metadata.push(...(parsedDocument.documentMetadata.Document.DocumentoInformatico.Agg.TipoAgg ?? [])
      .flatMap((agg, i) => [
        new Metadata(`Tipo aggregazione ${i}`, agg.TipoAggregazione, MetadataTypeEnum.STRING),
        new Metadata(`Id aggregazione ${i}`, agg.IdAggregazione, MetadataTypeEnum.STRING)
      ]));
    // const entries: [Subject, RolesTypeEnum][] = parsedDocument.documentMetadata.Document.DocumentoInformatico.Soggetti.Ruolo.map(role => {
    // });

    parsedDocument.documentMetadata.Document.DocumentoInformatico.Soggetti.Ruolo.map(role => {

    });

    const subjects = new Map<Subject, RolesTypeEnum>();
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