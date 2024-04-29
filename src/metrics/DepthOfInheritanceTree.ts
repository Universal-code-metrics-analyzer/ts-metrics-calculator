import { IBlob, IMetric, IModule } from "../types";
import { findPathInFileTree } from "../utils";
import { parse } from '@babel/parser';
import { traverse } from '@babel/types';

export default class DepthOfInheritanceTree implements IMetric {
  private _name = 'Depth Of Inheritance Tree';
  private _info = 'Depth Of Inheritance Tree';
  private _scope = 'module';

  public get name() {
    return this._name;
  }

  public get info() {
    return this._info;
  }

  public get scope() {
    return this._scope as any;
  }

  public run(program: IModule, targetClassPath: string) {
    let depthOfInheritanceTree = getDepth(program, targetClassPath, 0);

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
            //@ts-ignore
            parentClassname = node.superClass.name;
          }
      }});
  
      if (parentClassname) {
        traverse(ast, { 
          enter(node) {
            if (node.type === 'ImportDeclaration') {
              for (const specifier of node.specifiers) {
                if (specifier.local.name === parentClassname) {
                  // TODO: you do not take index.ts exports into account here
                  let absolutePath = '';
                  let relativePath = node.source.value.split('/');
                  let _relativePath = [...relativePath];
                  let currentDir = targetClassPath.split('/');
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
    
    return { value: depthOfInheritanceTree, description: "A low number for depth implies less complexity but also the possibility of less code reuse through inheritance. A high number for depth implies more potential for code reuse through inheritance but also higher complexity with a higher probability of errors in the code." };
  } 
}