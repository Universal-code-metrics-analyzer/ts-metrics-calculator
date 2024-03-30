import { IBlob, IMetric, IModule } from "../types";
import { getAllBlobsFromTree } from "../utils";
import { parse } from '@babel/parser';
import { Identifier, traverse } from '@babel/types';

export default class AfferentCoupling implements IMetric {
  private _name = 'Afferent coupling';
  private _info = 'Afferent coupling';
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

  public run(program: IModule, targetModulePath: string) {
    let targetModule = null;
    let afferentCoupling = 0;
    let classesInTargetModule: string[] = [];

    for (const module of program.trees) {
      if (module.path === targetModulePath) {
        targetModule = module;
        const _classesInTargetModule: IBlob[] = getAllBlobsFromTree(targetModule, 'ts');

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
        const classesInModule = getAllBlobsFromTree(module, 'ts');

        for (const blob of classesInModule) {
          const ast = parse(blob.content, { 
            plugins: ['jsx', 'typescript', 'estree'], sourceType: 'module' 
          });

          traverse(ast, { 
            enter(node) {
              if (node.type === 'ImportSpecifier') {
                if (classesInTargetModule.includes((node.imported as Identifier).name)) {
                  afferentCoupling++;
                }
              }
              if (node.type === 'ImportDefaultSpecifier') {
                if (classesInTargetModule.includes((node.local as Identifier).name)) {
                  afferentCoupling++;
                }
              }
          }});
        }
      }
    }
    
    return { value: afferentCoupling };
  } 
}