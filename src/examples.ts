import { Gedit } from './types/gedit';
import { Syntax } from './types/syntax';
import { fileGet, fileGetJson, fileSave, xmlToJs, yamlToJs } from './utils';

const URL_GEDIT: string = 'https://raw.githubusercontent.com/sfztools/syntax-highlighting-gedit/master/sfz.lang';
const URL_SYNTAX: string =
  'https://raw.githubusercontent.com/sfzformat/sfzformat.github.io/source/_data/sfz/syntax.yml';
const URL_TMLANG: string = 'https://raw.githubusercontent.com/jokela/vscode-sfz/master/syntaxes/sfz.tmLanguage.json';

async function examples(path: string) {
  // Get gedit file and convert to json
  const geditLang: string = await fileGet(URL_GEDIT);
  fileSave(path, 'gedit.lang', geditLang);
  const geditFile: Gedit = xmlToJs(geditLang);
  fileSave(path, 'gedit.json', JSON.stringify(geditFile, null, 2));

  // Get syntax file and convert to json
  const syntaxYaml: string = await fileGet(URL_SYNTAX);
  fileSave(path, 'syntax.yml', syntaxYaml);
  const syntaxFile: Syntax = yamlToJs(syntaxYaml);
  fileSave(path, 'syntax.json', JSON.stringify(syntaxFile, null, 2));

  // Get tmLanguage file
  const tmLanguageFile: any = await fileGetJson(URL_TMLANG);
  fileSave(path, 'tmLanguage.json', JSON.stringify(tmLanguageFile, null, 2));
}

export { examples };
