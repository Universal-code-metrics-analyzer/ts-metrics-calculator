import esprima from 'esprima';
// @ts-ignore
import * as Styx from 'styx';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export interface IMetric {
  name: string;
  info: string;
  scope: 'any' | 'module' | 'class' | 'function';
  run: (program: ParseResult<File>, ...args: any[]) => IMetricResult;
}

export interface IMetricResult {
  value: any;
  description?: string;
}
