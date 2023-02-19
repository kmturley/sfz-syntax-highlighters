import slugify from 'slugify';
import { AliasElement, Category, CategoryOpcode, Syntax } from './types/syntax';
import { End, PurpleName, PurplePattern, Repository, Sfz1SoundSourcePattern, TmLanguage } from './types/tmlanguage';
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
    categoryOpcodes.forEach((opcode: CategoryOpcode) => {
      const opcodeMapId: keyof Repository = tmOpcodeId(category, opcode) as keyof Repository;
      if (!opcodeMapIds.includes(opcodeMapId)) opcodeMapIds.push(opcodeMapId);
      if (!tmLanguageTemplate.repository[opcodeMapId]) {
        tmLanguageTemplate.repository[opcodeMapId] = {
          patterns: [],
        };
      }
      const patterns: any = tmLanguageTemplate.repository[opcodeMapId].patterns;
      if (opcode.value?.type_name === 'string') {
        patterns.push(tmString(category, opcode));
      } else {
        patterns.push(tmInteger(category, opcode));
      }
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

function tmCategoryId(category: Category): string {
  return slugify(category.name, {
    lower: true,
    remove: /[^\w\s$*_+~.()'"!\-:@\/]+/g,
  });
}

function tmInteger(category: Category, opcode: CategoryOpcode): PurplePattern {
  const pattern: PurplePattern = {
    comment: tmComment(opcode),
    name: PurpleName.MetaOpcodeSfz,
    begin: tmLanguageRegEx(opcode),
    beginCaptures: {
      1: {
        name: `variable.language.${tmCategoryId(category)}.$1.sfz`,
      },
    },
    end: End.S,
  };
  const patternId: string = tmPattern(opcode);
  if (patternId.length > 0) {
    pattern.patterns = [
      {
        include: `#${patternId}`,
      },
    ];
  }
  return pattern;
}

function tmString(category: Category, opcode: CategoryOpcode): Sfz1SoundSourcePattern {
  const pattern: Sfz1SoundSourcePattern = {
    comment: tmComment(opcode),
    name: PurpleName.MetaOpcodeSfz,
    begin: tmLanguageRegEx(opcode),
    beginCaptures: {
      1: {
        name: `variable.language.${tmCategoryId(category)}.$1.sfz`,
      },
      2: {
        name: 'keyword.operator.assignment.sfz',
      },
    },
    end: End.EndS,
    contentName: 'string.unquoted.sfz',
  };
  return pattern;
}

function tmComment(opcode: CategoryOpcode) {
  const prefix: string = `opcodes: (${opcode.name})`;
  if (opcode.value?.options !== undefined) {
    return `${prefix}: (${opcode.value?.options.map((option: AliasElement) => option.name).join('|')})`;
  }
  if (opcode.value?.min !== undefined) {
    const unit: string = opcode.value?.unit ? ` ${opcode.value?.unit}` : ``;
    return `${prefix}: (${opcode.value?.min} to ${opcode.value?.max}${unit})`;
  }
  return opcode.value?.type_name ? `${prefix}: (any ${opcode.value?.type_name})` : prefix;
}

function tmOpcodeId(category: Category, opcode: CategoryOpcode): string {
  const categorySlug: string = tmCategoryId(category);
  const versionSlug: string = slugify(opcode.version, {
    lower: true,
    remove: /[^\w\s$*_+~.()'"!\-:@\/]+/g,
  }).replace('-v', '');
  return `${versionSlug}_${categorySlug}`;
}

function tmPattern(opcode: CategoryOpcode): string {
  if (opcode.value?.options !== undefined) {
    return `${opcode.value?.type_name}_${opcode.name}`;
  }
  if (opcode.value?.min !== undefined && opcode.value?.max !== undefined) {
    const ignoredMaxValues = [32, 100, 1024];
    if (opcode.value?.min >= 0 && opcode.value?.max >= 0 && !ignoredMaxValues.includes(opcode.value?.max))
      return `${opcode.value?.type_name}_positive`;
    return `${opcode.value?.type_name}_${opcode.value?.min}-${opcode.value?.max}`;
  }
  return '';
}

function tmLanguageRegEx(opcode: CategoryOpcode): string {
  // Replace N, X, Y values with regex.
  const regExWithoutVariables: string = opcode.name.replace(/[NXY]+/g, '(?:\\d{1,3})?');
  if (opcode.value?.type_name === 'string') return `\\b(${regExWithoutVariables})(=?)`;
  return `\\b(${regExWithoutVariables})\\b`;
}

export { tmLanguageConvert };
