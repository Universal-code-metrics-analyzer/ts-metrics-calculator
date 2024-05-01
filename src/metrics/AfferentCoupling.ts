import { AbstractMetric, IBlob, IModule, IntervalConfig } from "../types";
import { getAllBlobsFromTree, returnMetricValueWithDesc } from "../utils";
import { parse } from '@babel/parser';
import { Identifier, traverse } from '@babel/types';

export default class AfferentCoupling extends AbstractMetric<IModule> {
  readonly name = 'Afferent coupling';
  readonly info = 'Afferent coupling (Martin metric)';
  readonly scope = 'module';
  
  constructor(config: IntervalConfig[]) {
    super(config);
  }

  public run(program: IModule, targetModulePath: string) {
    let targetModule = null;
    let afferentCoupling = 0;
    const classesInTargetModule: string[] = [];

    for (const module of program.trees) {
      if (module.path === targetModulePath) {
        targetModule = module;
        const _classesInTargetModule: IBlob[] = getAllBlobsFromTree(targetModule, ['ts', 'js']);

        for (const blob of _classesInTargetModule) {
          const ast = parse(blob.content, { 
            plugins: ['jsx', 'typescript', 'estree'], sourceType: 'module' 
          });

          traverse(ast, { 
            enter(node) {
              if (node.type === 'ExportNamedDeclaration' || 
                node.type === 'ExportDefaultDeclaration') {
                if (node.declaration?.type === 'ClassDeclaration') {
                  classesInTargetModule.push(node.declaration.id?.name as string);
                }
              }
          }});
        }
      }
    }

    for (const module of program.trees) {
      if (module.path !== targetModulePath) {
        const classesInModule = getAllBlobsFromTree(module, ['ts', 'js']);

        for (const blob of classesInModule) {
          const ast = parse(blob.content, { 
            plugins: ['jsx', 'typescript', 'estree'], sourceType: 'module' 
          });

          traverse(ast, { 
            enter(node) {
              if (node.type === 'ImportDeclaration' && node.source.value.includes(targetModulePath.split('/').at(-1) as string)) {
                for (const specifier of node.specifiers) {
                  if (specifier.type === 'ImportSpecifier' && classesInTargetModule.includes((specifier.imported as Identifier).name)) {
                    afferentCoupling++;
                  }
                  if (specifier.type === 'ImportDefaultSpecifier' && classesInTargetModule.includes((specifier.local as Identifier).name)) {
                    afferentCoupling++;
                  }
                }
              }
          }});
        }
      }
    }
    
    return returnMetricValueWithDesc(afferentCoupling, this._intervals);
  } 
}