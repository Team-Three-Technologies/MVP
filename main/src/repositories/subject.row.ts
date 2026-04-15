export interface SubjectHydrationRow {
  id: number;
  tipo: 'Persona Fisica' | 'Organizzazione' | 'Amministrazione Pubblica italiana' | 'Amministrazione Pubblica estera' | 'Assegnatario' | 'Documento prodotto automaticamente';
  ruolo: string;

  // pf
  pf_cognome: string | null;
  pf_nome: string | null;
  pf_cf: string | null;
  pf_indirizzi: string | null;

  // pg
  pg_den_org: string | null;
  pg_piva: string | null;
  pg_den_uff: string | null;
  pg_indirizzi: string | null;

  // pai
  pai_den_amm: string | null;
  pai_cod_ipa: string | null;
  pai_den_aoo: string | null;
  pai_cod_aoo: string | null;
  pai_den_uor: string | null;
  pai_cod_uor: string | null;
  pai_indirizzi: string | null;

  // pae
  pae_den_amm: string | null;
  pae_den_uff: string | null;
  pae_indirizzi: string | null;

  // as
  as_cognome: string | null;
  as_nome: string | null;
  as_cf: string | null;
  as_den_org: string | null;
  as_den_uff: string | null;
  as_indirizzi: string | null;

  // sw
  sw_den_sistema: string | null;
}