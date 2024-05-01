import { AbstractMetric, IntervalConfig } from "../types";
import { traverse } from '@babel/types';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';
import { returnMetricValueWithDesc } from "../utils";

export default class LackOfCohesionOfMethods extends AbstractMetric<ParseResult<File>> {
  readonly name = 'Lack Of Cohesion Of Methods';
  readonly info = 'Lack Of Cohesion Of Methods';
  readonly scope = 'class';
  
  constructor(config: IntervalConfig[]) {
    super(config);
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
    
            //@ts-expect-error ignore
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
          //@ts-expect-error ignore
          if (node.object && node.property && node.object.type === 'ThisExpression') {
            //@ts-expect-error ignore
            propsInFirstMethod.add(node.property.name);
          }
      }});
      traverse(item[1].value, { 
        enter(node) {
          //@ts-expect-error ignore
          if (node.object && node.property && node.object.type === 'ThisExpression') {
            //@ts-expect-error ignore
            propsInSecondMethod.add(node.property.name);
          }
      }});

      if ([...propsInFirstMethod].filter(el => propsInSecondMethod.has(el)).length > 0) {
        shareMutualPropsCounter++;
      }
    }

    const result = methodsPairs.length - (shareMutualPropsCounter * 2);

    return returnMetricValueWithDesc(result <= 0 ? 0 : result, this._intervals);
  } 
}