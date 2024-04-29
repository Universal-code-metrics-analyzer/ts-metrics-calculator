import { IMetric, IntervalConfig } from "../types";
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';
import { returnMetricValueWithDesc } from "../utils";

export default class TotalNumberOfOperators implements IMetric {
  private _name = 'Total number of operators';
  private _info = 'Total number of operators in the program';
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
    let operatorsCount = 0;
    if (program.tokens) {
      for (const token of program.tokens) {
        if ((token.type.keyword 
          || token.type.binop)
          || (token.type.label !== 'name' && token.type.label !== 'string')
          || token.value === 'let') operatorsCount++;
      }
    }
    return returnMetricValueWithDesc(operatorsCount, this._intervals);
  } 
}