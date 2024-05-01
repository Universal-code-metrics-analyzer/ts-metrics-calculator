import { AbstractMetric, IntervalConfig } from "../types";
import { ParseResult } from '@babel/parser';
import { ArrowFunctionExpression, File, FunctionDeclaration, traverse } from '@babel/types';
import { returnMetricValueWithDesc } from "../utils";

export default class NumberOfInputOutputParameters extends AbstractMetric<ParseResult<File>> {
  readonly name = 'Number of input & output parameters';
  readonly info = 'Number of input & output parameters in the function';
  readonly scope = 'function';
  
  constructor(config: IntervalConfig[]) {
    super(config);
  }

  public run(program: ParseResult<File>) {
    let numberOfInputParams = 0;
    let isReturn = null;

    const functions: Array<FunctionDeclaration | ArrowFunctionExpression> = [];

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