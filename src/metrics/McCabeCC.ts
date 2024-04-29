import { IMetric } from '../types';
// @ts-ignore
import * as Styx from 'styx';

export default class McCabeCC implements IMetric {
  private _name = 'McCabe cylomatic complexity';
  private _info =
    'm - number of edges\nm - number of nodes\nvalue - cylomatic complexity (Z)';
  private _scope = 'function';

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

    return {
      value: result,
      description: "1 - 10: Simple procedure, little risk. \n11 - 20: More complex, moderate risk. \n21 - 50: Complex, high risk. \n> 50: Untestable code, very high risk"
    };
  }
}
