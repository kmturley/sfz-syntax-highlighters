import { Gedit, DefinitionsContext } from './types/gedit';
import { Syntax, AliasElement, Header, CategoryOpcode, Category } from './types/syntax';
import { End, PurpleName, PurplePattern, Repository, TmLanguage } from './types/tmlanguage';
import { fileGet, fileGetJson, fileLoadJson, fileSave, findOpcodes, jsToXml, xmlToJs, yamlToJs } from './utils';
import slugify from 'slugify';

const OUT_DIR: string = './out';
const URL_GEDIT: string = 'https://raw.githubusercontent.com/sfztools/syntax-highlighting-gedit/master/sfz.lang';
const URL_SYNTAX: string =
  'https://raw.githubusercontent.com/sfzformat/sfzformat.github.io/source/_data/sfz/syntax.yml';
const URL_TMLANG: string = 'https://raw.githubusercontent.com/jokela/vscode-sfz/master/syntaxes/sfz.tmLanguage.json';

async function basefiles() {
  // Get gedit file and convert to json
  const geditLang: string = await fileGet(URL_GEDIT);
  fileSave(OUT_DIR, 'gedit.lang', geditLang);
  const geditFile: Gedit = xmlToJs(geditLang);
  fileSave(OUT_DIR, 'gedit.json', JSON.stringify(geditFile, null, 2));

  // Get syntax file and convert to json
  const syntaxYaml: string = await fileGet(URL_SYNTAX);
  fileSave(OUT_DIR, 'syntax.yml', syntaxYaml);
  const syntaxFile: Syntax = yamlToJs(syntaxYaml);
  fileSave(OUT_DIR, 'syntax.json', JSON.stringify(syntaxFile, null, 2));

  // Get tmLanguage file
  const tmLanguageFile: any = await fileGetJson(URL_TMLANG);
  fileSave(OUT_DIR, 'tmLanguage.json', JSON.stringify(tmLanguageFile, null, 2));
}

async function init() {
  // Get list of opcodes and headers to use
  const syntaxYaml: string = await fileGet(URL_SYNTAX);
  const syntaxFile: Syntax = yamlToJs(syntaxYaml);
  const headers: string[] = syntaxFile.headers.map((header: Header) => header.name);
  const opcodes: CategoryOpcode[] = findOpcodes(syntaxFile);

  // Get gedit template and update values
  const geditTemplate: Gedit = await fileLoadJson('./src/templates/gedit.json');
  fileSave(OUT_DIR, 'gedit-original.json', JSON.stringify(geditTemplate, null, 2));
  fileSave(OUT_DIR, 'gedit-original.lang', jsToXml(geditTemplate));
  geditTemplate.language.definitions.context.forEach((contextItem: DefinitionsContext) => {
    if (contextItem._attributes.id === 'headers-others') {
      contextItem.keyword = headers.map((header: string) => ({ _text: header }));
    } else if (contextItem._attributes.id === 'opcodes') {
      contextItem.keyword = opcodes.map((opcode: CategoryOpcode) => ({ _text: opcode.name }));
    }
  });
  fileSave(OUT_DIR, 'gedit-modified.json', JSON.stringify(geditTemplate, null, 2));
  fileSave(OUT_DIR, 'gedit-modified.lang', jsToXml(geditTemplate));

  // Get tmLanguage template and update header values
  const tmLanguageTemplate: TmLanguage = await fileLoadJson('./src/templates/tmLanguage.json');
  fileSave(OUT_DIR, 'tmLanguage-original.json', JSON.stringify(tmLanguageTemplate, null, 2));
  fileSave(OUT_DIR, 'tmLanguage-original.tmLanguage', jsToXml(tmLanguageTemplate));
  // Remove template patterns
  Object.keys(tmLanguageTemplate.repository).map((key: string) => {
    if (key === 'comment') return;
    tmLanguageTemplate.repository[key as keyof Repository] = {
      patterns: [],
    };
  });
  // Update header patterns
  tmLanguageTemplate.repository.headers.patterns = [
    {
      comment: 'Headers',
      name: 'meta.structure.header.$2.start.sfz',
      match: `(<)(${headers.join('|')})(>)`,
      captures: {
        '1': {
          name: 'punctuation.definition.tag.begin.sfz',
        },
        '2': {
          name: 'keyword.control.$2.sfz',
        },
        '3': {
          name: 'punctuation.definition.tag.begin.sfz',
        },
      },
    },
    {
      comment: 'Non-compliant headers',
      name: 'invalid.sfz',
      match: `<.*(?!(${headers.join('|')}))>`,
    },
  ];
  // Loop through opcode categories and update
  syntaxFile.categories.forEach((category: Category) => {
    const categoryOpcodes: CategoryOpcode[] = findOpcodes(category);
    const categorySlug: string = slugify(category.name, {
      lower: true,
      remove: /[^\w\s$*_+~.()'"!\-:@\/]+/g,
    });
    categoryOpcodes.forEach((opcode: CategoryOpcode) => {
      const versionSlug: string = slugify(opcode.version, {
        lower: true,
        remove: /[^\w\s$*_+~.()'"!\-:@\/]+/g,
      }).replace('-v', '');
      const opcodeMapId: keyof Repository = `${versionSlug}_${categorySlug}` as keyof Repository;
      if (!tmLanguageTemplate.repository[opcodeMapId]) {
        tmLanguageTemplate.repository[opcodeMapId] = {
          patterns: [],
        };
      }
      const patternValue: string = opcode.value?.options
        ? opcode.value?.options.map((option: AliasElement) => option.name).join('|')
        : `${opcode.value?.min} to ${opcode.value?.max} ${opcode.value?.unit || 'loops'}`;
      const patternInclude: string = opcode.value?.options
        ? `#${opcode.value?.type_name}_${opcode.name}`
        : `#${opcode.value?.type_name}_${opcode.value?.min}-${opcode.value?.max}`;
      const pattern: PurplePattern = {
        comment: `opcodes: (${opcode.name}): (${patternValue})`,
        name: PurpleName.MetaOpcodeSfz,
        begin: `\\b(${opcode.name})\\b`,
        beginCaptures: {
          1: {
            name: `variable.language.${categorySlug}.$1.sfz`,
          },
        },
        end: End.S,
        patterns: [
          {
            include: patternInclude,
          },
        ],
      };
      tmLanguageTemplate.repository[opcodeMapId].patterns.push(pattern as any);
    });
  });
  fileSave(OUT_DIR, 'tmLanguage-modified.json', JSON.stringify(tmLanguageTemplate, null, 2));
  fileSave(OUT_DIR, 'tmLanguage-modified.tmLanguage', jsToXml(tmLanguageTemplate));
}

init();
