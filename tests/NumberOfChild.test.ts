import { IBlob, IMetric, IModule } from "../types";
import { findPathInFileTree, getAllBlobsFromTree } from "../utils";
import { parse } from '@babel/parser';
import { traverse } from '@babel/types';

export default class NumberOfChild implements IMetric {
  private _name = 'Number Of Child';
  private _info = 'Number Of Child';
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
    let numberOfChildren = 0;
    const targetClassName = targetClassPath.split('/').at(-1)?.split('.').at(0);
    const blobs = getAllBlobsFromTree(program, ['ts', 'js']);

    for (const blob of blobs) {
      if (blob.path !== targetClassPath) {
        const ast = parse(blob.content, { 
          plugins: ['jsx', 'typescript', 'estree'], sourceType: 'module' 
        });

        traverse(ast, { 
          enter(node) {
            if (node.type === 'ImportDeclaration') {
              let isClassImported = false;
              for (const specifier of node.specifiers) {
                if (specifier.local.name === targetClassName) {
                  let absolutePath = '';
                  const relativePath = node.source.value.split('/');
                  const _relativePath = [...relativePath];
                  const currentDir = blob.path.split('/');
                  const extension = '.' + currentDir.at(-1)?.split('.').at(-1);

                  for (let i = 0; i < relativePath.length; i++) {
                    if (relativePath[i] === '.') {
                      currentDir.pop();
                      currentDir.push(targetClassName + extension);
                      absolutePath = currentDir.join('/');
                      if (absolutePath === targetClassPath) isClassImported = true;
                      break;
                    } else if (relativePath[i] === '..') {
                      if (i === 0) currentDir.pop();
                      currentDir.pop();
                      _relativePath.shift();
                    } else {
                      absolutePath = currentDir.join('/') + '/' + _relativePath.join('/') + extension;
                      if (absolutePath === targetClassPath) isClassImported = true;
                      break;
                    }
                  }
                }
              }

              if (isClassImported) {
                traverse(ast, { 
                  enter(node) {
                    if (node.type === 'ClassDeclaration' && node.superClass) {
                      //@ts-ignore
                      if (targetClassName === node.superClass.name) numberOfChildren++;
                    }
                }});
              }
            }
        }});
      }
    }
    
    return { value: numberOfChildren };
  } 
}