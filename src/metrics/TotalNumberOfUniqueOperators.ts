import { AbstractMetric, IntervalConfig } from "../types";
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';
import { returnMetricValueWithDesc } from "../utils";

export default class TotalNumberOfUniqueOperators extends AbstractMetric<ParseResult<File>> {
  readonly name = 'Total number of unique operators';
  readonly info = 'Total number of unique operators in the program';
  readonly scope = 'function';
  
  constructor(config: IntervalConfig[]) {
    super(config);
  }

  public run(program: ParseResult<File>) {
    const uniqueOperators: string[][] = [];
    if (program.tokens) {
      for (const token of program.tokens) {
        if (((token.type.keyword 
          || token.type.binop)
          || (token.type.label !== 'name' && token.type.label !== 'string')
          || token.value === 'let') 
          && !uniqueOperators.find((elem) => elem[0] === token.value && elem[1] === token.type.label)) {
          uniqueOperators.push([token.value, token.type.label]);
        } 
      }
    }
    return returnMetricValueWithDesc(uniqueOperators.length, this._intervals);
  } 
}