import { AbstractMetric, IBlob, IModule, IntervalConfig } from "../types";
import { getAllBlobsFromTree, returnMetricValueWithDesc } from "../utils";
import { parse } from '@babel/parser';
import { traverse } from '@babel/types';

export default class EfferentCoupling extends AbstractMetric<IModule> {
  readonly name = 'Efferent coupling';
  readonly info = 'Efferent coupling (Martin metric)';
  readonly scope = 'module';
  
  constructor(config: IntervalConfig[]) {
    super(config);
  }

  public run(program: IModule, targetModulePath: string) {
    let targetModule = null;
    let efferentCoupling = 0;

    for (const module of program.trees) {
      if (module.path === targetModulePath) {
        targetModule = module;
        const _classesInTargetModule: IBlob[] = getAllBlobsFromTree(targetModule, ['ts', 'js']);

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
        break;
      }
    }
    
    return returnMetricValueWithDesc(efferentCoupling, this._intervals);
  } 
}