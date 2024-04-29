import { IMetric, IModule, IntervalConfig } from "../types";
import Instability from "./Instability";
import Abstractness from "./Abstractness";
import { returnMetricValueWithDesc } from "../utils";

export default class NormalizedDistanceFromMainSequence implements IMetric {
  private _name = 'Normalized Distance From Main Sequence';
  private _info = 'Normalized distance from main sequence (Martin metric)';
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
    const instability = new Instability(this._intervals).run(program, targetModulePath).value;
    const abstractness = new Abstractness(this._intervals).run(program, targetModulePath).value;
    return returnMetricValueWithDesc(Math.abs(instability + abstractness - 1), this._intervals);
  } 
}