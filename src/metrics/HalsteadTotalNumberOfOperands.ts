import esprima from 'esprima';
import { IMetric } from "@/types";

export default class HalsteadTotalNumberOfOperands implements IMetric {
  private _name = 'Total number of operands';
  private _info = 'Total number of operands';
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
    let operatorsCount = 0;
    if (program.tokens) {
      console.log(program.tokens.length);
      
      for (const token of program.tokens) {
        if (token.type !== 'Keyword' && token.type !== 'Punctuator') operatorsCount++;
      }
    }
    return { value: operatorsCount };
  } 
}