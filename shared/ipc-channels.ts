export const IPC_CHANNELS = {
  DIP_AUTO_IMPORT: 'dip:auto-import',
  DIP_CONTENT: 'dip:content',
  DIP_CHECK_INTEGRITY: 'dip:check-integrity',
  DIP_CHECK_INTEGRITY_RESULT: 'dip:integrity-result',
  DIP_CHECK_INTEGRITY_DONE: 'dip:integrity-done',
  DIP_CHECK_INTEGRITY_ERROR: 'dip:integrity-error',
  DIP_DELETE: 'dip:delete',
  DOCUMENT_DETAILS: 'document:details',
  DOCUMENT_METADATA_SEARCH: 'document:metadata-search',
  DOCUMENT_FILE_INTERNAL_PREVIEW: 'document:file-internal-preview',
  DOCUMENT_FILE_EXTERNAL_PREVIEW: 'document:file-external-preview',
  DOCUMENT_EXPORT_FILE: 'document:export-file',
} as const;
