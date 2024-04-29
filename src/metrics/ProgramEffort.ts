import { IMetric, IntervalConfig } from "../types";
import { returnMetricValueWithDesc } from "../utils";
import PotentialProgramVolume from './PotentialProgramVolume';
import ProgramLevel from './ProgramLevel';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class ProgramEffort implements IMetric {
  private _name = 'Program effort';
  private _info = 'Program effort = PotentialProgramVolume / ProgramLevel';
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
    return returnMetricValueWithDesc(new PotentialProgramVolume(this._intervals).run(program).value / new ProgramLevel(this._intervals).run(program).value, this._intervals);
  } 
}