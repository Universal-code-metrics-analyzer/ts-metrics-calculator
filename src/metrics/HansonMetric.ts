import { IMetric } from '@/types';
import esprima from 'esprima';
import McCabeCC from './McCabeCC';
import NumberOfHansonOperators from './NumberOfHansonOperators';
// @ts-ignore
import * as Styx from 'styx';

export default class HansonMetric implements IMetric {
  private _name = 'Hanson metric';
  private _info =
    'Complexity metric defined by Hanson https://dl.acm.org/doi/pdf/10.1145/954373.954375';
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

  public run(program: esprima.Program, programFlow: typeof Styx.parse) {
    return {
      value: {
        A: new McCabeCC().run(programFlow).value,
        B: new NumberOfHansonOperators().run(program),
      },
    };
  }
}
