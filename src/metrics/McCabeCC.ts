import { AbstractMetric, IntervalConfig } from '../types';
// @ts-expect-error this package has no types
import * as Styx from 'styx';
import { returnMetricValueWithDesc } from '../utils';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class McCabeCC extends AbstractMetric<ParseResult<File>> {
  readonly name = 'McCabe cylomatic complexity';
  readonly info = 'm - number of edges\nm - number of nodes\nvalue - cylomatic complexity (Z)';
  readonly scope = 'function';
  
  constructor(config: IntervalConfig[]) {
    super(config);
  }

  public run(program: ParseResult<File>) {
    const programFlow = Styx.parse(program.program);
    const m = programFlow.flowGraph.edges.length, n = programFlow.flowGraph.nodes.length;
    const result = m - n + 2;
    return returnMetricValueWithDesc(result, this._intervals);
  }
}
