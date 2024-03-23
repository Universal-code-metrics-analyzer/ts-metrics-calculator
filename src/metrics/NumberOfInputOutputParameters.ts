import { IMetric } from "../types";
import { ParseResult } from '@babel/parser';
import { ArrowFunctionExpression, File, FunctionDeclaration, traverse } from '@babel/types';

export default class NumberOfInputOutputParameters implements IMetric {
  private _name = 'Number of input & output parameters';
  private _info = 'Number of input & output parameters';
  private _scope = 'function';

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
    
    return { value: numberOfInputParams + (isReturn ? 1 : 0) };
  } 
}