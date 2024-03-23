import { IMetric } from "@/types";
import ImplemetationLength from './ImplementationLength';
import ProgramDictionary from './ProgramDictionary';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class ProgramVolume implements IMetric {
  private _name = 'Program volume';
  private _info = 'Program volume';
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
    return { value: new ImplemetationLength().run(program).value * Math.log2(new ProgramDictionary().run(program).value) };
  } 
}