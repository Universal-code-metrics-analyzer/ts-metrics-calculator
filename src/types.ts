interface IMetric {
  name: string;
  info: string;
  scope: 'any' | 'module' | 'class' | 'function';
  run: (program: any, ...args: any[]) => IMetricResult;
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
  rootDir?: string;               // specify directory that will be parsed and analyzed
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

export type { IMetric, IMetricResult, IFileTreeNode, IBlob, IModule, IConfig, IMetricConfig, IntervalConfig, ITreeMetricsResults, IBlobMetricsResults, IFinalMetricResult };