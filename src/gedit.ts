import { DefinitionsContext, Gedit } from './types/gedit';
import { CategoryOpcode, Syntax } from './types/syntax';
import { fileLoadJson, fileSave, findOpcodes, jsToXml } from './utils';

async function geditConvert(path: string, headers: string[], syntaxFile: Syntax) {
  const opcodes: CategoryOpcode[] = findOpcodes(syntaxFile);
  const geditTemplate: Gedit = await fileLoadJson('./src/templates/gedit.json');
  fileSave(path, 'gedit-original.json', JSON.stringify(geditTemplate, null, 2));
  fileSave(path, 'gedit-original.lang', jsToXml(geditTemplate));
  geditTemplate.language.definitions.context.forEach((contextItem: DefinitionsContext) => {
    if (contextItem._attributes.id === 'headers-others') {
      contextItem.keyword = headers
        .map((header: string) => ({ _text: header }))
        .sort((a, b) => a._text.localeCompare(b._text));
    } else if (contextItem._attributes.id === 'opcodes') {
      contextItem.keyword = opcodes
        .map((opcode: CategoryOpcode) => ({ _text: opcode.name }))
        .sort((a, b) => a._text.localeCompare(b._text));
    }
  });
  fileSave(path, 'gedit-modified.json', JSON.stringify(geditTemplate, null, 2));
  fileSave(path, 'gedit-modified.lang', jsToXml(geditTemplate));
}

export { geditConvert };
