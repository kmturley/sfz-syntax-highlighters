import { Syntax, Header } from './types/syntax';
import { fileGet, yamlToJs } from './utils';
import { geditConvert } from './gedit';
import { tmLanguageConvert } from './tmLanguage';
// import { examples } from './examples';

const OUT_DIR: string = './out';
const URL_SYNTAX: string =
  'https://raw.githubusercontent.com/sfzformat/sfzformat.github.io/source/_data/sfz/syntax.yml';

async function init() {
  // Get syntax.yml file containing opcodes.
  const syntaxYaml: string = await fileGet(URL_SYNTAX);
  const syntaxFile: Syntax = yamlToJs(syntaxYaml);
  const headers: string[] = syntaxFile.headers.map((header: Header) => header.name).sort();

  // Run format-specific convertors.
  await geditConvert(OUT_DIR, headers, syntaxFile);
  await tmLanguageConvert(OUT_DIR, headers, syntaxFile);
  // await examples(OUT_DIR);
}

init();
