import { IMetric } from "@/types";
import TotalNumberOfOperands from './TotalNumberOfOperands';
import TotalNumberOfOperators from './TotalNumberOfOperators';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class ImplemetationLength implements IMetric {
  private _name = 'Implementation length';
  private _info = 'Implementation length';
  private _scope = 'any';

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
    return { value: new TotalNumberOfOperands().run(program).value + new TotalNumberOfOperators().run(program).value };
  } 
}