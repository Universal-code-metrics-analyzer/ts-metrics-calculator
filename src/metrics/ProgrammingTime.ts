import { IMetric } from "../types";
import ProgramEffort from "./ProgramEffort";
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class ProgramingTime implements IMetric {
  private _name = 'Programing Time';
  private _info = 'Programing Time';
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
    return { value: new ProgramEffort().run(program).value / 18 };
  } 
}