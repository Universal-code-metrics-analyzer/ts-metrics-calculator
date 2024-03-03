import esprima from 'esprima';
import { IMetric } from "@/types";
import ImplemetationLength from './ImplementationLength';
import ProgramDictionary from './ProgramDictionary';

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

  public run(program: esprima.Program) {
    return { value: new ImplemetationLength().run(program).value * Math.log2(new ProgramDictionary().run(program).value) };
  } 
}