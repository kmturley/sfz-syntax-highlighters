import * as convert from 'xml-js';
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { CategoryOpcode } from './types/syntax';

async function fileGet(url: string): Promise<string> {
  console.log('⤓', url);
  return fetch(url).then((res: any) => res.text());
}

async function fileGetJson(url: string): Promise<any> {
  console.log('⤓', url);
  return fetch(url).then((res: any) => res.json());
}

function fileLoad(filePath: string): any {
  if (fs.existsSync(filePath)) {
    console.log('⎋', filePath);
    return fs.readFileSync(filePath).toString();
  }
  return false;
}

function fileLoadJson(filePath: string): any {
  if (fs.existsSync(filePath)) {
    console.log('⎋', filePath);
    return JSON.parse(fs.readFileSync(filePath).toString());
  }
  return false;
}

function fileSave(dir: string, filename: string, data: string) {
  console.log('+', `${dir}/${filename}`);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}/${filename}`, data);
}

function findOpcodes(data: any): CategoryOpcode[] {
  let opcodes: any = [];
  if (Array.isArray(data)) {
    for (const v of data) {
      opcodes = opcodes.concat(findOpcodes(v));
    }
  } else if (typeof data === 'object') {
    for (const [k, v] of Object.entries(data)) {
      if (k === 'opcodes') {
        opcodes = opcodes.concat(v);
      } else {
        opcodes = opcodes.concat(findOpcodes(v));
      }
    }
  }
  return opcodes;
}

function jsToXml(file: any): any {
  return convert.js2xml(file, { compact: true, spaces: 2 });
}

function jsToYaml(file: any): any {
  return yaml.dump(file);
}

function xmlToJs(file: string): any {
  return convert.xml2js(file, { compact: true });
}

function yamlToJs(file: string): any {
  return yaml.load(file);
}

export { fileGet, fileGetJson, fileLoad, fileLoadJson, fileSave, findOpcodes, jsToXml, jsToYaml, xmlToJs, yamlToJs };
