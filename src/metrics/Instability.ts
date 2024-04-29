import { IMetric, IModule, IntervalConfig } from "../types";
import { returnMetricValueWithDesc } from "../utils";
import AfferentCoupling from "./AfferentCoupling";
import EfferentCoupling from "./EfferentCoupling";

export default class Instability implements IMetric {
  private _name = 'Instability';
  private _info = 'Instability (Martin metric)';
  private _scope = 'module';
  private _intervals: IntervalConfig[];

  constructor(config: IntervalConfig[]) {
    this._intervals = config
  }

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
    const afferentCoupling = new AfferentCoupling(this._intervals).run(program, targetModulePath).value;
    const efferentCoupling = new EfferentCoupling(this._intervals).run(program, targetModulePath).value;
    return returnMetricValueWithDesc(efferentCoupling / (efferentCoupling + afferentCoupling), this._intervals);
  } 
}