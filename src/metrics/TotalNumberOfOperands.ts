import { AbstractMetric, IntervalConfig } from "../types";
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';
import { returnMetricValueWithDesc } from "../utils";

export default class TotalNumberOfOperands extends AbstractMetric<ParseResult<File>> {
  readonly name = 'Total number of operands';
  readonly info = 'Total number of operands in the program';
  readonly scope = 'function';
  
  constructor(config: IntervalConfig[]) {
    super(config);
  }

  public run(program: ParseResult<File>) {
    let operandsCount = 0;
    if (program.tokens) {
      for (const token of program.tokens) {
        if (token.type.keyword === undefined 
          && token.value 
          && (token.type.label === 'name' || token.type.label === 'string') 
          && token.value !== 'let') operandsCount++;
      }
    }
    return returnMetricValueWithDesc(operandsCount, this._intervals);
  } 
}