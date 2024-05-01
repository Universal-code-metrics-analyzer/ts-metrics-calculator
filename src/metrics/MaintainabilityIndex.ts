import { AbstractMetric, IntervalConfig } from "../types";
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';
import ProgramVolume from "./ProgramVolume";
import McCabeCC from "./McCabeCC";
import { returnMetricValueWithDesc } from "../utils";

export default class MaintainabilityIndex extends AbstractMetric<ParseResult<File>> {
  readonly name = 'Maintainability Index';
  readonly info = 'Maintainability Index proposed by Microsoft https://learn.microsoft.com/en-us/visualstudio/code-quality/code-metrics-maintainability-index-range-and-meaning?view=vs-2022';
  readonly scope = 'module';
  
  constructor(config: IntervalConfig[]) {
    super(config);
  }

  public run(program: ParseResult<File>) {
    const value = Math.max(0, 
      (171 - 5.2 * 
        Math.log(new ProgramVolume(this._intervals).run(program).value) - 0.23 * 
        new McCabeCC(this._intervals).run(program).value - 16.2 * 
        Math.log(program.loc?.end.line as number)) * 100 / 171);

    return returnMetricValueWithDesc(value, this._intervals);
  } 
}