import { IMetric, IntervalConfig } from "../types";
import { returnMetricValueWithDesc } from "../utils";
import TotalNumberOfOperands from './TotalNumberOfOperands';
import TotalNumberOfOperators from './TotalNumberOfOperators';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class ImplemetationLength implements IMetric {
  private _name = 'Implementation length';
  private _info = 'Implementation length = TotalNumberOfOperands + TotalNumberOfOperators';
  private _scope = 'function';
  private _intervals: IntervalConfig[];

  constructor(config: IntervalConfig[]) {
    this._intervals = config
  }

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
    const value = new TotalNumberOfOperands(this._intervals).run(program).value + new TotalNumberOfOperators(this._intervals).run(program).value;
    return returnMetricValueWithDesc(value, this._intervals);
  } 
}