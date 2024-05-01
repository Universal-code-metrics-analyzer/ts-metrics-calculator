import { AbstractMetric, IntervalConfig } from "../types";
import { returnMetricValueWithDesc } from "../utils";
import TotalNumberOfOperands from './TotalNumberOfOperands';
import TotalNumberOfOperators from './TotalNumberOfOperators';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class ImplemetationLength extends AbstractMetric<ParseResult<File>> {
  readonly name = 'Implementation length';
  readonly info = 'Implementation length = TotalNumberOfOperands + TotalNumberOfOperators';
  readonly scope = 'function';
  
  constructor(config: IntervalConfig[]) {
    super(config);
  }

  public run(program: ParseResult<File>) {
    const value = new TotalNumberOfOperands(this._intervals).run(program).value + new TotalNumberOfOperators(this._intervals).run(program).value;
    return returnMetricValueWithDesc(value, this._intervals);
  } 
}