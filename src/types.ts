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
  name: string;     // metric name, must match classname of corresponding metric
  intervals: {      // ORDERED list of intervals that allows to evalutate metric value
    valueMin: number | null;
    valueMax: number | null; 
    description: string; 
  }[];
}

export type { IMetric, IMetricResult, IFileTreeNode, IBlob, IModule, IConfig, IMetricConfig };