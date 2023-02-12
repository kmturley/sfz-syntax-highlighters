import { Syntax, Header } from './types/syntax';
import { fileLoad, yamlToJs } from './utils';
import { geditConvert } from './gedit';
import { tmLanguageConvert } from './tmLanguage';
// import { examples } from './examples';

const OUT_DIR: string = './out';

async function init() {
  const syntaxYaml: string = await fileLoad('./src/templates/syntax.yml');
  const syntaxFile: Syntax = yamlToJs(syntaxYaml);
  const headers: string[] = syntaxFile.headers.map((header: Header) => header.name).sort();

  // await examples(OUT_DIR);
  await geditConvert(OUT_DIR, headers, syntaxFile);
  await tmLanguageConvert(OUT_DIR, headers, syntaxFile);
}

init();
