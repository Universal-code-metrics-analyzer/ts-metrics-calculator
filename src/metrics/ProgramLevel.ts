import esprima from 'esprima';
import { IMetric } from "@/types";
import PotentialProgramVolume from './PotentialProgramVolume';
import ProgramVolume from './ProgramVolume';

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

  public run(program: esprima.Program) {
    return { value: new PotentialProgramVolume().run(program).value / new ProgramVolume().run(program).value };
  } 
}