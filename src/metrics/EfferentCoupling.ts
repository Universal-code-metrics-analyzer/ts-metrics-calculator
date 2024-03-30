import { IBlob, IMetric, IModule } from "../types";
import { getAllBlobsFromTree } from "../utils";
import { parse } from '@babel/parser';
import { Identifier, traverse } from '@babel/types';

export default class EfferentCoupling implements IMetric {
  private _name = 'Efferent coupling';
  private _info = 'Efferent coupling';
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
    let efferentCoupling = 0;

    for (const module of program.trees) {
      if (module.path === targetModulePath) {
        targetModule = module;
        const _classesInTargetModule: IBlob[] = getAllBlobsFromTree(targetModule, 'ts');

        for (const blob of _classesInTargetModule) {
          const ast = parse(blob.content, { 
            plugins: ['jsx', 'typescript', 'estree'], sourceType: 'module' 
          });

          const cdUpsToGoOutsideModule = blob.path.split('/').length - targetModulePath.split('/').length;

          traverse(ast, { 
            enter(node) {
              if (node.type === 'ImportDeclaration') {
                if (node.source.value.includes('@') || (node.source.value.match(/..\//g) || []).length >= cdUpsToGoOutsideModule) {
                  efferentCoupling++;
                }
              }
          }});
        }
      }
    }
    
    return { value: efferentCoupling };
  } 
}