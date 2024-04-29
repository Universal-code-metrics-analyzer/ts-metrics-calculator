import { IMetric, IntervalConfig } from "../types";
import { returnMetricValueWithDesc } from "../utils";
import PotentialProgramVolume from './PotentialProgramVolume';
import ProgramVolume from './ProgramVolume';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class ProgramLevel implements IMetric {
  private _name = 'Program level';
  private _info = 'Program level = PotentialProgramVolume / ProgramVolume';
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
    const value = new PotentialProgramVolume(this._intervals).run(program).value / new ProgramVolume(this._intervals).run(program).value;
    return returnMetricValueWithDesc(value, this._intervals);
  } 
}