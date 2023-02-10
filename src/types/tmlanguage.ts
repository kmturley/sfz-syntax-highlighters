// Generated by https://quicktype.io
//
// To change quicktype's target language, run command:
//
//   "Set quicktype target language"

export interface TmLanguage {
  $schema: string;
  name: string;
  patterns: TmLanguagePattern[];
  repository: Repository;
  scopeName: string;
}

export interface TmLanguagePattern {
  include: string;
}

export interface Repository {
  comment: Comment;
  headers: Headers;
  'sfz1_sound-source': Sfz;
  'sfz1_instrument-settings': AriaCurves;
  'sfz1_region-logic': AriaCurves;
  'sfz1_performance-parameters': AriaCurves;
  sfz1_modulation: AriaCurves;
  sfz1_effects: AriaCurves;
  sfz2_directives: Sfz2Directives;
  'sfz2_sound-source': Sfz;
  'sfz2_instrument-settings': Sfz;
  'sfz2_region-logic': AriaCurves;
  'sfz2_performance-parameters': AriaCurves;
  sfz2_modulation: AriaCurves;
  sfz2_curves: AriaCurves;
  'aria_instrument-settings': AriaCurves;
  'aria_region-logic': AriaCurves;
  'aria_performance-parameters': AriaCurves;
  aria_modulation: AriaCurves;
  aria_curves: AriaCurves;
  aria_effects: AriaCurves;
  'float_neg30000-30000': PuneHedgehog;
  'float_neg144-48': PuneHedgehog;
  'float_neg144-6': PuneHedgehog;
  'float_neg200-200': PuneHedgehog;
  'float_neg100-100': PuneHedgehog;
  'float_neg96-12': PuneHedgehog;
  'float_neg96-24': PuneHedgehog;
  'float_neg20-20': PuneHedgehog;
  'float_neg10-10': PuneHedgehog;
  'float_neg4-4': PuneHedgehog;
  'float_neg1-1': PuneHedgehog;
  'float_0-1': PuneHedgehog;
  'float_0-4': PuneHedgehog;
  'float_0-20': PuneHedgehog;
  'float_0-24': PuneHedgehog;
  'float_0-32': PuneHedgehog;
  'float_0-40': PuneHedgehog;
  'float_0-100': PuneHedgehog;
  'float_0-200': PuneHedgehog;
  'float_0-500': PuneHedgehog;
  'float_0-30000': PuneHedgehog;
  float_positive: PuneHedgehog;
  float_any: PuneHedgehog;
  'int_neg12000-12000': PuneHedgehog;
  'int_neg9600-9600': PuneHedgehog;
  'int_neg8192-8192': PuneHedgehog;
  'int_neg1200-1200': PuneHedgehog;
  'int_neg100-100': PuneHedgehog;
  'int_neg10-10': PuneHedgehog;
  'int_neg1-127': PuneHedgehog;
  'int_neg127-127': PuneHedgehog;
  'int_0-127': PuneHedgehog;
  'int_0-127_or_string_note': PuneHedgehog;
  'int_0-1024': Int;
  'int_0-1200': PuneHedgehog;
  'int_0-9600': PuneHedgehog;
  'int_1-16': Int;
  'int_1-100': Int;
  'int_1-1200': Int;
  int_positive: PuneHedgehog;
  int_positive_or_neg1: PuneHedgehog;
  int_any: PuneHedgehog;
  'string_add-mult': PuneHedgehog;
  'string_attack-release-first-legato': PuneHedgehog;
  'string_balance-mma': PuneHedgehog;
  'string_current-previous': PuneHedgehog;
  'string_fast-normal-time': PuneHedgehog;
  'string_forward-backward-alternate': PuneHedgehog;
  'string_forward-reverse': PuneHedgehog;
  'string_gain-power': PuneHedgehog;
  string_loop_mode: PuneHedgehog;
  'string_lpf-hpf-bpf-brf': PuneHedgehog;
  string_md5: PuneHedgehog;
  'string_normal-invert': PuneHedgehog;
  'string_on-off': PuneHedgehog;
  string_note: PuneHedgehog;
  string_any_continuous: PuneHedgehog;
}

export interface AriaCurves {
  patterns: PurplePattern[];
}

export interface PurplePattern {
  comment: string;
  name: PurpleName;
  begin: string;
  beginCaptures: BeginCaptures;
  end: End;
  patterns: TmLanguagePattern[];
}

export interface BeginCaptures {
  '1': The1;
}

export interface The1 {
  name: string;
}

export enum End {
  EndS = '(?=(\\s//|$))',
  S = '\\s|$',
}

export enum PurpleName {
  MetaOpcodeSfz = 'meta.opcode.sfz',
}

export interface Comment {
  patterns: CommentPattern[];
}

export interface CommentPattern {
  name: string;
  begin: string;
  beginCaptures: { [key: string]: The1 };
  end: string;
  endCaptures?: EndCaptures;
}

export interface EndCaptures {
  '0': The1;
}

export interface PuneHedgehog {
  patterns: FluffyPattern[];
}

export interface FluffyPattern {
  match: string;
  captures?: { [key: string]: The1 };
  name?: FluffyName;
}

export enum FluffyName {
  InvalidSfz = 'invalid.sfz',
}

export interface Headers {
  patterns: HeadersPattern[];
}

export interface HeadersPattern {
  comment: string;
  name: string;
  match: string;
  captures?: { [key: string]: The1 };
}

export interface Int {
  patterns: Int01024_Pattern[];
}

export interface Int01024_Pattern {
  match: string;
  name: string;
}

export interface Sfz {
  patterns: Sfz1SoundSourcePattern[];
}

export interface Sfz1SoundSourcePattern {
  comment: string;
  name: PurpleName;
  begin: string;
  beginCaptures: { [key: string]: The1 };
  end: End;
  contentName?: string;
  patterns?: TmLanguagePattern[];
}

export interface Sfz2Directives {
  patterns: Sfz2DirectivesPattern[];
}

export interface Sfz2DirectivesPattern {
  comment: string;
  match: string;
  captures?: { [key: string]: The1 };
  name?: string;
}
