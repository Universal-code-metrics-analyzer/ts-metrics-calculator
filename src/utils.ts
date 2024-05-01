import { IBlob, IMetricResult, IModule, IntervalConfig } from "./types";

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

export function returnMetricValueWithDesc(value: number, intervals: IntervalConfig[]): IMetricResult {
  for (const interval of intervals) {
    if (value >= (interval.valueMin === null ? Number.NEGATIVE_INFINITY : interval.valueMin) 
      && value <= (interval.valueMax === null ? Number.POSITIVE_INFINITY : interval.valueMax)) {
      return { value, description: interval.description };
    }
  }
  return { value, description: '' };
}