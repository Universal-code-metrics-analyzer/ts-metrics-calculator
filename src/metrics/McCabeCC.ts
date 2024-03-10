import { IMetric } from '@/types';
// @ts-ignore
import * as Styx from 'styx';

export default class McCabeCC implements IMetric {
  private _name = 'McCabe cylomatic complexity';
  private _info =
    'm - number of edges\nm - number of nodes\nvalue - cylomatic complexity (Z)';
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

  public run(programFlow: typeof Styx.parse) {
    const m = programFlow.flowGraph.edges.length,
      n = programFlow.flowGraph.nodes.length;

    return {
      m,
      n,
      value: m - n + 2,
    };
  }
}
