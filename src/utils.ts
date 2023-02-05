import * as convert from 'xml-js';
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

async function fileGet(url: string): Promise<string> {
  console.log('⤓', url);
  return fetch(url).then((res: any) => res.text());
}

async function fileGetJson(url: string): Promise<any> {
  console.log('⤓', url);
  return fetch(url).then((res: any) => res.json());
}

function fileLoadJson(filePath: string): any {
  if (fs.existsSync(filePath)) {
    console.log('⎋', filePath);
    return JSON.parse(fs.readFileSync(filePath).toString());
  }
  return false;
}
function fileSave(dir: string, filename: string, data: string) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}/${filename}`, data);
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

export { fileGet, fileGetJson, fileLoadJson, fileSave, jsToXml, jsToYaml, xmlToJs, yamlToJs };
