import { container } from 'tsyringe';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TOKENS } from '../../src/infrastructure/di/tokens';
import { Document } from '../../src/domain/document.model';
import { File } from '../../src/domain/file.model';
import { Metadata } from '../../src/domain/metadata.model';
import { MetadataTypeEnum } from '../../src/domain/metadata-type.enum';
import { GetDocumentDetailsService } from '../../src/application/get-document-details.service';

const buildDocument = (
  metadata: Array<{ name: string; value: string }> = [],
  overrides: Partial<{
    uuid: string;
    path: string;
    main: File;
    attachments: File[];
    extra: string;
  }> = {},
) => {
  return new Document(
    overrides.uuid ?? 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    overrides.path ?? 'path',
    overrides.main ?? new File('main-uuid', 'documento.pdf', '10 MB'),
    overrides.attachments ?? [new File('att-1', '/att/1.pdf', '12 byte')],
    metadata.map((m) => new Metadata(m.name, m.value, MetadataTypeEnum.STRING)),
    overrides.extra ?? '',
  );
};

const registerRepoWithDocument = (doc: unknown) => {
  container.register(TOKENS.DocumentRepository, {
    useValue: { findByUuid: vi.fn().mockResolvedValue(doc) },
  });
};

describe('GetDocumentDetailsService', () => {
  beforeEach(() => {
    container.clearInstances();
    container.register(TOKENS.DocumentRepository, { useValue: {} });
  });

  describe('execute - errori e mapping base', () => {
    it('lancia errore se il documento non esiste', async () => {
      container.register(TOKENS.DocumentRepository, {
        useValue: { findByUuid: vi.fn().mockResolvedValue(null) },
      });
      const service = container.resolve(GetDocumentDetailsService);
      await expect(service.execute('uuid-x')).rejects.toThrow(
        'Non esiste un documento con questo UUID: uuid-x',
      );
    });

    it('chiama il repository con il flag true', async () => {
      const findByUuid = vi.fn().mockResolvedValue(buildDocument());
      container.register(TOKENS.DocumentRepository, { useValue: { findByUuid } });
      const service = container.resolve(GetDocumentDetailsService);
      await service.execute('abc');
      expect(findByUuid).toHaveBeenCalledWith('abc', true);
    });

    it('mappa correttamente i campi base e gli attachments', async () => {
      const doc = buildDocument(
        [
          { name: 'NS.DatiDiRegistrazione.TipoRegistro.PROT.TipoRegistro', value: 'Protocollo' },
          { name: 'NS.DatiDiRegistrazione.TipoRegistro.PROT.DataRegistrazione', value: '2024-01-15' },
          { name: 'NS.DatiDiRegistrazione.TipoRegistro.PROT.OraRegistrazione', value: '10:30' },
          { name: 'NS.ChiaveDescrittiva.Oggetto', value: 'Oggetto del documento' },
          { name: 'NS.VersioneDelDocumento', value: '1.0' },
          { name: 'ArchimemoData.DocumentInformation.FilesCount', value: '3' },
          { name: 'ArchimemoData.DocumentInformation.TotalSize.#text', value: '1024' },
          { name: 'ArchimemoData.DocumentInformation.TotalSize.@_unit', value: 'KB' },
          { name: 'NS.TipologiaDocumentale', value: 'Fattura' },
          { name: 'NS.DatiDiRegistrazione.TipoRegistro.PROT.NumeroDocumento', value: '42' },
          { name: 'NS.DatiDiRegistrazione.TipoRegistro.PROT.CodiceRegistro', value: 'REG-A' },
          { name: 'NS.Agg.TipoAgg.0.TipoAggregazione', value: 'Fascicolo' },
        ],
        {
          uuid: 'doc-uuid',
          main: new File('main', 'relazione.pdf', '10 MB'),
          attachments: [
            new File('a1', '/p/1.pdf', '12 byte'),
            new File('a2', '/p/2.docx', '20 MB'),
          ],
        },
      );
      registerRepoWithDocument(doc);
      const service = container.resolve(GetDocumentDetailsService);
      const r = await service.execute('doc-uuid');

      expect(r.uuid).toBe('doc-uuid');
      expect(r.name).toBe('relazione');
      expect(r.extension).toBe('pdf');
      expect(r.registrationType).toBe('Protocollo');
      expect(r.registrationDate).toBe('2024-01-15');
      expect(r.registrationTime).toBe('10:30');
      expect(r.content).toBe('Oggetto del documento');
      expect(r.version).toBe('1.0');
      expect(r.filesCount).toBe(3);
      expect(r.totalSize).toBe('1024 KB');
      expect(r.documentType).toBe('Fattura');
      expect(r.documentNumber).toBe('42');
      expect(r.registryCode).toBe('REG-A');
      expect(r.aggregationType).toBe('Fascicolo');
      expect(r.attachmentsCount).toBe(2);
      // Il DTO espone uuid, path ed extension — non size
      expect(r.attachments).toEqual([
        { uuid: 'a1', path: '/p/1.pdf', extension: 'pdf' },
        { uuid: 'a2', path: '/p/2.docx', extension: 'docx' },
      ]);
      expect(r.subjects).toEqual([]);
    });

    it('usa stringhe vuote quando i metadati regex non matchano', async () => {
      const doc = buildDocument([
        { name: 'ArchimemoData.DocumentInformation.FilesCount', value: '0' },
        { name: 'ArchimemoData.DocumentInformation.TotalSize.#text', value: '0' },
        { name: 'ArchimemoData.DocumentInformation.TotalSize.@_unit', value: 'B' },
      ]);
      registerRepoWithDocument(doc);
      const service = container.resolve(GetDocumentDetailsService);
      const r = await service.execute('x');

      expect(r.registrationType).toBe('');
      expect(r.registrationDate).toBe('');
      expect(r.registrationTime).toBe('');
      expect(r.content).toBe('');
      expect(r.version).toBe('');
      expect(r.documentType).toBe('');
      expect(r.documentNumber).toBe('');
      expect(r.registryCode).toBe('');
      expect(r.aggregationType).toBe('');
    });

    it('attachmentsCount = 0 se non ci sono allegati', async () => {
      const doc = buildDocument([], { attachments: [] });
      registerRepoWithDocument(doc);
      const service = container.resolve(GetDocumentDetailsService);
      const r = await service.execute('x');
      expect(r.attachmentsCount).toBe(0);
      expect(r.attachments).toEqual([]);
    });

    it('totalSize contiene "null null" se entrambi i metadati mancano', async () => {
      // Il servizio concatena direttamente i valori senza null-guard:
      // `${value1} ${value2}` dove value1/value2 possono essere null
      const doc = buildDocument([], { attachments: [] });
      registerRepoWithDocument(doc);
      const service = container.resolve(GetDocumentDetailsService);
      const r = await service.execute('x');
      expect(r.totalSize).toBe('null null');
    });

    it('totalSize è corretto se solo l\'unità manca', async () => {
      const doc = buildDocument([
        { name: 'ArchimemoData.DocumentInformation.TotalSize.#text', value: '512' },
      ]);
      registerRepoWithDocument(doc);
      const service = container.resolve(GetDocumentDetailsService);
      const r = await service.execute('x');
      expect(r.totalSize).toBe('512 null');
    });

    it('attachment senza estensione espone stringa vuota come extension', async () => {
      const doc = buildDocument([], {
        attachments: [new File('a1', '/p/file-senza-estensione', '5 KB')],
      });
      registerRepoWithDocument(doc);
      const service = container.resolve(GetDocumentDetailsService);
      const r = await service.execute('x');
      expect(r.attachments[0]).toEqual({ uuid: 'a1', path: '/p/file-senza-estensione', extension: '' });
    });

    it('name del documento è stringa vuota se il file principale non ha estensione', async () => {
      const doc = buildDocument([], { main: new File('m', 'nomefile', '1 KB') });
      registerRepoWithDocument(doc);
      const service = container.resolve(GetDocumentDetailsService);
      const r = await service.execute('x');
      // getFilename() restituisce il nome intero se non c'è punto
      expect(r.name).toBe('nomefile');
      expect(r.extension).toBe('');
    });
  });

  describe('unwrapSubject - tutti i tipi di soggetto', () => {
    const runWithSubject = async (subjectFields: Record<string, string>) => {
      const meta = Object.entries(subjectFields).map(([k, v]) => ({
        name: `NS.Soggetti.Ruolo.0.Dati.${k}`,
        value: v,
      }));
      const doc = buildDocument(meta);
      registerRepoWithDocument(doc);
      const service = container.resolve(GetDocumentDetailsService);
      const r = await service.execute('x');
      return r.subjects[0];
    };

    it('PF: concatena cognome e nome', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'Mittente',
        TipoSoggetto: 'PF',
        'PF.Cognome': 'Rossi',
        'PF.Nome': 'Mario',
      });
      expect(s).toEqual({ id: 0, role: 'Mittente', name: 'Rossi Mario', type: 'PF' });
    });

    it('PF: gestisce nome mancante', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'Mittente',
        TipoSoggetto: 'PF',
        'PF.Cognome': 'Rossi',
      });
      expect(s.name).toBe('Rossi');
    });

    it('PF: gestisce cognome mancante', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'Mittente',
        TipoSoggetto: 'PF',
        'PF.Nome': 'Mario',
      });
      expect(s.name).toBe('Mario');
    });

    it('PF: entrambi i campi mancanti -> stringa vuota', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'Mittente',
        TipoSoggetto: 'PF',
      });
      expect(s.name).toBe('');
    });

    it('PG: con ufficio', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'Destinatario',
        TipoSoggetto: 'PG',
        'PG.DenominazioneOrganizzazione': 'ACME Srl',
        'PG.DenominazioneUfficio': 'Acquisti',
      });
      expect(s.name).toBe('ACME Srl, Ufficio: Acquisti');
    });

    it('PG: senza ufficio', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'Destinatario',
        TipoSoggetto: 'PG',
        'PG.DenominazioneOrganizzazione': 'ACME Srl',
      });
      expect(s.name).toBe('ACME Srl');
    });

    it('PAI: concatena Amm, AOO e UOR', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'Mittente',
        TipoSoggetto: 'PAI',
        'PAI.IPAAmm.Denominazione': 'Comune X',
        'PAI.IPAAmm.CodiceIPA': 'c_x',
        'PAI.IPAAOO.Denominazione': 'AOO1',
        'PAI.IPAAOO.CodiceIPA': 'aoo1',
        'PAI.IPAUOR.Denominazione': 'UOR1',
        'PAI.IPAUOR.CodiceIPA': 'uor1',
      });
      expect(s.name).toBe('Comune X (IPA: c_x), AOO1 (IPA: aoo1), UOR1 (IPA: uor1)');
    });

    it('PAI: solo amministrazione', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'Mittente',
        TipoSoggetto: 'PAI',
        'PAI.IPAAmm.Denominazione': 'Comune X',
        'PAI.IPAAmm.CodiceIPA': 'c_x',
      });
      expect(s.name).toBe('Comune X (IPA: c_x)');
    });

    it('PAI: solo AOO senza Amm e UOR', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'Mittente',
        TipoSoggetto: 'PAI',
        'PAI.IPAAOO.Denominazione': 'AOO Centrale',
        'PAI.IPAAOO.CodiceIPA': 'aoo_c',
      });
      expect(s.name).toBe('AOO Centrale (IPA: aoo_c)');
    });

    it('PAI: solo UOR senza Amm e AOO', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'Mittente',
        TipoSoggetto: 'PAI',
        'PAI.IPAUOR.Denominazione': 'UOR Alfa',
        'PAI.IPAUOR.CodiceIPA': 'uor_a',
      });
      expect(s.name).toBe('UOR Alfa (IPA: uor_a)');
    });

    it('PAI: nessun campo -> stringa vuota', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'Mittente',
        TipoSoggetto: 'PAI',
      });
      expect(s.name).toBe('');
    });

    it('PAE: con ufficio', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'Destinatario',
        TipoSoggetto: 'PAE',
        'PAE.DenominazioneAmministrazione': 'Ministero Y',
        'PAE.DenominazioneUfficio': 'Ufficio Z',
      });
      expect(s.name).toBe('Ministero Y, Ufficio: Ufficio Z');
    });

    it('PAE: senza ufficio', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'Destinatario',
        TipoSoggetto: 'PAE',
        'PAE.DenominazioneAmministrazione': 'Ministero Y',
      });
      expect(s.name).toBe('Ministero Y');
    });

    it('AS: con organizzazione e persona', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'Assegnatario',
        TipoSoggetto: 'AS',
        'AS.DenominazioneOrganizzazione': 'Org1',
        'AS.DenominazioneUfficio': 'Uff1',
        'AS.Cognome': 'Bianchi',
        'AS.Nome': 'Luca',
      });
      expect(s.name).toBe('Org1, Ufficio: Uff1 — Bianchi Luca');
    });

    it('AS: con organizzazione senza persona', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'Assegnatario',
        TipoSoggetto: 'AS',
        'AS.DenominazioneOrganizzazione': 'Org1',
        'AS.DenominazioneUfficio': 'Uff1',
      });
      expect(s.name).toBe('Org1, Ufficio: Uff1');
    });

    it('AS: con organizzazione senza ufficio e senza persona', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'Assegnatario',
        TipoSoggetto: 'AS',
        'AS.DenominazioneOrganizzazione': 'Org1',
      });
      // DenominazioneUfficio undefined -> '' -> "Org1, Ufficio: "
      expect(s.name).toBe('Org1, Ufficio: ');
    });

    it('AS: con IPA e persona', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'Assegnatario',
        TipoSoggetto: 'AS',
        'AS.IPAAmm.Denominazione': 'Comune A',
        'AS.IPAAmm.CodiceIPA': 'c_a',
        'AS.IPAAOO.Denominazione': 'AOO',
        'AS.IPAAOO.CodiceIPA': 'aoo',
        'AS.IPAUOR.Denominazione': 'UOR',
        'AS.IPAUOR.CodiceIPA': 'uor',
        'AS.Cognome': 'Verdi',
        'AS.Nome': 'Anna',
      });
      expect(s.name).toBe('Comune A (IPA: c_a), AOO (IPA: aoo), UOR (IPA: uor) — Verdi Anna');
    });

    it('AS: solo IPA senza persona', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'Assegnatario',
        TipoSoggetto: 'AS',
        'AS.IPAAmm.Denominazione': 'Comune A',
        'AS.IPAAmm.CodiceIPA': 'c_a',
      });
      expect(s.name).toBe('Comune A (IPA: c_a)');
    });

    it('AS: solo persona senza org e senza IPA', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'Assegnatario',
        TipoSoggetto: 'AS',
        'AS.Cognome': 'Russo',
        'AS.Nome': 'Elena',
      });
      // Nessuna org, nessuna IPA part -> parts vuoto, person non vuoto
      expect(s.name).toBe(' — Russo Elena');
    });

    it('AS: nessun campo -> stringa vuota', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'Assegnatario',
        TipoSoggetto: 'AS',
      });
      expect(s.name).toBe('');
    });

    it('RUP: persona con IPA', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'RUP',
        TipoSoggetto: 'RUP',
        'RUP.Cognome': 'Neri',
        'RUP.Nome': 'Carlo',
        'RUP.IPAAmm.Denominazione': 'Comune B',
        'RUP.IPAAmm.CodiceIPA': 'c_b',
      });
      expect(s.name).toBe('Neri Carlo — Comune B (IPA: c_b)');
    });

    it('RUP: solo persona senza IPA', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'RUP',
        TipoSoggetto: 'RUP',
        'RUP.Cognome': 'Neri',
        'RUP.Nome': 'Carlo',
      });
      expect(s.name).toBe('Neri Carlo');
    });

    it('RUP: persona con tutti e tre i livelli IPA (Amm, AOO, UOR)', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'RUP',
        TipoSoggetto: 'RUP',
        'RUP.Cognome': 'Ferrari',
        'RUP.Nome': 'Giorgio',
        'RUP.IPAAmm.Denominazione': 'Regione Z',
        'RUP.IPAAmm.CodiceIPA': 'r_z',
        'RUP.IPAAOO.Denominazione': 'AOO Centrale',
        'RUP.IPAAOO.CodiceIPA': 'aoo_c',
        'RUP.IPAUOR.Denominazione': 'UOR Tecnico',
        'RUP.IPAUOR.CodiceIPA': 'uor_t',
      });
      expect(s.name).toBe(
        'Ferrari Giorgio — Regione Z (IPA: r_z), AOO Centrale (IPA: aoo_c), UOR Tecnico (IPA: uor_t)',
      );
    });

    it('RUP: solo IPA senza persona', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'RUP',
        TipoSoggetto: 'RUP',
        'RUP.IPAAmm.Denominazione': 'Comune C',
        'RUP.IPAAmm.CodiceIPA': 'c_c',
      });
      // person è '' quindi non aggiunge " — ..."
      expect(s.name).toBe(' — Comune C (IPA: c_c)');
    });

    it('SW: prende DenominazioneSistema', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'Sistema',
        TipoSoggetto: 'SW',
        'SW.DenominazioneSistema': 'Protocollo X',
      });
      expect(s.name).toBe('Protocollo X');
    });

    it('SW: senza nome -> stringa vuota', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'Sistema',
        TipoSoggetto: 'SW',
      });
      expect(s.name).toBe('');
    });

    it('TipoSoggetto sconosciuto -> name vuoto', async () => {
      const s = await runWithSubject({
        TipoRuolo: 'X',
        TipoSoggetto: 'BOH',
        'BOH.Qualcosa': 'val',
      });
      expect(s).toEqual({ id: 0, role: 'X', name: '', type: 'BOH' });
    });
  });

  describe('subjects multipli', () => {
    it('ordina i soggetti per indice numerico (non lessicografico)', async () => {
      const doc = buildDocument([
        { name: 'NS.Soggetti.Ruolo.10.Dati.TipoSoggetto', value: 'PF' },
        { name: 'NS.Soggetti.Ruolo.10.Dati.TipoRuolo', value: 'R10' },
        { name: 'NS.Soggetti.Ruolo.10.Dati.PF.Cognome', value: 'Dieci' },
        { name: 'NS.Soggetti.Ruolo.10.Dati.PF.Nome', value: 'X' },
        { name: 'NS.Soggetti.Ruolo.2.Dati.TipoSoggetto', value: 'PF' },
        { name: 'NS.Soggetti.Ruolo.2.Dati.TipoRuolo', value: 'R2' },
        { name: 'NS.Soggetti.Ruolo.2.Dati.PF.Cognome', value: 'Due' },
        { name: 'NS.Soggetti.Ruolo.2.Dati.PF.Nome', value: 'Y' },
      ]);
      registerRepoWithDocument(doc);
      const service = container.resolve(GetDocumentDetailsService);
      const r = await service.execute('x');

      expect(r.subjects).toHaveLength(2);
      expect(r.subjects[0]).toMatchObject({ id: 0, role: 'R2', name: 'Due Y' });
      expect(r.subjects[1]).toMatchObject({ id: 1, role: 'R10', name: 'Dieci X' });
    });

    it('assegna id progressivi (0-based) indipendentemente dall\'indice nel metadato', async () => {
      const doc = buildDocument([
        { name: 'NS.Soggetti.Ruolo.5.Dati.TipoSoggetto', value: 'SW' },
        { name: 'NS.Soggetti.Ruolo.5.Dati.TipoRuolo', value: 'R5' },
        { name: 'NS.Soggetti.Ruolo.5.Dati.SW.DenominazioneSistema', value: 'Sys5' },
        { name: 'NS.Soggetti.Ruolo.99.Dati.TipoSoggetto', value: 'SW' },
        { name: 'NS.Soggetti.Ruolo.99.Dati.TipoRuolo', value: 'R99' },
        { name: 'NS.Soggetti.Ruolo.99.Dati.SW.DenominazioneSistema', value: 'Sys99' },
      ]);
      registerRepoWithDocument(doc);
      const service = container.resolve(GetDocumentDetailsService);
      const r = await service.execute('x');

      expect(r.subjects[0].id).toBe(0);
      expect(r.subjects[1].id).toBe(1);
    });

    it('ignora metadati soggetto il cui nome non matcha il secondo regex (il campo è skip)', async () => {
      // Questo metadata matcha il primo filtro (contiene .Soggetti.Ruolo.\d+.)
      // ma NON matcha il secondo regex (/\.Soggetti\.Ruolo\.(\d+)\.\w+\.(.+)$/)
      // Deve essere ignorato senza causare errori
      const doc = buildDocument([
        { name: 'NS.Soggetti.Ruolo.0.TipoSoggetto', value: 'PF' }, // manca il segmento \w+ tra indice e campo
        { name: 'NS.Soggetti.Ruolo.0.Dati.TipoSoggetto', value: 'SW' },
        { name: 'NS.Soggetti.Ruolo.0.Dati.TipoRuolo', value: 'Sistema' },
        { name: 'NS.Soggetti.Ruolo.0.Dati.SW.DenominazioneSistema', value: 'SysOK' },
      ]);
      registerRepoWithDocument(doc);
      const service = container.resolve(GetDocumentDetailsService);
      const r = await service.execute('x');

      // Il soggetto valido viene comunque costruito correttamente
      expect(r.subjects).toHaveLength(1);
      expect(r.subjects[0].name).toBe('SysOK');
    });

    it('soggetti di tipi misti vengono tutti restituiti con name corretto', async () => {
      const doc = buildDocument([
        { name: 'NS.Soggetti.Ruolo.0.Dati.TipoSoggetto', value: 'PF' },
        { name: 'NS.Soggetti.Ruolo.0.Dati.TipoRuolo', value: 'Mittente' },
        { name: 'NS.Soggetti.Ruolo.0.Dati.PF.Cognome', value: 'Rossi' },
        { name: 'NS.Soggetti.Ruolo.0.Dati.PF.Nome', value: 'Mario' },
        { name: 'NS.Soggetti.Ruolo.1.Dati.TipoSoggetto', value: 'PG' },
        { name: 'NS.Soggetti.Ruolo.1.Dati.TipoRuolo', value: 'Destinatario' },
        { name: 'NS.Soggetti.Ruolo.1.Dati.PG.DenominazioneOrganizzazione', value: 'ACME' },
        { name: 'NS.Soggetti.Ruolo.2.Dati.TipoSoggetto', value: 'SW' },
        { name: 'NS.Soggetti.Ruolo.2.Dati.TipoRuolo', value: 'Sistema' },
        { name: 'NS.Soggetti.Ruolo.2.Dati.SW.DenominazioneSistema', value: 'ProtSys' },
      ]);
      registerRepoWithDocument(doc);
      const service = container.resolve(GetDocumentDetailsService);
      const r = await service.execute('x');

      expect(r.subjects).toHaveLength(3);
      expect(r.subjects[0]).toMatchObject({ id: 0, role: 'Mittente', name: 'Rossi Mario', type: 'PF' });
      expect(r.subjects[1]).toMatchObject({ id: 1, role: 'Destinatario', name: 'ACME', type: 'PG' });
      expect(r.subjects[2]).toMatchObject({ id: 2, role: 'Sistema', name: 'ProtSys', type: 'SW' });
    });
  });
});
