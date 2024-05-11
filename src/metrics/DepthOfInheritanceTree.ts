import { AbstractMetric, IBlob, IModule, IntervalConfig } from "../types";
import { findPathInFileTree, returnMetricValueWithDesc } from "../utils";
import { parse } from '@babel/parser';
import { traverse } from '@babel/types';

export default class DepthOfInheritanceTree extends AbstractMetric<IModule> {
  readonly name = 'Depth Of Inheritance Tree';
  readonly info = 'Depth Of Inheritance Tree';
  readonly scope = 'class';
  
  constructor(config: IntervalConfig[]) {
    super(config);
  }

  public run(program: IModule, targetClassPath: string) {
    const depthOfInheritanceTree = getDepth(program, targetClassPath, 0);

    function getDepth(program: IModule, targetClassPath: string, depth: number) {
      let _depth = depth; 
      const file = findPathInFileTree(targetClassPath, program);
  
      if (file?.type !== 'blob') {
        throw Error("Provided path is not a file. Please, specify path to the file");
      }
  
      const ast = parse((file as IBlob).content, { 
        plugins: ['jsx', 'typescript', 'estree'], sourceType: 'module' 
      });
  
      let parentClassname: string | null = null;
      traverse(ast, { 
        enter(node) {
          if (node.type === 'ClassDeclaration' && node.superClass) {
            //@ts-expect-error ignore
            parentClassname = node.superClass.name;
          }
      }});
  
      if (parentClassname) {
        traverse(ast, { 
          enter(node) {
            if (node.type === 'ImportDeclaration') {
              for (const specifier of node.specifiers) {
                if (specifier.local.name === parentClassname) {
                  let absolutePath = '';
                  const relativePath = node.source.value.split('/');
                  const _relativePath = [...relativePath];
                  const currentDir = targetClassPath.split('/');
                  const extension = '.' + currentDir.at(-1)?.split('.').at(-1);

                  for (let i = 0; i < relativePath.length; i++) {
                    if (relativePath[i] === '.') {
                      currentDir.pop();
                      currentDir.push(parentClassname + extension);
                      absolutePath = currentDir.join('/');
                      break;
                    } else if (relativePath[i] === '..') {
                      if (i === 0) currentDir.pop();
                      currentDir.pop();
                      _relativePath.shift();
                    } else {
                      absolutePath = currentDir.join('/') + '/' + _relativePath.join('/') + extension;
                      break;
                    }
                  }

                  _depth = getDepth(program, absolutePath, _depth + 1);
                }
                break;
              }
            }
        }});
      }

      return _depth;
    }    
    
    return returnMetricValueWithDesc(depthOfInheritanceTree, this._intervals);
  } 
}