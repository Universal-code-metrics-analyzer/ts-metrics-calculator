import esprima from 'esprima';
import { IMetric } from "@/types";

export default class HalsteadTotalNumberOfOperators implements IMetric {
  private _name = 'Total number of operators';
  private _info = 'Total number of operators';
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
        if (token.type === 'Keyword' || token.type === 'Punctuator') operatorsCount++;
      }
    }
    return { value: operatorsCount };
  } 
}