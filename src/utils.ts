import { IBlob, IMetricResult, IModule, ITreeMetricsResults, IntervalConfig } from "./types";

export function findPathInFileTree(path: string, tree: IModule): IModule | IBlob | null {
  let result = null;
  if (tree.path === path) {
    return tree;
  } else {
    if (!result) {
      for (const node of tree.blobs) {
        if (node.path === path) return node;
      }
    }

    if (tree.trees) {
      for (const node of tree.trees) {
        result = findPathInFileTree(path, node);
        if (result) break;
      }
    }
  }
  return result;
}

export function getAllBlobsFromTree(tree: IModule, extentions: string[]): IBlob[] {
  let result: IBlob[] = [];

  if (tree) {
    if (tree.trees) {
      for (const node of tree.trees) {
        result = result.concat(getAllBlobsFromTree(node, extentions));
      }
    }
  
    for (const node of tree.blobs) {
      if (extentions.includes(node.name.split('.').at(-1) as string)) {
        result.push(node);
      }
    }
  }

  return result;
}

export function getAllModulesFromTree(tree: IModule): IModule[] {
  let result: IModule[] = [tree];
  if (tree && tree.trees) {
    for (const node of tree.trees) {
      result = result.concat(getAllModulesFromTree(node));
    }
  }
  return result;
}

export function returnMetricValueWithDesc(value: number, intervals: IntervalConfig[]): IMetricResult {
  for (const interval of intervals) {
    if (value >= (interval.valueMin === null ? Number.NEGATIVE_INFINITY : interval.valueMin) 
      && value <= (interval.valueMax === null ? Number.POSITIVE_INFINITY : interval.valueMax)) {
      return { value, description: interval.description, level: interval.level };
    }
  }
  return { value, description: '', level: 'green' };
}

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;
export function getParamNames(func: (...args: any) => any) {
  const fnStr = func.toString().replace(STRIP_COMMENTS, '');
  let params: any = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if (params === null) params = [];
  return params;
}

export function inputTreeToOutputTree(inputTree: IModule): ITreeMetricsResults {
  return {
    type: inputTree.type,
    name: inputTree.path,
    path: inputTree.path,
    metricResults: [],
    trees: inputTree.trees.map(elem => inputTreeToOutputTree(elem)),
    blobs: inputTree.blobs.map(elem => {
      return {
        type: elem.type,
        name: elem.name,
        path: elem.path,
        metricResults: []
      }
    })
  };
}