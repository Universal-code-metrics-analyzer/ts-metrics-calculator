import { IMetric, IntervalConfig } from '../types';
// @ts-ignore
import * as Styx from 'styx';
import { returnMetricValueWithDesc } from '../utils';

export default class McCabeCC implements IMetric {
  private _name = 'McCabe cylomatic complexity';
  private _info =
    'm - number of edges\nm - number of nodes\nvalue - cylomatic complexity (Z)';
  private _scope = 'function';
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

  public run(programFlow: typeof Styx.parse) {
    const m = programFlow.flowGraph.edges.length, n = programFlow.flowGraph.nodes.length;
    const result = m - n + 2;
    return returnMetricValueWithDesc(result, this._intervals);
  }
}
