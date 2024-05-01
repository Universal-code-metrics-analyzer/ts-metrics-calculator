import { AbstractMetric, IModule, IntervalConfig } from "../types";
import Instability from "./Instability";
import Abstractness from "./Abstractness";
import { returnMetricValueWithDesc } from "../utils";

export default class NormalizedDistanceFromMainSequence extends AbstractMetric<IModule> {
  readonly name = 'Normalized Distance From Main Sequence';
  readonly info = 'Normalized distance from main sequence (Martin metric)';
  readonly scope = 'module';
  
  constructor(config: IntervalConfig[]) {
    super(config);
  }

  public run(program: IModule, targetModulePath: string) {
    const instability = new Instability(this._intervals).run(program, targetModulePath).value;
    const abstractness = new Abstractness(this._intervals).run(program, targetModulePath).value;
    return returnMetricValueWithDesc(Math.abs(instability + abstractness - 1), this._intervals);
  } 
}