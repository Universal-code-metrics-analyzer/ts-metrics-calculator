import { IMetric } from "../types";
import { ParseResult } from '@babel/parser';
import { traverse, File } from '@babel/types';
// @ts-ignore
import * as Styx from 'styx';
import McCabeCC from "./McCabeCC";

export default class WeightedMethodsPerClass implements IMetric {
  private _name = 'Weighted Methods Per Class';
  private _info = 'Weighted Methods Per Class';
  private _scope = 'class';

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
    
    let weightedMethodsPerClass = 0;

    traverse(program, { 
      enter(node) {
        if (node.type === 'ClassBody') {
          for (const item of node.body) {
            //@ts-ignore
            if (item.type === 'MethodDefinition') {
              //@ts-ignore
              const programFlow = Styx.parse({
                type: 'Program',
                //@ts-ignore
                body: item.value.body.body,
                sourceType: 'script'
              });
              weightedMethodsPerClass += new McCabeCC().run(programFlow).value;
            }
          }
        }
    }});
    
    return { value: weightedMethodsPerClass };
  } 
}