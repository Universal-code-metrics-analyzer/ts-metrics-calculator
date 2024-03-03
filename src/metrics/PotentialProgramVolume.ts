import esprima from 'esprima';
import { IMetric } from "@/types";
import NumberOfInputOutputParameters from './NumberOfInputOutputParameters';

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

  public run(program: esprima.Program) {
    const numberOfInputOutputParameters = new NumberOfInputOutputParameters().run(program).value;
    return { value: (numberOfInputOutputParameters + 2) * Math.log2(numberOfInputOutputParameters + 2) };
  } 
}