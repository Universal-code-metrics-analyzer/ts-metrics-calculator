import { AbstractMetric, IntervalConfig } from "../types";
import { returnMetricValueWithDesc } from "../utils";
import PotentialProgramVolume from './PotentialProgramVolume';
import ProgramVolume from './ProgramVolume';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class ProgramLevel extends AbstractMetric<ParseResult<File>> {
  readonly name = 'Program level';
  readonly info = 'Program level = PotentialProgramVolume / ProgramVolume';
  readonly scope = 'function';
  
  constructor(config: IntervalConfig[]) {
    super(config);
  }

  public run(program: ParseResult<File>) {
    const value = new PotentialProgramVolume(this._intervals).run(program).value / new ProgramVolume(this._intervals).run(program).value;
    return returnMetricValueWithDesc(value, this._intervals);
  } 
}