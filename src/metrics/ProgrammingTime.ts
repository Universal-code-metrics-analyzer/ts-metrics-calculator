import { AbstractMetric, IntervalConfig } from "../types";
import { returnMetricValueWithDesc } from "../utils";
import ProgramEffort from "./ProgramEffort";
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class ProgrammingTime extends AbstractMetric<ParseResult<File>> {
  readonly name = 'Programming Time';
  readonly info = 'Programming Time = ProgramEffort / Straud number (average value of Straud number is 18). Represents hours required to write a given program';
  readonly scope = 'function';
  
  constructor(config: IntervalConfig[]) {
    super(config);
  }

  public run(program: ParseResult<File>) {
    return returnMetricValueWithDesc(new ProgramEffort(this._intervals).run(program).value / 18, this._intervals);
  } 
}