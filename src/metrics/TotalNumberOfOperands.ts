import { IMetric, IntervalConfig } from "../types";
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';
import { returnMetricValueWithDesc } from "../utils";

export default class TotalNumberOfOperands implements IMetric {
  private _name = 'Total number of operands';
  private _info = 'Total number of operands in the program';
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
    let operandsCount = 0;
    if (program.tokens) {
      for (const token of program.tokens) {
        if (token.type.keyword === undefined 
          && token.value 
          && (token.type.label === 'name' || token.type.label === 'string') 
          && token.value !== 'let') operandsCount++;
      }
    }
    return returnMetricValueWithDesc(operandsCount, this._intervals);
  } 
}