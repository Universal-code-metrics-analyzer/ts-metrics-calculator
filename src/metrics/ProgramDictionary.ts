import esprima from 'esprima';
import { IMetric } from "@/types";
import TotalNumberOfUniqueOperands from './TotalNumberOfUniqueOperands';
import TotalNumberOfUniqueOperators from './TotalNumberOfUniqueOperators';

export default class ProgramDictionary implements IMetric {
  private _name = 'Program Dictionary';
  private _info = 'Program Dictionary';
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

  public run(program: esprima.Program) {
    return { value: new TotalNumberOfUniqueOperands().run(program).value + new TotalNumberOfUniqueOperators().run(program).value };
  } 
}