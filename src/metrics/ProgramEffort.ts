import { IMetric } from "../types";
import PotentialProgramVolume from './PotentialProgramVolume';
import ProgramLevel from './ProgramLevel';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class ProgramEffort implements IMetric {
  private _name = 'Program effort';
  private _info = 'Program effort';
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
    return { value: new PotentialProgramVolume().run(program).value / new ProgramLevel().run(program).value };
  } 
}