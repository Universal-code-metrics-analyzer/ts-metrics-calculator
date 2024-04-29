import { IMetric, IntervalConfig } from "../types";
import { ParseResult } from '@babel/parser';
import { traverse, File } from '@babel/types';
import { returnMetricValueWithDesc } from "../utils";

export default class NumberOfMethods implements IMetric {
  private _name = 'Number Of Methods';
  private _info = 'Number Of Methods';
  private _scope = 'class';
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
    
    let MethodsCount = 0;

    traverse(program, { 
      enter(node) {
        if (node.type === 'ClassBody') {
          for (const item of node.body) {
            //@ts-ignore
            if (item.type === 'MethodDefinition') MethodsCount++;
          }
        }
    }});
    return returnMetricValueWithDesc(MethodsCount, this._intervals);
  } 
}