import { IMetric, IntervalConfig } from "../types";
import { ParseResult } from '@babel/parser';
import { ArrowFunctionExpression, File, FunctionDeclaration, traverse } from '@babel/types';
import { returnMetricValueWithDesc } from "../utils";

export default class NumberOfInputOutputParameters implements IMetric {
  private _name = 'Number of input & output parameters';
  private _info = 'Number of input & output parameters in the function';
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
    let numberOfInputParams = 0;
    let isReturn = null;

    let functions: Array<FunctionDeclaration | ArrowFunctionExpression> = [];

    traverse(program, {
      enter(node) {
        if (node.type === 'FunctionDeclaration' || node.type === 'ArrowFunctionExpression')
          functions.push(node);
        else if (node.type === 'ReturnStatement')
          isReturn = true;
      }
    });

    for (const func of functions) {
      numberOfInputParams += func.params.length;
    }
    
    return returnMetricValueWithDesc(numberOfInputParams + (isReturn ? 1 : 0), this._intervals);
  } 
}