import { SyntaxFile } from './types';
import { fileLoad, fileSave, xmlConvert, yamlConvert } from './utils';

const OUT_DIR: string = './out';
const URL_GEDIT: string = 'https://raw.githubusercontent.com/sfztools/syntax-highlighting-gedit/master/sfz.lang';
const URL_SYNTAX: string =
  'https://raw.githubusercontent.com/sfzformat/sfzformat.github.io/source/_data/sfz/syntax.yml';

async function init() {
  // Get gedit file and convert to json
  const geditLang: string = await fileLoad(URL_GEDIT);
  fileSave(OUT_DIR, 'gedit.lang', geditLang);
  const geditFile: any = xmlConvert(geditLang);
  fileSave(OUT_DIR, 'gedit.json', JSON.stringify(geditFile, null, 2));

  // Get syntax file and convert to json
  const syntaxYaml: string = await fileLoad(URL_SYNTAX);
  fileSave(OUT_DIR, 'syntax.yml', syntaxYaml);
  const syntaxFile: SyntaxFile = yamlConvert(syntaxYaml);
  fileSave(OUT_DIR, 'syntax.json', JSON.stringify(syntaxFile, null, 2));
}

init();
