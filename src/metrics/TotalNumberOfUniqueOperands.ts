import { AbstractMetric, IntervalConfig } from "../types";
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';
import { returnMetricValueWithDesc } from "../utils";

export default class TotalNumberOfUniqueOperands extends AbstractMetric<ParseResult<File>> {
  readonly name = 'Total number of unique operands';
  readonly info = 'Total number of unique operands in the program';
  readonly scope = 'function';
  
  constructor(config: IntervalConfig[]) {
    super(config);
  }

  public run(program: ParseResult<File>) {
    const uniqueOperands: string[][] = [];
    if (program.tokens) {
      for (const token of program.tokens) {
        if (token.type.keyword === undefined 
          && token.value 
          && (token.type.label === 'name' || token.type.label === 'string') 
          && token.value !== 'let' 
          && !uniqueOperands.find((elem) => elem[0] === token.value && elem[1] === token.type.label)) {
          uniqueOperands.push([token.value, token.type.label]);
        } 
      }
    }
    return returnMetricValueWithDesc(uniqueOperands.length, this._intervals);
  } 
}