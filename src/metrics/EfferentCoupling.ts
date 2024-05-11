import { AbstractMetric, IBlob, IModule, IntervalConfig } from "../types";
import { findPathInFileTree, getAllBlobsFromTree, returnMetricValueWithDesc } from "../utils";
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
    let efferentCoupling = 0;

    const module = findPathInFileTree(targetModulePath, program); 

    if (module) {
      const _classesInTargetModule: IBlob[] = getAllBlobsFromTree(module as IModule, ['ts', 'js']);

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
    
    return returnMetricValueWithDesc(efferentCoupling, this._intervals);
  } 
}