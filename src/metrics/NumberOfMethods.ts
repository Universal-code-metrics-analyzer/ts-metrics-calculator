import { AbstractMetric, IntervalConfig } from "../types";
import { ParseResult } from '@babel/parser';
import { traverse, File } from '@babel/types';
import { returnMetricValueWithDesc } from "../utils";

export default class NumberOfMethods extends AbstractMetric<ParseResult<File>> {
  readonly name = 'Number Of Methods';
  readonly info = 'Number Of Methods';
  readonly scope = 'class';
  
  constructor(config: IntervalConfig[]) {
    super(config);
  }

  public run(program: ParseResult<File>) {
    
    let MethodsCount = 0;

    traverse(program, { 
      enter(node) {
        if (node.type === 'ClassBody') {
          for (const item of node.body) {
            //@ts-expect-error ignore
            if (item.type === 'MethodDefinition') MethodsCount++;
          }
        }
    }});
    return returnMetricValueWithDesc(MethodsCount, this._intervals);
  } 
}