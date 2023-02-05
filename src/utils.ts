import * as convert from 'xml-js';
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { SyntaxFile } from './types';

async function fileLoad(url: string): Promise<string> {
  console.log('⤓', url);
  return fetch(url).then((res: any) => res.text());
}

function fileSave(dir: string, filename: string, data: string) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}/${filename}`, data);
}

function xmlConvert(file: string): any {
  return convert.xml2js(file, { compact: true });
}

function yamlConvert(file: string): any {
  return yaml.load(file);
}

export { fileLoad, fileSave, xmlConvert, yamlConvert };
