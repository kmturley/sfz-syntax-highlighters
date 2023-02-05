interface Category {
  name: string;
  id: string;
  url: string;
  opcodes: Opcode[];
}

interface Header {
  name: string;
  short_description: string;
  version: Version;
}

interface Opcode {
  name: string;
  version: string;
  short_description: string;
  value: Value;
}

interface SyntaxFile {
  format: number;
  versions: Version[];
  headers: Header[];
  categories: Category[];
}

interface Value {
  type_name: string;
  default: number;
  min: number;
  max: number;
  unit: string;
}

enum Version {
  Aria = 'ARIA',
  Cakewalk = 'Cakewalk',
  LinuxSampler = 'LinuxSampler',
  SFZv1 = 'SFZ v1',
  SFZv2 = 'SFZ v2',
  sfizz = 'sfizz',
}

export { Header, SyntaxFile, Version };
