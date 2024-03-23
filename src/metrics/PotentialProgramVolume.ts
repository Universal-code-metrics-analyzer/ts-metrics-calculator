import { IMetric } from "@/types";
import NumberOfInputOutputParameters from './NumberOfInputOutputParameters';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class PotentialProgramVolume implements IMetric {
  private _name = 'Potential program volume';
  private _info = 'Potential program volume';
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
    const numberOfInputOutputParameters = new NumberOfInputOutputParameters().run(program).value;
    return { value: (numberOfInputOutputParameters + 2) * Math.log2(numberOfInputOutputParameters + 2) };
  } 
}