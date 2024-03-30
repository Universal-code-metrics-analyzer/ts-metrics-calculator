import { IMetric, IModule } from "../types";
import Instability from "./Instability";
import Abstractness from "./Abstractness";

export default class NormalizedDistanceFromMainSequence implements IMetric {
  private _name = 'Normalized Distance From Main Sequence';
  private _info = 'Normalized Distance From Main Sequence';
  private _scope = 'module';

  public get name() {
    return this._name;
  }

  public get info() {
    return this._info;
  }

  public get scope() {
    return this._scope as any;
  }

  public run(program: IModule, targetModulePath: string) {
    const instability = new Instability().run(program, targetModulePath).value;
    const abstractness = new Abstractness().run(program, targetModulePath).value;
    return { value: Math.abs(instability + abstractness - 1) };
  } 
}