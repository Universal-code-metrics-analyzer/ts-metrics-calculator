import esprima from 'esprima';

export interface IMetric {
  name: string;
  info: string;
  scope: 'any' | 'module' | 'class' | 'function';
  run: (program: esprima.Program) => IMetricResult;
}

export interface IMetricResult {
  value: number | number[];
  description?: string;
}