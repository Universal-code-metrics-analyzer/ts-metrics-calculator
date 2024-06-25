import { AbstractMetric, IModule, IntervalConfig } from "../types";
import { getAllBlobsFromTree, returnMetricValueWithDesc } from "../utils";
import { parse } from '@babel/parser';
import { traverse } from '@babel/types';

export default class NumberOfChild extends AbstractMetric<IModule> {
  readonly name = 'Number Of Child';
  readonly info = 'Number of children for the given class';
  readonly scope = 'module';
  
  constructor(config: IntervalConfig[]) {
    super(config);
  }

  public run(program: IModule, targetClassPath: string) {
    let numberOfChildren = 0;
    const targetClassName = targetClassPath.split('/').at(-1)?.split('.').at(0);
    const blobs = getAllBlobsFromTree(program, ['ts', 'js']);

    for (const blob of blobs) {
      if (blob.path !== targetClassPath) {
        const ast = parse(blob.content, { 
          plugins: ['jsx', 'typescript', 'estree', 'decorators'], sourceType: 'module' 
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
                      //@ts-expect-error ignore
                      if (targetClassName === node.superClass.name) numberOfChildren++;
                    }
                }});
              }
            }
        }});
      }
    }
    
    return returnMetricValueWithDesc(numberOfChildren, this._intervals);
  } 
}