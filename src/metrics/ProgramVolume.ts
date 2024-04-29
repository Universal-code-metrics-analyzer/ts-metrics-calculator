import { IMetric, IntervalConfig } from "../types";
import { returnMetricValueWithDesc } from "../utils";
import ImplemetationLength from './ImplementationLength';
import ProgramDictionary from './ProgramDictionary';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class ProgramVolume implements IMetric {
  private _name = 'Program volume';
  private _info = 'Program volume';
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
    const value = new ImplemetationLength(this._intervals).run(program).value * Math.log2(new ProgramDictionary(this._intervals).run(program).value);
    return returnMetricValueWithDesc(value, this._intervals);
  } 
}