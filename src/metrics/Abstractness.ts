import { parse } from "@babel/parser";
import { AbstractMetric, IBlob, IModule, IntervalConfig } from "../types";
import { findPathInFileTree, getAllBlobsFromTree, returnMetricValueWithDesc } from "../utils";
import { traverse } from "@babel/types";

export default class Abstractness extends AbstractMetric<IModule> {
  readonly name = 'Abstractness';
  readonly info = 'Abstractness (Martin metric)';
  readonly scope = 'module';
  
  constructor(config: IntervalConfig[]) {
    super(config);
  }

  public run(program: IModule, targetModulePath: string) {
    // interfaces also contribute to abstractness
    let totalNumberOfClassesAndInterfaces = 0;
    let numberOfAbstractClassesAndInterfaces = 0;

    const targetModule = findPathInFileTree(targetModulePath, program) as IModule;
    const filesInTargetModule: IBlob[] = getAllBlobsFromTree(targetModule, ['ts', 'js']);

    for (const file of filesInTargetModule) {
      const ast = parse(file.content, { 
        plugins: ['typescript', 'estree'], sourceType: 'module' 
      });

      traverse(ast, { 
        enter(node) {
          if (node.type === 'ClassDeclaration') {
            totalNumberOfClassesAndInterfaces++;
            if (node.abstract) numberOfAbstractClassesAndInterfaces++;
          }
          if (node.type === 'InterfaceDeclaration') {
            totalNumberOfClassesAndInterfaces++;
            numberOfAbstractClassesAndInterfaces++;
          }
      }});
    }

    return returnMetricValueWithDesc(numberOfAbstractClassesAndInterfaces / totalNumberOfClassesAndInterfaces, this._intervals);
  } 
}