import fetch from 'node-fetch';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { SyntaxFile } from './types';

const SYNTAX_URL: string =
  'https://raw.githubusercontent.com/sfzformat/sfzformat.github.io/source/_data/sfz/syntax.yml';
const OUT_DIRECTORY: string = './out';

async function syntaxDownload(url: string): Promise<any> {
  return fetch(url).then((res: any) => res.text());
}

function syntaxConvert(syntaxYaml: string): SyntaxFile {
  return yaml.load(syntaxYaml) as SyntaxFile;
}

async function init() {
  const syntaxYaml: string = await syntaxDownload(SYNTAX_URL);
  const syntaxFile: SyntaxFile = syntaxConvert(syntaxYaml);
  fs.mkdirSync(OUT_DIRECTORY, { recursive: true });
  fs.writeFileSync(`${OUT_DIRECTORY}/syntax.json`, JSON.stringify(syntaxFile, null, 2));
}

init();
