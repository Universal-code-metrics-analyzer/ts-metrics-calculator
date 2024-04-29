import { IMetric, IntervalConfig } from "../types";
import { traverse } from '@babel/types';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';
import { returnMetricValueWithDesc } from "../utils";

export default class LackOfCohesionOfMethods implements IMetric {
  private _name = 'Lack Of Cohesion Of Methods';
  private _info = 'Lack Of Cohesion Of Methods';
  private _scope = 'class';
  private _intervals: IntervalConfig[];

  constructor(config: IntervalConfig[]) {
    this._intervals = config
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

  public run(program: ParseResult<File>) {
    const methods: any[] = [];
    const methodsPairs = [];
    let shareMutualPropsCounter = 0;
    const attributes = [];

    traverse(program, { 
      enter(node) {
        if (node.type === 'ClassDeclaration') {
          for (const item of node.body.body) {
            if (item.type === 'ClassProperty') {
              attributes.push(item);
            }
    
            //@ts-ignore
            if (item.type === 'MethodDefinition') {
              methods.push(item);
            }
          }
        }
    }});

    for (let i = 0; i < methods.length - 1; i++) {
      for (let j = i + 1; j < methods.length; j++) {
        methodsPairs.push([methods[i], methods[j]]);
      }
    }

    for (const item of methodsPairs) {
      const propsInFirstMethod = new Set<string>();
      const propsInSecondMethod = new Set<string>();
      traverse(item[0].value, { 
        enter(node) {
          //@ts-ignore
          if (node.object && node.property && node.object.type === 'ThisExpression') {
            //@ts-ignore
            propsInFirstMethod.add(node.property.name);
          }
      }});
      traverse(item[1].value, { 
        enter(node) {
          //@ts-ignore
          if (node.object && node.property && node.object.type === 'ThisExpression') {
            //@ts-ignore
            propsInSecondMethod.add(node.property.name);
          }
      }});

      if ([...propsInFirstMethod].filter(el => propsInSecondMethod.has(el)).length > 0) {
        shareMutualPropsCounter++;
      }
    }

    let result = methodsPairs.length - (shareMutualPropsCounter * 2);

    return returnMetricValueWithDesc(result <= 0 ? 0 : result, this._intervals);
  } 
}