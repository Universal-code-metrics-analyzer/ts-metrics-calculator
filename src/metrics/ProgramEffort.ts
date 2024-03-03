import esprima from 'esprima';
import { IMetric } from "@/types";
import PotentialProgramVolume from './PotentialProgramVolume';
import ProgramLevel from './ProgramLevel';

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

  public run(program: esprima.Program) {
    return { value: new PotentialProgramVolume().run(program).value / new ProgramLevel().run(program).value };
  } 
}