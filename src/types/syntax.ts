interface SyntaxCategory {
  name: string;
  id: string;
  url: string;
  opcodes: SyntaxOpcode[];
}

interface SyntaxFile {
  format: number;
  versions: SyntaxVersion[];
  headers: SyntaxHeader[];
  categories: SyntaxCategory[];
}

interface SyntaxHeader {
  name: string;
  short_description: string;
  version: SyntaxVersion;
}

interface SyntaxOpcode {
  name: string;
  version: string;
  short_description: string;
  value: SyntaxValue;
}

interface SyntaxValue {
  type_name: string;
  default: number;
  min: number;
  max: number;
  unit: string;
}

enum SyntaxVersion {
  Aria = 'ARIA',
  Cakewalk = 'Cakewalk',
  LinuxSampler = 'LinuxSampler',
  SFZv1 = 'SFZ v1',
  SFZv2 = 'SFZ v2',
  sfizz = 'sfizz',
}

export { SyntaxCategory, SyntaxFile, SyntaxHeader, SyntaxOpcode, SyntaxValue, SyntaxVersion };
