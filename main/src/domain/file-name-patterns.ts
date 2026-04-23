const UUID_V4 = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

export const FILE_NAME_PATTERNS = {
  DIP_INDEX: new RegExp(
    `^DiPIndex\\.[0-9]{4}[0-9]{1,2}[0-9]{1,2}\\.${UUID_V4}\\.xml$`, // DiPIndex.AAAA[M o MM][G o GG].UUID.xml
    'i',
  ),
  AIP_INFO: new RegExp(`^AiPInfo\\.${UUID_V4}\\.xml$`, 'i'),
};
