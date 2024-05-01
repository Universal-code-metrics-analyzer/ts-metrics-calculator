import { AbstractMetric, IntervalConfig } from "../types";
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';
import { returnMetricValueWithDesc } from "../utils";

export default class TotalNumberOfOperators extends AbstractMetric<ParseResult<File>> {
  readonly name = 'Total number of operators';
  readonly info = 'Total number of operators in the program';
  readonly scope = 'function';
  
  constructor(config: IntervalConfig[]) {
    super(config);
  }

  public run(program: ParseResult<File>) {
    let operatorsCount = 0;
    if (program.tokens) {
      for (const token of program.tokens) {
        if ((token.type.keyword 
          || token.type.binop)
          || (token.type.label !== 'name' && token.type.label !== 'string')
          || token.value === 'let') operatorsCount++;
      }
    }
    return returnMetricValueWithDesc(operatorsCount, this._intervals);
  } 
}