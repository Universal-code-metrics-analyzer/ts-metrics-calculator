import esprima from 'esprima';
import { IMetric } from "../types";
import { findFirstNodeInAst } from '../utils';

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

  public run(program: esprima.Program) {
    let numberOfInputParams = 0;
    let isReturn = null;
    let func = findFirstNodeInAst(program, 'FunctionDeclaration');
    if (!func) func = findFirstNodeInAst(program, 'ArrowFunctionExpression');

    if (func) {
      numberOfInputParams = func.params.length;
      isReturn = findFirstNodeInAst(program, 'ReturnStatement');
    } else {
      throw Error("Invalid scope: provided source code is not a function or arrow function");
    }
    return { value: numberOfInputParams + (isReturn ? 1 : 0) };
  } 
}