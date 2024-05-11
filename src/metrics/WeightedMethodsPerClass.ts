import { AbstractMetric, IntervalConfig } from "../types";
import { ParseResult } from '@babel/parser';
import { traverse, File } from '@babel/types';
import McCabeCC from "./McCabeCC";
import { returnMetricValueWithDesc } from "../utils";

export default class WeightedMethodsPerClass extends AbstractMetric<ParseResult<File>> {
  readonly name = 'Weighted Methods Per Class';
  readonly info = 'Weighted Methods Per Class = Σi( McCabeCC( Method_i ) )';
  readonly scope = 'class';

  constructor(config: IntervalConfig[]) {
    super(config);
  }

  public run(program: ParseResult<File>) {
    let weightedMethodsPerClass = 0;
    const intervals = this._intervals;

    traverse(program, { 
      enter(node) {
        if (node.type === 'ClassBody') {
          for (const item of node.body) {
            //@ts-expect-error ignore
            if (item.type === 'MethodDefinition' && item.value.body) {
              weightedMethodsPerClass += new McCabeCC(intervals).run({
                type: 'File',
                program: {
                  type: 'Program',
                  //@ts-expect-error ignore
                  body: item.value.body.body,
                  sourceType: 'script',
                  directives: []
                },
                errors: program.errors
              }).value;
            }
          }
        }
    }});
    
    return returnMetricValueWithDesc(weightedMethodsPerClass, intervals);
  } 
}