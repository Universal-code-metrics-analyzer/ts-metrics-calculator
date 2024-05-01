import { AbstractMetric, IntervalConfig } from "../types";
import { returnMetricValueWithDesc } from "../utils";
import NumberOfInputOutputParameters from './NumberOfInputOutputParameters';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class PotentialProgramVolume extends AbstractMetric<ParseResult<File>> {
  readonly name = 'Potential program volume';
  readonly info = 'Potential program volume - ideal volume of the program (compared to ProgramVolume - real volume of the program)';
  readonly scope = 'function';
  
  constructor(config: IntervalConfig[]) {
    super(config);
  }

  public run(program: ParseResult<File>) {
    const numberOfInputOutputParameters = new NumberOfInputOutputParameters(this._intervals).run(program).value;
    return returnMetricValueWithDesc((numberOfInputOutputParameters + 2) * Math.log2(numberOfInputOutputParameters + 2), this._intervals);
  } 
}