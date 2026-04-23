-- ============================================================
-- METADATA_TIPO_FILTRO (versione ottimizzata per SQLite)
-- ============================================================

CREATE TABLE IF NOT EXISTS metadata_filter_match(
    type TEXT NOT NULL,  -- corrisponde a SearchFilterDTO.type
    nome_pattern TEXT NOT NULL,  -- pattern da confrontare con metadata.nome (supporta LIKE)
    PRIMARY KEY (tipo_filtro, nome_pattern)
);

-- Documento
INSERT INTO  metadata_filter_match(type, nome_pattern) VALUES
('Identificativo documento (UUID)', 'IdDoc.Identificativo'),
('Identificativo documento (UUID)', 'IdDoc.Segnatura'),
('Modalità di formazione', 'ModalitaDiFormazione'),
('Tipologia documentale', 'TipologiaDocumentale'),
('Tipologia di flusso', 'DatiDiRegistrazione.TipologiaDiFlusso'),
('Tipo registro', 'DatiDiRegistrazione.TipoRegistro.%'),
('Data registrazione', 'DatiDiRegistrazione.TipoRegistro.ProtocolloOrdinario_ProtocolloEmergenza.DataProtocollazioneDocumento'),
('Data registrazione', 'DatiDiRegistrazione.TipoRegistro.Repertorio_Registro.DataRegistrazioneDocumento'),
('Data registrazione', 'DatiDiRegistrazione.TipoRegistro.Nessuno.DataDocumento'),
('Ora registrazione', 'DatiDiRegistrazione.TipoRegistro.ProtocolloOrdinario_ProtocolloEmergenza.OraProtocollazioneDocumento'),
('Ora registrazione', 'DatiDiRegistrazione.TipoRegistro.Repertorio_Registro.OraRegistrazioneDocumento'),
('Ora registrazione', 'DatiDiRegistrazione.TipoRegistro.Nessuno.OraDocumento'),
('Numero documento', 'DatiDiRegistrazione.TipoRegistro.ProtocolloOrdinario_ProtocolloEmergenza.NumeroProtocolloDocumento'),
('Numero documento', 'DatiDiRegistrazione.TipoRegistro.Repertorio_Registro.NumeroRegistrazioneDocumento'),
('Numero documento', 'DatiDiRegistrazione.TipoRegistro.Nessuno.NumeroDocumento'),
('Codice registro', 'DatiDiRegistrazione.TipoRegistro.ProtocolloOrdinario_ProtocolloEmergenza.CodiceRegistro'),
('Codice registro', 'DatiDiRegistrazione.TipoRegistro.Repertorio_Registro.CodiceRegistro'),

-- Soggetti - Dati anagrafici
('Cognome', '%.Cognome'),
('Nome', '%.Nome'),
('Codice Fiscale', '%.CodiceFiscale'),
('Indirizzo digitale', '%.IndirizziDigitaliDiRiferimento.%'),
('Denominazione organizzazione', '%.DenominazioneOrganizzazione'),
('Partita IVA', '%.CodiceFiscale_PartitaIva'),
('Denominazione ufficio', '%.DenominazioneUfficio'),

-- Amministrazioni
('Codice IPA', '%.IPAAmm.CodiceIPA'),
('Denominazione amministrazione', '%.IPAAmm.Denominazione'),
('Codice IPA AOO', '%.IPAAOO.CodiceIPA'),
('Denominazione amministrazione AOO', '%.IPAAOO.Denominazione'),
('Codice IPA UOR', '%.IPAUOR.CodiceIPA'),
('Denominazione amministrazione UOR', '%.IPAUOR.Denominazione'),
('Denominazione amministrazione', '%.DenominazioneAmministrazione'),  -- per PAE
('Denominazione ufficio', '%.DenominazioneUfficio'),  -- per PAE
('Denominazione sistema', '%.SW.DenominazioneSistema'),

-- Ruolo (valore effettivo)
('Ruolo', '%.TipoRuolo'),

-- Tipo Soggetto (metadato nostro per gestire tiposoggetto, basato sul nome del tag choice)
('Tipo soggetto', '%.Soggetti.Ruolo.%.%.TipoSoggetto'),

-- Contenuto descrittivo
('Oggetto', 'ChiaveDescrittiva.Oggetto'),
('Parola chiave', 'ChiaveDescrittiva.ParoleChiave.%'),
('Numero allegati', 'Allegati.NumeroAllegati'),

-- Impronte
('Impronta crittografica documento (hash)', 'IdDoc.ImprontaCrittograficaDelDocumento.Impronta'),
('Impronta crittografica documento (hash)', 'IdIdentificativoDocumentoPrimario.ImprontaCrittograficaDelDocumento.Impronta'),
('Impronta crittografica documento (algoritmo)', 'IdDoc.ImprontaCrittograficaDelDocumento.Algoritmo'),
('Impronta crittografica documento (algoritmo)', 'IdIdentificativoDocumentoPrimario.ImprontaCrittograficaDelDocumento.Algoritmo'),
('Impronta crittografica allegato (hash)', 'Allegati.IndiceAllegati.%.IdDoc.ImprontaCrittograficaDelDocumento.Impronta'),
('Impronta crittografica allegato (algoritmo)', 'Allegati.IndiceAllegati.%.IdDoc.ImprontaCrittograficaDelDocumento.Algoritmo'),
('Identificativo allegato (UUID)', 'Allegati.IndiceAllegati.%.IdDoc.Identificativo'),
('Descrizione allegato', 'Allegati.IndiceAllegati.%.Descrizione'),

-- Classificazione
('Indice di classificazione', 'Classificazione.IndiceDiClassificazione'),
('Descrizione dell''indice di classificazione', 'Classificazione.Descrizione'),
('Piano di classificazione', 'Classificazione.PianoDiClassificazione'),

-- Altro
('Riservato', 'Riservato'),
('Formato', 'IdentificativoDelFormato.Formato'),
('Nome prodotto software', 'IdentificativoDelFormato.ProdottoSoftware.NomeProdotto'),
('Versione prodotto software', 'IdentificativoDelFormato.ProdottoSoftware.VersioneProdotto'),
('Produttore software', 'IdentificativoDelFormato.ProdottoSoftware.Produttore'),
('Firmato digitalmente', 'Verifica.FirmatoDigitalmente'),
('Sigillato elettronicamente', 'Verifica.SigillatoElettronicamente'),
('Marcatura temporale', 'Verifica.MarcaturaTemporale'),
('Conformità copie immagine su supporto informatico', 'Verifica.ConformitaCopieImmagineSuSupportoInformatico'),
('Tipo aggregazione', 'IdAgg.TipoAggregazione'),
('Tipo aggregazione', 'Agg.TipoAgg.%.TipoAggregazione'),
('Identificativo aggregazione', 'IdAgg.IdAggregazione'),
('Identificativo aggregazione', 'Agg.TipoAgg.%.IdAggregazione'),
('Tipologia fascicolo', 'TipologiaFascicolo'),
('Nome del documento', 'NomeDelDocumento'),
('Versione del documento', 'VersioneDelDocumento'),
('Tipo modifica', 'TracciatureModificheDocumento.TipoModifica'),
('Data modifica', 'TracciatureModificheDocumento.DataModifica'),
('Ora modifica', 'TracciatureModificheDocumento.OraModifica'),
('Tempo di conservazione', 'TempoDiConservazione'),
('Note', 'Note');
