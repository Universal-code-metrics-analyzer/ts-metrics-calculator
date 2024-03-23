import { IMetric } from "../types";
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';
import ProgramVolume from "./ProgramVolume";
import McCabeCC from "./McCabeCC";
// @ts-ignore
import * as Styx from 'styx';

export default class MaintainabilityIndex implements IMetric {
  private _name = 'Maintainability Index';
  private _info = 'Maintainability Index proposed by Microsoft https://learn.microsoft.com/en-us/visualstudio/code-quality/code-metrics-maintainability-index-range-and-meaning?view=vs-2022';
  private _scope = 'module';

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
    return { value: Math.max(0, 
      (171 - 5.2 * 
        Math.log(new ProgramVolume().run(program).value) - 0.23 * 
        new McCabeCC().run(programFlow).value - 16.2 * 
        Math.log(program.loc?.end.line as number)) * 100 / 171) };
  } 
}