import esprima from 'esprima';
// @ts-ignore
import * as Styx from 'styx';

export interface IMetric {
  name: string;
  info: string;
  scope: 'any' | 'module' | 'class' | 'function';
  run: (
    program: esprima.Program,
    programFlow?: typeof Styx.parse
  ) => IMetricResult;
}

export interface IMetricResult {
  value: any;
  description?: string;
}
