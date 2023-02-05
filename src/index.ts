import { GeditContext, GeditFile } from './types/gedit';
import { SyntaxFile, SyntaxHeader } from './types/syntax';
import { fileGet, fileGetJson, fileLoadJson, fileSave, jsToXml, jsToYaml, xmlToJs, yamlToJs } from './utils';

const OUT_DIR: string = './out';
const URL_GEDIT: string = 'https://raw.githubusercontent.com/sfztools/syntax-highlighting-gedit/master/sfz.lang';
const URL_SYNTAX: string =
  'https://raw.githubusercontent.com/sfzformat/sfzformat.github.io/source/_data/sfz/syntax.yml';
const URL_TMLANG: string = 'https://raw.githubusercontent.com/jokela/vscode-sfz/master/syntaxes/sfz.tmLanguage.json';

async function init() {
  // Get gedit file and convert to json
  const geditLang: string = await fileGet(URL_GEDIT);
  fileSave(OUT_DIR, 'gedit.lang', geditLang);
  const geditFile: GeditFile = xmlToJs(geditLang);
  fileSave(OUT_DIR, 'gedit.json', JSON.stringify(geditFile, null, 2));

  // Get syntax file and convert to json
  const syntaxYaml: string = await fileGet(URL_SYNTAX);
  fileSave(OUT_DIR, 'syntax.yml', syntaxYaml);
  const syntaxFile: SyntaxFile = yamlToJs(syntaxYaml);
  fileSave(OUT_DIR, 'syntax.json', JSON.stringify(syntaxFile, null, 2));

  // Get tmLanguage file
  const tmLanguageFile: any = await fileGetJson(URL_TMLANG);
  fileSave(OUT_DIR, 'tmLanguage.json', JSON.stringify(tmLanguageFile, null, 2));

  // Get gedit template and update values
  const geditTemplate: GeditFile = await fileLoadJson('./src/templates/gedit.json');
  geditTemplate.language.definitions.context.forEach((contextItem: GeditContext) => {
    if (contextItem._attributes.id === 'headers-others') {
      contextItem.keyword = syntaxFile.headers.map((header: SyntaxHeader) => ({ _text: header.name }));
    }
  });
  fileSave(OUT_DIR, 'gedit.modified.json', JSON.stringify(geditTemplate, null, 2));
  fileSave(OUT_DIR, 'gedit.modified.lang', jsToXml(geditTemplate));
}

init();
