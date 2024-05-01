import { AbstractMetric, IntervalConfig } from "../types";
import { returnMetricValueWithDesc } from "../utils";
import TotalNumberOfUniqueOperands from './TotalNumberOfUniqueOperands';
import TotalNumberOfUniqueOperators from './TotalNumberOfUniqueOperators';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class ProgramDictionary extends AbstractMetric<ParseResult<File>> {
  readonly name = 'Program Dictionary';
  readonly info = 'Program Dictionary = TotalNumberOfUniqueOperands + TotalNumberOfUniqueOperands';
  readonly scope = 'function';
  
  constructor(config: IntervalConfig[]) {
    super(config);
  }

  public run(program: ParseResult<File>) {
    const value = new TotalNumberOfUniqueOperands(this._intervals).run(program).value + new TotalNumberOfUniqueOperators(this._intervals).run(program).value;
    return returnMetricValueWithDesc(value, this._intervals);
  } 
}