import {SearchFilterDTO} from '../../../shared/request/search-from-metadata.request.dto';
export class FilterMapper{

    public execute(filters: SearchFilterDTO[]):SearchFilterDTO[]
    {
        let mappedFilters: SearchFilterDTO[] = [];
        for(const filter of filters)
        {
            switch (filter.type) {
                case 'Identificativo documento':
                    mappedFilters.push({type:'IdDoc.Identificativo',value:filter.value});
                    break;
                case 'Modalità di formazione':
                    mappedFilters.push({type:'ModalitaDiFormazione',value:filter.value});
                    break;
                case 'Tipologia documentale':
                    mappedFilters.push({type:'TipologiaDocumentale',value:filter.value});
                    break;
                case 'Tipologia di flusso':
                    mappedFilters.push({type:'DatiDiRegistrazione.TipologiaDiFlusso',value:filter.value});
                    break;
                case 'Tipo registro':
                    mappedFilters.push({type:'DatiDiRegistrazione.TipoRegistro',value:filter.value});
                    break;

                case 'Data registrazione':
                    mappedFilters.push({type:'DatiDiRegistrazione.TipoRegistro.Nessuno.DataDocumento',value:filter.value});
                    break;

                case 'Ora registrazione':
                    mappedFilters.push({type:'DatiDiRegistrazione.TipoRegistro.Nessuno.OraDocumento',value:filter.value});
                    break;

                case 'Numero documento':
                    mappedFilters.push({type:'DatiDiRegistrazione.TipoRegistro.Nessuno.NumeroDocumento',value:filter.value});
                    break;

                case 'Codice registro':
                    mappedFilters.push({type:'DatiDiRegistrazione.TipoRegistro.ProtocolloOrdinario_ProtocolloEmergenza.CodiceRegistro',value:filter.value});
                    break;

                case 'Ruolo':
                case 'Tipo soggetto':
                case 'Cognome':
                case 'Nome':
                case 'Codice Fiscale':
                case 'Indirizzo digitale':
                case 'Denominazione organizzazione':
                case 'Partita IVA':
                case 'Denominazione ufficio':
                case 'Denominazione amministrazione':
                case 'Codice IPA':
                case 'Denominazione amministrazione AOO':
                case 'Codice IPA AOO':
                case 'Denominazione amministrazione UOR':
                case 'Codice IPA UOR':
                case 'Denominazione sistema':
                case 'Oggetto':
                    mappedFilters.push({type:'ChiaveDescrittiva.Oggetto',value:filter.value});
                    break;

                case 'Parola chiave':
                    mappedFilters.push({type:'ChiaveDescrittiva.ParoleChiave',value:filter.value});
                    break;

                case 'Numero allegati':
                    mappedFilters.push({type:'Allegati.NumeroAllegati',value:filter.value});
                    break;

                case 'Impronta crittografica allegato':
                    break;

                case 'Identificativo allegato':
                    break;

                case 'Descrizione allegato':
                    break;

                case 'Indice di classificazione':
                    mappedFilters.push({type:'Classificazione.IndiceDiClassificazione',value:filter.value});
                    break;

                case 'Descrizione dell’indice di classificazione':
                    break;

                case 'Piano di classificazione':
                    break;

                case 'Riservato':
                    mappedFilters.push({type:'Riservato',value:filter.value});
                    break;

                case 'Formato':
                    mappedFilters.push({type:'IdentificativoDelFormato.Formato',value:filter.value});
                    break;

                case 'Nome prodotto software':
                    mappedFilters.push({type:'IdentificativoDelFormato.ProdottoSoftware.NomeProdotto',value:filter.value});
                    break;

                case 'Versione prodotto software':
                    mappedFilters.push({type:'IdentificativoDelFormato.ProdottoSoftware.VersioneProdotto',value:filter.value});
                    break;

                case 'Produttore software':
                    mappedFilters.push({type:'IdentificativoDelFormato.ProdottoSoftware.Produttore',value:filter.value});

                case 'Firmato digitalmente':
                    mappedFilters.push({type:'Verifica.FirmatoDigitalmente',value:filter.value});
                    break;

                case 'Sigillato elettronicamente':
                    mappedFilters.push({type:'Verifica.SigillatoElettronicamente',value:filter.value});
                    break;

                case 'Marcatura temporale':
                    mappedFilters.push({type:'Verifica.MarcaturaTemporale',value:filter.value});
                    break;

                case 'Conformità copie immagine su supporto informatico':
                    mappedFilters.push({type:'Verifica.ConformitaCopieImmagineSuSupportoInformatico',value:filter.value});
                    break;

                case 'Tipo aggregazione':
                    break;

                case 'Identificativo aggregazione':
                    break;

                case 'Tipologia fascicolo':
                    break;

                case 'Nome del documento':
                    mappedFilters.push({type:'NomeDelDocumento',value:filter.value});
                    break;

                case 'Versione del documento':
                    mappedFilters.push({type:'VersioneDelDocumento',value:filter.value});
                    break;

                case 'Tipo modifica':
                    break;

                case 'Data modifica':
                    break;

                case 'Ora modifica':
                    break;

                case 'Tempo di conservazione':
                    mappedFilters.push({type:'TempoDiConservazione',value:filter.value});
                    break;

                case 'Note':
                    mappedFilters.push({type:'Note',value:filter.value});
                    break;

                default:
                    break;
            }
        }
        return [];
    }
}
