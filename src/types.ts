import { File } from "@babel/types";
import { ParseResult } from '@babel/parser';

abstract class AbstractMetric<C extends ParseResult<File> | IModule> {
  abstract readonly name: string;
  abstract readonly info: string;
  abstract readonly scope: 'module' | 'class' | 'function';
  readonly _intervals: IntervalConfig[];

  constructor(config: IntervalConfig[]) {
    this._intervals = config;
  }

  public abstract run(program: C, targetClassPath?: string, targetModulePath?: string, targetFunctionPath?: string): IMetricResult;
}

interface IMetricResult {
  value: any;
  description?: string;
}

interface IFileTreeNode {
  type: 'tree' | 'blob';
  name: string;
  path: string;
}

interface IBlob extends IFileTreeNode {
  content: string;
}

interface IModule extends IFileTreeNode {
  trees: IModule[];
  blobs: IBlob[];
}

interface IConfig {
  rootDir: string;               // specify directory that will be parsed and analyzed
  extentions: Array<'ts' | 'js'>; // parser will check only specific file extentions
  metrics: IMetricConfig[];       // metrics that should be calculated with specified ranges and limits
}

interface IMetricConfig {
  name: string;                 // metric name, must match classname of corresponding metric
  intervals: IntervalConfig[];  // ORDERED list of intervals that allows to evalutate metric value
}

interface IntervalConfig {
  valueMin: number | null;
  valueMax: number | null; 
  description: string;
}

interface IFinalMetricResult {
	metricName: string
	resultScope: 'module' | 'class' | 'function'
	subjectPath: string
	value: number
	description?: string
}

interface IBlobMetricsResults extends IFileTreeNode {
	metricResults: IFinalMetricResult[];
}

interface ITreeMetricsResults extends IBlobMetricsResults {
	trees: ITreeMetricsResults[];
	blobs: IBlobMetricsResults[];
}

export type { IMetricResult, IFileTreeNode, IBlob, IModule, IConfig, IMetricConfig, IntervalConfig, ITreeMetricsResults, IBlobMetricsResults, IFinalMetricResult };
export { AbstractMetric };