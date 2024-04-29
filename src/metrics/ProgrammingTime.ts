import { IMetric, IntervalConfig } from "../types";
import { returnMetricValueWithDesc } from "../utils";
import ProgramEffort from "./ProgramEffort";
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class ProgramingTime implements IMetric {
  private _name = 'Programing Time';
  private _info = 'Programing Time = ProgramEffort / Straud number (average value of Straud number is 18). Represents hours required to write a given program';
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
    return returnMetricValueWithDesc(new ProgramEffort(this._intervals).run(program).value / 18, this._intervals);
  } 
}