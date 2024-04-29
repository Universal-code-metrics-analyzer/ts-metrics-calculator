import { IMetric, IModule } from "../types";
import AfferentCoupling from "./AfferentCoupling";
import EfferentCoupling from "./EfferentCoupling";

export default class Instability implements IMetric {
  private _name = 'Instability';
  private _info = 'Instability (Martin metric)';
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
    const afferentCoupling = new AfferentCoupling().run(program, targetModulePath).value;
    const efferentCoupling = new EfferentCoupling().run(program, targetModulePath).value;
    return { value: efferentCoupling / (efferentCoupling + afferentCoupling) };
  } 
}