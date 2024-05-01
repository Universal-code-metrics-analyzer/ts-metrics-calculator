import { AbstractMetric, IModule, IntervalConfig } from "../types";
import { returnMetricValueWithDesc } from "../utils";
import AfferentCoupling from "./AfferentCoupling";
import EfferentCoupling from "./EfferentCoupling";

export default class Instability extends AbstractMetric<IModule> {
  readonly name = 'Instability';
  readonly info = 'Instability (Martin metric)';
  readonly scope = 'module';
  
  constructor(config: IntervalConfig[]) {
    super(config);
  }

  public run(program: IModule, targetModulePath: string) {
    const afferentCoupling = new AfferentCoupling(this._intervals).run(program, targetModulePath).value;
    const efferentCoupling = new EfferentCoupling(this._intervals).run(program, targetModulePath).value;
    return returnMetricValueWithDesc(efferentCoupling / (efferentCoupling + afferentCoupling), this._intervals);
  } 
}