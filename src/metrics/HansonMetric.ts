import { IMetric } from '@/types';
import McCabeCC from './McCabeCC';
import NumberOfHansonOperators from './NumberOfHansonOperators';
// @ts-ignore
import * as Styx from 'styx';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class HansonMetric implements IMetric {
  private _name = 'Hanson metric';
  private _info =
    'Complexity metric defined by Hanson https://dl.acm.org/doi/pdf/10.1145/954373.954375';
  private _scope = 'function';

  public get name() {
    return this._name;
  }

  public get info() {
    return this._info;
  }

  public get scope() {
    return this._scope as any;
  }

  public run(program: ParseResult<File>, programFlow: typeof Styx.parse) {
    return {
      value: {
        A: new McCabeCC().run(programFlow).value,
        B: new NumberOfHansonOperators().run(program).value,
      },
    };
  }
}
