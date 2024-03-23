import { IMetric } from "@/types";
import PotentialProgramVolume from './PotentialProgramVolume';
import ProgramVolume from './ProgramVolume';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class ProgramLevel implements IMetric {
  private _name = 'Program level';
  private _info = 'Program level';
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
    return { value: new PotentialProgramVolume().run(program).value / new ProgramVolume().run(program).value };
  } 
}