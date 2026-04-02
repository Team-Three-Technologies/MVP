interface Allegato {
    percorso: string;
    formato: string;
}

interface DocumentModel {
    uuid_documento: string;
    nome_documento: string;
    oggetto: string;
    versione: string;
    files_count: number;
    total_size: number;
    num_allegati: number;
    allegati: Allegato[];
}
