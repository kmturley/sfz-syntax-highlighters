import { DefinitionsContext, Gedit, Prefix } from './types/gedit';
import { CategoryOpcode, Syntax, TypeOpcode } from './types/syntax';
import { fileLoadJson, fileSave, findOpcodes, jsToXml } from './utils';

async function geditConvert(path: string, headers: string[], syntaxFile: Syntax) {
  // Get all opcodes from syntax file.
  const opcodes: CategoryOpcode[] = findOpcodes(syntaxFile);

  // Load the gedit template file and save output.
  const geditTemplate: Gedit = await fileLoadJson('./src/templates/gedit.json');
  fileSave(path, 'gedit-original.json', JSON.stringify(geditTemplate, null, 2));
  fileSave(path, 'gedit-original.lang', jsToXml(geditTemplate));

  // Loop through language definitions and update keywords.
  geditTemplate.language.definitions.context.forEach((contextItem: DefinitionsContext) => {
    if (contextItem._attributes.id === 'headers-others') {
      contextItem.keyword = headers
        .map((header: string) => ({ _text: header }))
        .sort((a, b) => a._text.localeCompare(b._text));
    } else if (contextItem._attributes.id === 'opcodes') {
      const keywords: Prefix[] = [];
      opcodes.forEach((opcode: TypeOpcode) => {
        if (opcode.name.startsWith('*') || opcode.name.startsWith('#')) return;
        keywords.push(geditRegEx(opcode.name));
        if (opcode.modulation?.midi_cc) {
          opcode.modulation.midi_cc.forEach((midi) => keywords.push(geditRegEx(midi.name)));
        }
        if (opcode.modulation?.velocity) {
          opcode.modulation.velocity.forEach((vel) => keywords.push(geditRegEx(vel.name)));
        }
      });
      contextItem.keyword = keywords.sort((a: Prefix, b: Prefix) => a._text.localeCompare(b._text));
    }
  });

  // Save modified versions of the gedit template.
  fileSave(path, 'gedit-modified.json', JSON.stringify(geditTemplate, null, 2));
  fileSave(path, 'gedit-modified.lang', jsToXml(geditTemplate));
}

function geditRegEx(input: string): Prefix {
  // Replace N, X, Y values with regex.
  input = input.replace(/[NXY]+/g, '\\%{N}');
  return { _text: input };
}

export { geditConvert, geditRegEx };
