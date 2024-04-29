import { parse } from "@babel/parser";
import { IBlob, IMetric, IModule, IntervalConfig } from "../types";
import { findPathInFileTree, getAllBlobsFromTree, returnMetricValueWithDesc } from "../utils";
import { traverse } from "@babel/types";

export default class Abstractness implements IMetric {
  private _name = 'Abstractness';
  private _info = 'Abstractness (Martin metric)';
  private _scope = 'module';
  private _intervals: IntervalConfig[];

  constructor(config: IntervalConfig[]) {
    this._intervals = config;
  }

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
    // will take as assumption that interfaces also contribute to abstractness
    let totalNumberOfClassesAndInterfaces = 0;
    let numberOfAbstractClassesAndInterfaces = 0;

    const targetModule = findPathInFileTree(targetModulePath, program) as IModule;
    const filesInTargetModule: IBlob[] = getAllBlobsFromTree(targetModule, ['ts', 'js']);

    for (const file of filesInTargetModule) {
      const ast = parse(file.content, { 
        plugins: ['jsx', 'typescript', 'estree'], sourceType: 'module' 
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