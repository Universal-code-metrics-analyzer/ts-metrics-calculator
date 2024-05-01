import { AbstractMetric, IntervalConfig } from "../types";
import { returnMetricValueWithDesc } from "../utils";
import ImplemetationLength from './ImplementationLength';
import ProgramDictionary from './ProgramDictionary';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class ProgramVolume extends AbstractMetric<ParseResult<File>> {
  readonly name = 'Program volume';
  readonly info = 'Program volume';
  readonly scope = 'function';
  
  constructor(config: IntervalConfig[]) {
    super(config);
  }

  public run(program: ParseResult<File>) {
    const value = new ImplemetationLength(this._intervals).run(program).value * Math.log2(new ProgramDictionary(this._intervals).run(program).value);
    return returnMetricValueWithDesc(value, this._intervals);
  } 
}