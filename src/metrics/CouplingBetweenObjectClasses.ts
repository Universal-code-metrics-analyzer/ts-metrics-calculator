import { AbstractMetric, IntervalConfig } from "../types";
import { traverse } from '@babel/types';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';
import { returnMetricValueWithDesc } from "../utils";

export default class CouplingBetweenObjectClasses extends AbstractMetric<ParseResult<File>> {
  readonly name = 'Coupling Between Object Classes';
  readonly info = 'Coupling Between Object Classes';
  readonly scope = 'class';
  
  constructor(config: IntervalConfig[]) {
    super(config);
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

    if (isClass) {
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
    }
    
    return returnMetricValueWithDesc(numberOfUsages, this._intervals);
  } 
}