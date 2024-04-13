import { IMetric } from "../types";
import { traverse } from '@babel/types';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class CouplingBetweenObjectClasses implements IMetric {
  private _name = 'Coupling Between Object Classes';
  private _info = 'Coupling Between Object Classes';
  private _scope = 'class';

  public get name() {
    return this._name;
  }

  public get info() {
    return this._info;
  }

  public get scope() {
    return this._scope as any;
  }

  public run(program: ParseResult<File>) {
    const importedClasses: {name: string, isUsed: boolean}[] = [];
    let isClass = false;
    let numberOfUsages = 0;

    traverse(program, { 
      enter(node) {
        if (node.type === 'ImportDeclaration') {
          for (const item of node.specifiers) {
            if (item.local.name[0] === item.local.name[0].toUpperCase()) {
              importedClasses.push({name: item.local.name, isUsed: false});
            }
          }
        }

        if (node.type === 'ClassDeclaration') {
          isClass = true;
        }
    }});

    if (!isClass) throw Error("This file does not include any classes");

    traverse(program, { 
      enter(node) {
        if (node.type === 'Identifier') {
          const indexInImportedClasses = importedClasses.findIndex(elem => elem.name === node.name && !elem.isUsed);
          if (indexInImportedClasses !== -1) {
            numberOfUsages++;
            importedClasses[indexInImportedClasses].isUsed = true;
          }
        }
    }});
    
    return { value: numberOfUsages };
  } 
}