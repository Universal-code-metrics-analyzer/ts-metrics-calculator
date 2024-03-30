import { IMetric } from "../types";
import TotalNumberOfUniqueOperands from './TotalNumberOfUniqueOperands';
import TotalNumberOfUniqueOperators from './TotalNumberOfUniqueOperators';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class ProgramDictionary implements IMetric {
  private _name = 'Program Dictionary';
  private _info = 'Program Dictionary';
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
    return { value: new TotalNumberOfUniqueOperands().run(program).value + new TotalNumberOfUniqueOperators().run(program).value };
  } 
}