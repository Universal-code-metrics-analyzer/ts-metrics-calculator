import esprima from 'esprima';
import { IMetric } from "@/types";

export default class HalsteadTotalNumberOfUniqueOperators implements IMetric {
  private _name = 'Total number of unique operators';
  private _info = 'Total number of unique operators';
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
    const uniqueOperators: string[] = [];
    if (program.tokens) {
      for (const token of program.tokens) {
        if ((token.type === 'Keyword' || token.type === 'Punctuator') && !uniqueOperators.includes(token.value)) {
          uniqueOperators.push(token.value);
        } 
      }
    }
    return { value: uniqueOperators.length };
  } 
}