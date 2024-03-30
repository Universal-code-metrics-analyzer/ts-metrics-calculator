import { IBlob, IFileTreeNode, IModule } from "./types";

export function findPathInFileTree(path: string, tree: IModule): IModule | IFileTreeNode | null {
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

export function getAllBlobsFromTree(tree: IModule, extention: string): IBlob[] {
  let result: IBlob[] = [];

  if (tree) {
    if (tree.trees) {
      for (const node of tree.trees) {
        result = result.concat(getAllBlobsFromTree(node, extention));
      }
    }
  
    for (const node of tree.blobs) {
      if (node.name.split('.').at(-1) === extention) {
        result.push(node);
      }
    }
  }

  return result;
}