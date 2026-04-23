import { SearchFilterDTO } from '../../../shared/request/search-filter.request.dto';

export class SearchQueryBuilder {
  private queryList: string[] = [];
  private metadataOnlyFilters: SearchFilterDTO[] = [];

  public addFilter(filter: SearchFilterDTO): void {
    //in queste query volutamente non c'è il punto e virgola alla fine perché
    //le query verranno unite in un INTERSECT, quindi ne serve solo uno alla fine
    switch (filter.type) {
      // FILTRI PER METADATI
      case 'Identificativo documento (UUID)':
        this.queryList.push(`SELECT DISTINCT uuid AS document_uuid
                               FROM documenti
                               WHERE uuid='${filter.value}'`);
        break;

      case 'Modalità di formazione':
        filter.type = 'DocumentoInformatico.ModalitaDiFormazione';
        this.metadataOnlyFilters.push(filter);

        break;
      case 'Tipologia documentale':
        filter.type = 'DocumentoInformatico.TipologiaDocumentale';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Tipologia di flusso':
        filter.type = 'DocumentoInformatico.DatiDiRegistrazione.TipologiaDiFlusso';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Tipo registro':
        filter.type = '';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Data registrazione':
        filter.type = '';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Ora registrazione':
        filter.type = '';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Numero documento':
        filter.type = '';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Codice registro':
        filter.type = '';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Oggetto':
        filter.type = 'DocumentoInformatico.ChiaveDescrittiva.Oggetto';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Parola chiave':
        filter.type = 'DocumentoInformatico.ChiaveDescrittiva.ParoleChiave.{num}';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Numero allegati':
        filter.type = 'DocumentoInformatico.Allegati.NumeroAllegati';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Impronta crittografica allegato (hash)':
        filter.type =
          'DocumentoInformatico.Allegati.IndiceAllegati.{num}.IdDoc.ImprontaCrittograficaDelDocumento.Impronta';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Impronta crittografica allegato (algoritmo)':
        filter.type =
          'DocumentoInformatico.Allegati.IndiceAllegati.{num}.IdDoc.ImprontaCrittograficaDelDocumento.Impronta';
        this.metadataOnlyFilters.push(filter);
        break;

      case 'Identificativo allegato (UUID)':
        this.queryList.push(`SELECT DISTINCT uuid_documento AS uuid_document 
                               FROM allegati
                               WHERE uuid_file='${filter.value}'`);
        filter.type = 'DocumentoInformatico.Allegati.IndiceAllegati.{num}.IdDoc.Identificativo';
        break;

      case 'Descrizione allegato':
        filter.type = 'DocumentoInformatico.Allegati.IndiceAllegati.{num}.Descrizione';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Indice di classificazione':
        filter.type = 'DocumentoInformatico.Classificazione.IndiceDiClassificazione';
        this.metadataOnlyFilters.push(filter);
        break;
      case "Descrizione dell'indice di classificazione":
        filter.type = 'DocumentoInformatico.Classificazione.Descrizione';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Piano di classificazione':
        filter.type = 'DocumentoInformatico.Classificazione.PianoDiClassificazione';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Riservato':
        filter.type = 'DocumentoInformatico.Riservato';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Formato':
        filter.type = 'DocumentoInformatico.IdentificativoDelFormato.Formato';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Nome prodotto software':
        filter.type = 'DocumentoInformatico.IdentificativoDelFormato.ProdottoSoftware.NomeProdotto';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Versione prodotto software':
        filter.type =
          'DocumentoInformatico.IdentificativoDelFormato.ProdottoSoftware.VersioneProdotto';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Produttore software':
        filter.type = 'DocumentoInformatico.IdentificativoDelFormato.ProdottoSoftware.Produttore';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Firmato digitalmente':
        filter.type = 'DocumentoInformatico.Verifica.FirmatoDigitalmente';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Sigillato elettronicamente':
        filter.type = 'DocumentoInformatico.Verifica.SigillatoElettronicamente';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Marcatura temporale':
        filter.type = 'DocumentoInformatico.Verifica.MarcaturaTemporale';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Conformità copie immagine su supporto informatico':
        filter.type = 'DocumentoInformatico.Verifica.ConformitaCopieImmagineSuSupportoInformatico';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Tipo aggregazione':
        filter.type = 'DocumentoInformatico.Agg.TipoAgg.{num}.TipoAggregazione';
        this.metadataOnlyFilters.push(filter);
        break;

      case 'Identificativo aggregazione':
        filter.type = 'DocumentoInformatico.Agg.TipoAgg.{num}.IdAggregazione';
        this.metadataOnlyFilters.push(filter);
        break;

      case 'Tipologia fascicolo':
        filter.type = '';
        this.metadataOnlyFilters.push(filter);
        break;

      case 'Nome del documento':
        filter.type = 'DocumentoInformatico.NomeDelDocumento';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Versione del documento':
        filter.type = 'DocumentoInformatico.VersioneDelDocumento';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Tipo modifica':
        filter.type = '';
        this.metadataOnlyFilters.push(filter);
        break;

      case 'Data modifica':
        filter.type = '';
        this.metadataOnlyFilters.push(filter);
        break;

      case 'Ora modifica':
        filter.type = '';
        this.metadataOnlyFilters.push(filter);
        break;

      case 'Tempo di conservazione':
        filter.type = 'DocumentoInformatico.TempoDiConservazione';
        this.metadataOnlyFilters.push(filter);
        break;
      case 'Note':
        filter.type = 'DocumentoInformatico.Note';
        this.metadataOnlyFilters.push(filter);
        break;

      // FILTRI PER SOGGETTI
      case 'Ruolo':
        this.queryList.push(`SELECT DISTINCT d.uuid_documento AS uuid_document
                               FROM documenti d JOIN ruoli r ON d.uuid_documento=r.id_soggetto
                               WHERE r.ruolo='${filter.value}'`);
        break;
      case 'Tipo soggetto':
        this.queryList.push(`SELECT DISTINCT d.uuid_documento AS uuid_document
                               FROM documenti d JOIN soggetti s ON d.uuid_documento=s.id
                               WHERE s.tipo='${filter.value}'`);
        break;

      case 'Cognome':
        this.queryList.push(`SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_pf s ON r.uuid_documento=s.id
                               WHERE s.cognome='${filter.value}'
                               INTERSECT
                               SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_as s ON r.uuid_documento=s.id
                               WHERE s.cognome='${filter.value}`);
        break;

      case 'Nome':
        this.queryList.push(`SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_pf s ON r.uuid_documento=s.id
                               WHERE s.nome='${filter.value}'
                               INTERSECT
                               SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_as s ON r.uuid_documento=s.id
                               WHERE s.nome='${filter.value}`);
        break;

      case 'Codice Fiscale':
        this.queryList.push(`SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_pf s ON r.uuid_documento=s.id
                               WHERE s.cf='${filter.value}'
                               INTERSECT
                               SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_as s ON r.uuid_documento=s.id
                               WHERE s.cf='${filter.value}`);
        break;

      case 'Indirizzo digitale':
        this.queryList.push(`SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_pf s ON r.uuid_documento=s.id
                               WHERE s.indirizzi_dig_riferimento='${filter.value}'
                               INTERSECT
                               SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_pg s ON r.uuid_documento=s.id
                               WHERE s.indirizzi_dig_riferimento='${filter.value}
                               INTERSECT
                               SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_pai s ON r.uuid_documento=s.id
                               WHERE s.indirizzi_dig_riferimento='${filter.value}
                               INTERSECT
                               SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_pae s ON r.uuid_documento=s.id
                               WHERE s.indirizzi_dig_riferimento='${filter.value}
                               INTERSECT
                               SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_as s ON r.uuid_documento=s.id
                               WHERE s.indirizzi_dig_riferimento='${filter.value}`);

        break;

      case 'Denominazione organizzazione':
        this.queryList.push(`SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_pg s ON r.uuid_documento=s.id
                               WHERE s.den_organizzazione='${filter.value}'
                               INTERSECT
                               SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_as s ON r.uuid_documento=s.id
                               WHERE s.den_organizzazione='${filter.value}`);
        break;

      case 'Partita IVA':
        this.queryList.push(`SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_pg s ON r.uuid_documento=s.id
                               WHERE s.p_iva='${filter.value}'`);
        break;

      case 'Denominazione ufficio':
        this.queryList.push(`SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_pg s ON r.uuid_documento=s.id
                               WHERE s.den_ufficio='${filter.value}
                               INTERSECT
                               SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_pae s ON r.uuid_documento=s.id
                               WHERE s.den_ufficio='${filter.value}
                               INTERSECT
                               SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_as s ON r.uuid_documento=s.id
                               WHERE s.den_ufficio='${filter.value}`);
        break;

      case 'Denominazione amministrazione':
        this.queryList.push(`SELECT DISTINCT r.uuid_documento AS uuid_document
                               SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_pae s ON r.uuid_documento=s.id
                               WHERE s.den_amministrazione='${filter.value}
                               INTERSECT
                               SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_pai s ON r.uuid_documento=s.id
                               WHERE s.den_amministrazione='${filter.value}`);
        break;

      case 'Codice IPA':
        this.queryList.push(`SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_pai s ON r.uuid_documento=s.id
                               WHERE s.codice_ipa='${filter.value}`);
        break;

      case 'Denominazione amministrazione AOO':
        this.queryList.push(`SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_pai s ON r.uuid_documento=s.id
                               WHERE s.den_amministrazione_aoo='${filter.value}`);

        break;

      case 'Codice IPA AOO':
        this.queryList.push(`SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_pai s ON r.uuid_documento=s.id
                               WHERE s.codice_ipa_aoo='${filter.value}`);
        break;

      case 'Denominazione amministrazione UOR':
        this.queryList.push(`SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_pai s ON r.uuid_documento=s.id
                               WHERE s.den_amministrazione_uor='${filter.value}`);
        break;

      case 'Codice IPA UOR':
        this.queryList.push(`SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_pai s ON r.uuid_documento=s.id
                               WHERE s.codice_ipa_uor='${filter.value}`);
        break;

      case 'Denominazione sistema':
        this.queryList.push(`SELECT DISTINCT r.uuid_documento AS uuid_document
                               FROM ruoli r JOIN soggetti_sw s ON r.uuid_documento=s.id
                               WHERE s.den_sistema='${filter.value}`);
        break;

      default:
        break;
    }
  }

  public getResult(): string {
    //Costruzione query sulla tabella metadata
    let remainingFilters = this.metadataOnlyFilters.length;
    if (remainingFilters !== 0) {
      let queryOnlyMetadata = `SELECT uuid_documento AS uuid_document
            FROM metadata
            WHERE `;
      for (const filter of this.metadataOnlyFilters) {
        remainingFilters--;
        queryOnlyMetadata.concat(`(nome='${filter.type}' AND valore='${filter.value}')`);

        if (remainingFilters !== 0) queryOnlyMetadata.concat(` OR `);
      }
      queryOnlyMetadata.concat(`
        GROUP BY uuid_documento
        HAVING COUNT (DISTINCT nome) = ${this.metadataOnlyFilters.length}
      `);

      this.queryList.push(queryOnlyMetadata);
    }

    //Costruzione query completa
    remainingFilters = this.queryList.length;
    let completeQuery = ``;

    for (const query of this.queryList) {
      remainingFilters--;
      completeQuery.concat(query);

      if (remainingFilters !== 0) completeQuery.concat(` INTERSECT `);
    }
    completeQuery.concat(`;`);

    return completeQuery;
  }
}
