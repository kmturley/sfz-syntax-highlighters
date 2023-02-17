import slugify from 'slugify';
import { AliasElement, Category, CategoryOpcode, Syntax } from './types/syntax';
import { End, PurpleName, PurplePattern, Repository, TmLanguage } from './types/tmlanguage';
import { fileLoadJson, fileSave, findOpcodes, jsToXml } from './utils';

async function tmLanguageConvert(path: string, headers: string[], syntaxFile: Syntax) {
  // Get tmLanguage template, output xml and json versions.
  const tmLanguageTemplate: TmLanguage = await fileLoadJson('./src/templates/tmLanguage.json');
  fileSave(path, 'tmLanguage-original.json', JSON.stringify(tmLanguageTemplate, null, 2));
  fileSave(path, 'tmLanguage-original.tmLanguage', jsToXml(tmLanguageTemplate));

  // Remove all template patterns.
  Object.keys(tmLanguageTemplate.repository).map((key: string) => {
    if (key === 'comment') return;
    tmLanguageTemplate.repository[key as keyof Repository] = {
      patterns: [],
    };
  });
  // Update header patterns using syntax headers.
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
  const opcodeMapIds: string[] = [];
  syntaxFile.categories.forEach((category: Category) => {
    const categoryOpcodes: CategoryOpcode[] = findOpcodes(category).sort((a, b) => a.name.localeCompare(b.name));
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
      if (!opcodeMapIds.includes(opcodeMapId)) opcodeMapIds.push(opcodeMapId);
      if (!tmLanguageTemplate.repository[opcodeMapId]) {
        tmLanguageTemplate.repository[opcodeMapId] = {
          patterns: [],
        };
      }

      // Handle different types of values
      let patternValue: string = opcode.value?.type_name ? `: (any ${opcode.value?.type_name})` : ``;
      let patternInclude: string = ``;
      if (opcode.value?.options !== undefined) {
        patternValue = `: (${opcode.value?.options.map((option: AliasElement) => option.name).join('|')}`;
        patternInclude = `#${opcode.value?.type_name}_${opcode.name}`;
      }
      if (opcode.value?.min !== undefined) {
        const unit: string = opcode.value?.unit ? ` ${opcode.value?.unit}` : ``;
        patternValue = `: (${opcode.value?.min} to ${opcode.value?.max}${unit})`;
        patternInclude = `#${opcode.value?.type_name}_${opcode.value?.min}-${opcode.value?.max}`;
      }
      const pattern: PurplePattern = {
        comment: `opcodes: (${opcode.name})${patternValue}`,
        name: PurpleName.MetaOpcodeSfz,
        begin: `\\b(${tmLanguageRegEx(opcode.name)})\\b`,
        beginCaptures: {
          1: {
            name: `variable.language.${categorySlug}.$1.sfz`,
          },
        },
        end: End.S,
      };
      if (patternInclude.length > 0) {
        pattern.patterns = [
          {
            include: patternInclude,
          },
        ];
      }
      tmLanguageTemplate.repository[opcodeMapId].patterns.push(pattern as any);
    });
  });

  // Update pattern includes using map of sections.
  tmLanguageTemplate.patterns = opcodeMapIds.sort().map((opcodeMapId: string) => {
    return { include: `#${opcodeMapId}` };
  });
  tmLanguageTemplate.patterns.unshift({ include: '#comment' }, { include: '#headers' });

  // Save out json and xml versions.
  fileSave(path, 'tmLanguage-modified.json', JSON.stringify(tmLanguageTemplate, null, 2));
  fileSave(path, 'tmLanguage-modified.tmLanguage', jsToXml(tmLanguageTemplate));
}

function tmLanguageRegEx(input: string): string {
  // Replace N, X, Y values with regex.
  return input.replace(/[NXY]+/g, '(?:\\d{1,3})?');
}

export { tmLanguageConvert };
