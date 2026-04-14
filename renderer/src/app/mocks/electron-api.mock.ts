import { DocumentModel } from '../models/document';
import { FilterModel } from '../models/filter';

const MOCK_DOCUMENTS: DocumentModel[] = [
  {
    uuid_documento: '123e4567-e89b-12d3-a456-426614174000',
    nome_documento: 'Manuale_Utente.pdf',
    formato: 'PDF',
    data_registrazione: '2026-04-14',
    ora_registrazione: '09:00:00',
    oggetto: 'Manuale d\'uso del sistema DIP',
    versione: '1.0',
    files_count: 1,
    total_size: 1048576,
    num_allegati: 0,
    allegati: []
  },
  {
    uuid_documento: '987fcdeb-51a2-43d7-9012-349876543210',
    nome_documento: 'Logo_Aziendale.png',
    formato: 'PNG',
    data_registrazione: '2026-04-13',
    ora_registrazione: '14:30:00',
    oggetto: 'Logo ufficiale in alta risoluzione',
    versione: '2.1',
    files_count: 1,
    total_size: 204857,
    num_allegati: 1,
    allegati: [
      {
        percorso: 'mock/path/varianti.txt',
        formato: 'TXT',
        id_allegato: '777fcdeb-51a2-43d7-9012-123456789012'
      }
    ]
  },
  {
    uuid_documento: 'abcdef12-3456-7890-abcd-ef1234567890',
    nome_documento: 'Dati_Finanziari.csv',
    formato: 'CSV',
    data_registrazione: '2026-04-10',
    ora_registrazione: '11:15:00',
    oggetto: 'Report finanziario Q1',
    versione: '1.2',
    files_count: 1,
    total_size: 15360,
    num_allegati: 0,
    allegati: []
  }
];

// Helper to convert base64 to byte array
const base64ToBytes = (base64: string): number[] => {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return Array.from(bytes);
};

// Dummy 1x1 pixel transparent PNG
const MOCK_PNG_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

// Minimal valid empty PDF
const MOCK_PDF_CONTENT = `%PDF-1.0
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj
xref
0 4
0000000000 65535 f
0000000010 00000 n
0000000053 00000 n
0000000102 00000 n
trailer<</Size 4/Root 1 0 R>>
startxref
149
%EOF`;

export function setupElectronApiMock() {
  if (!(window as any).electronAPI) {
    console.warn('⚡️ [Mock] Electron API not detected. Injecting MOCK electronAPI for local development...');
    
    (window as any).electronAPI = {
      dip: {
        autoImport: async (): Promise<void> => {
          console.log('[MOCK] autoImport called');
          return new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        },
        loadDocuments: async (): Promise<DocumentModel[]> => {
          console.log('[MOCK] loadDocuments called');
          return new Promise(resolve => setTimeout(() => resolve(MOCK_DOCUMENTS), 300));
        },
        searchDocuments: async (filters: FilterModel[]): Promise<DocumentModel[]> => {
          console.log('[MOCK] searchDocuments called with', filters);
          
          return new Promise(resolve => {
            setTimeout(() => {
              if (!filters || filters.length === 0) {
                resolve(MOCK_DOCUMENTS);
                return;
              }
              
              const filtered = MOCK_DOCUMENTS.filter(doc => {
                return filters.every(filter => {
                  if (!filter.value) return true;
                  const valueLower = filter.value.toLowerCase();
                  
                  switch (filter.type) {
                    case 'nome_documento':
                    case 'name':
                      return doc.nome_documento.toLowerCase().includes(valueLower);
                    case 'oggetto':
                      return doc.oggetto.toLowerCase().includes(valueLower);
                    case 'formato':
                    case 'format':
                      return doc.formato.toLowerCase() === valueLower;
                    default:
                      // Basic global search fallback
                      return Object.values(doc).some(val => 
                        String(val).toLowerCase().includes(valueLower)
                      );
                  }
                });
              });
              
              resolve(filtered);
            }, 300);
          });
        },
        loadDocumentFile: async (filePath: string): Promise<number[]> => {
          console.log('[MOCK] loadDocumentFile called with', filePath);
          
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              const lowerPath = filePath.toLowerCase();
              if (lowerPath.endsWith('.pdf')) {
                resolve(Array.from(new TextEncoder().encode(MOCK_PDF_CONTENT)));
              } else if (lowerPath.endsWith('.png') || lowerPath.endsWith('.jpg') || lowerPath.endsWith('.jpeg')) {
                resolve(base64ToBytes(MOCK_PNG_BASE64));
              } else if (lowerPath.endsWith('.txt') || lowerPath.endsWith('.csv')) {
                resolve(Array.from(new TextEncoder().encode("Mocked file content for " + filePath)));
              } else {
                reject(new Error(`[MOCK] Formato file non supportato o errore durante la lettura: ${filePath}`));
              }
            }, 500);
          });
        }
      },
      on: (channel: string, callback: (data: unknown) => void) => {
        console.log(`[MOCK] Event listener registered for channel: ${channel}`);
        
        // Optional: simulate events if needed. E.g.
        // if (channel === 'some-event') setTimeout(() => callback({ mockData: true }), 1000);

        return () => {
             console.log(`[MOCK] Event listener unregistered for channel: ${channel}`);
        };
      }
    };
  }
}
