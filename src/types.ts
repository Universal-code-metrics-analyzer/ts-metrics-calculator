import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export interface IMetric {
  name: string;
  info: string;
  scope: 'any' | 'module' | 'class' | 'function';
  run: (program: any, ...args: any[]) => IMetricResult;
}

export interface IMetricResult {
  value: any;
  description?: string;
}

export interface IFileTreeNode {
  type: 'tree' | 'blob';
  name: string;
  path: string;
}

export interface IBlob extends IFileTreeNode {
  content: string;
}

export interface IModule extends IFileTreeNode {
  trees: IModule[];
  blobs: IBlob[];
}

export interface IConfig {
  rootDir?: string;
  extentions: Array<'ts' | 'js'>;
}