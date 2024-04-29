import { IMetric, IntervalConfig } from "../types";
import { returnMetricValueWithDesc } from "../utils";
import NumberOfInputOutputParameters from './NumberOfInputOutputParameters';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class PotentialProgramVolume implements IMetric {
  private _name = 'Potential program volume';
  private _info = 'Potential program volume - ideal volume of the program (compared to ProgramVolume - real volume of the program)';
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
    const numberOfInputOutputParameters = new NumberOfInputOutputParameters(this._intervals).run(program).value;
    return returnMetricValueWithDesc((numberOfInputOutputParameters + 2) * Math.log2(numberOfInputOutputParameters + 2), this._intervals);
  } 
}