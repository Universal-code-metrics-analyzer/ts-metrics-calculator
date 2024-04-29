import { IMetric, IntervalConfig } from "../types";
import { returnMetricValueWithDesc } from "../utils";
import TotalNumberOfUniqueOperands from './TotalNumberOfUniqueOperands';
import TotalNumberOfUniqueOperators from './TotalNumberOfUniqueOperators';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class ProgramDictionary implements IMetric {
  private _name = 'Program Dictionary';
  private _info = 'Program Dictionary = TotalNumberOfUniqueOperands + TotalNumberOfUniqueOperands';
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
    const value = new TotalNumberOfUniqueOperands(this._intervals).run(program).value + new TotalNumberOfUniqueOperators(this._intervals).run(program).value;
    return returnMetricValueWithDesc(value, this._intervals);
  } 
}