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

    // just get all imported and used classes
    const importedClasses = [];

    traverse(program, { 
      enter(node) {
        if (node.type === 'ImportDeclaration') {
          
        }
    }});
    
    return { value: importedClasses.length };
  } 
}