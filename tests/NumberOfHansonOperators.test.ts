import { IMetric } from '../types';
import { ParseResult } from '@babel/parser';
import { File, traverse } from '@babel/types';

export default class NumberOfHansonOperators implements IMetric {
  private _name = 'Number of Hanson operators';
  private _info =
    'Number of operators as defined by Hanson https://dl.acm.org/doi/pdf/10.1145/954373.954375';
  private _scope = 'any';

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
    let operatorsCount = 0;
    traverse(program, { 
      enter(node) {
        if (
          ['BinaryExpression', 'AssignmentExpression', 'CallExpression'].includes(
            node.type
          )
        ) {
          operatorsCount++;
        }
    }});

    return { value: operatorsCount };
  }
}
