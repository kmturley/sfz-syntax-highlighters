// Generated by https://quicktype.io
//
// To change quicktype's target language, run command:
//
//   "Set quicktype target language"

export interface Syntax {
  format: number;
  versions: Version[];
  headers: Header[];
  categories: Category[];
}

export interface Category {
  name: string;
  id?: string;
  url: string;
  opcodes?: CategoryOpcode[];
  short_description?: string;
  types?: Type[];
}

export interface CategoryOpcode {
  category?: string;
  name: string;
  version: Version;
  short_description: string;
  value?: PurpleValue;
  macro?: boolean;
  targets?: TargetElement[];
  alias?: TargetElement[];
  index?: Index;
  modulation?: PurpleModulation;
}

export interface TargetElement {
  name: string;
}

export interface Index {
  type_name: TypeName;
  min: number;
  max: number;
}

export enum TypeName {
  Empty = '',
  Float = 'float',
  Integer = 'integer',
  String = 'string',
}

export interface PurpleModulation {
  midi_cc: TargetElement[];
  envelope?: Envelope;
  lfo?: Envelope;
}

export enum Envelope {
  EgNFreqLfoX = 'egN_freq_lfoX',
  Empty = '✓',
  FilegDepth = 'fileg_depth',
}

export interface PurpleValue {
  type_name: TypeName;
  min?: number;
  max?: number;
  options?: AliasElement[];
  default?: number | string;
  unit?: Unit;
}

export interface AliasElement {
  name: string;
  version?: Version;
}

export enum Version {
  Aria = 'ARIA',
  Cakewalk = 'Cakewalk',
  LinuxSampler = 'LinuxSampler',
  SFZV1 = 'SFZ v1',
  SFZV2 = 'SFZ v2',
  Sfizz = 'sfizz',
}

export enum Unit {
  Cents = 'cents',
  DB = 'dB',
  Empty = '%',
  Hz = 'Hz',
  MS = 'ms',
  Octaves = 'octaves',
  SampleUnits = 'sample units',
  Seconds = 'seconds',
  Unit = '°',
}

export interface Type {
  name: string;
  id: string;
  short_description?: string;
  opcodes: TypeOpcode[];
  url?: string;
}

export interface TypeOpcode {
  name: string;
  short_description?: string;
  version: Version;
  value?: FluffyValue;
  modulation?: FluffyModulation;
  alias?: PurpleAlias[];
  targets?: TargetElement[];
  index?: Index;
}

export interface PurpleAlias {
  name: string;
  version?: Version;
  short_description?: string;
  modulation?: AliasModulation;
  deprecated?: boolean;
}

export interface AliasModulation {
  midi_cc: PurpleMIDICc[];
}

export interface PurpleMIDICc {
  name: string;
  value?: MIDICcValue;
  alias?: AliasElement[];
}

export interface MIDICcValue {
  type_name?: TypeName;
  default?: number;
  min?: number;
  max?: number;
  unit?: Unit;
}

export interface FluffyModulation {
  midi_cc: FluffyMIDICc[];
  envelope?: Envelope;
  lfo?: string;
  velocity?: Velocity[];
}

export interface FluffyMIDICc {
  name: string;
  short_description?: string;
  alias?: AliasElement[];
  value?: MIDICcValue;
  version?: Version;
}

export interface Velocity {
  name: string;
  short_description: string;
  value: MIDICcValue;
  alias?: VelocityAlias[];
}

export interface VelocityAlias {
  name: string;
  version: Version;
  deprecated: boolean;
}

export interface FluffyValue {
  type_name: TypeName;
  default?: number | string;
  min?: number;
  max?: number | string;
  unit?: string;
  options?: PurpleOption[];
}

export interface PurpleOption {
  name: string;
  description?: string;
  version?: Version;
}

export interface Header {
  name: string;
  short_description: string;
  version: Version;
}
