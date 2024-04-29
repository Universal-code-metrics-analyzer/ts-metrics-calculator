import { IMetric, IntervalConfig } from "../types";
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';
import ProgramVolume from "./ProgramVolume";
import McCabeCC from "./McCabeCC";
// @ts-ignore
import * as Styx from 'styx';
import { returnMetricValueWithDesc } from "../utils";

export default class MaintainabilityIndex implements IMetric {
  private _name = 'Maintainability Index';
  private _info = 'Maintainability Index proposed by Microsoft https://learn.microsoft.com/en-us/visualstudio/code-quality/code-metrics-maintainability-index-range-and-meaning?view=vs-2022';
  private _scope = 'module';
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

  public run(program: ParseResult<File>, programFlow: typeof Styx.parse) {
    const value = Math.max(0, 
      (171 - 5.2 * 
        Math.log(new ProgramVolume(this._intervals).run(program).value) - 0.23 * 
        new McCabeCC(this._intervals).run(programFlow).value - 16.2 * 
        Math.log(program.loc?.end.line as number)) * 100 / 171);

    return returnMetricValueWithDesc(value, this._intervals);
  } 
}