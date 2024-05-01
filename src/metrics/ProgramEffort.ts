import { AbstractMetric, IntervalConfig } from "../types";
import { returnMetricValueWithDesc } from "../utils";
import PotentialProgramVolume from './PotentialProgramVolume';
import ProgramLevel from './ProgramLevel';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class ProgramEffort extends AbstractMetric<ParseResult<File>> {
  readonly name = 'Program effort';
  readonly info = 'Program effort = PotentialProgramVolume / ProgramLevel';
  readonly scope = 'function';
 
  constructor(config: IntervalConfig[]) {
    super(config);
  }

  public run(program: ParseResult<File>) {
    return returnMetricValueWithDesc(new PotentialProgramVolume(this._intervals).run(program).value / new ProgramLevel(this._intervals).run(program).value, this._intervals);
  } 
}