import { IMetric } from "../types";
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class TotalNumberOfUniqueOperands implements IMetric {
  private _name = 'Total number of unique operands';
  private _info = 'Total number of unique operands in the program';
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

  public run(program: ParseResult<File>) {
    const uniqueOperands: string[][] = [];
    if (program.tokens) {
      for (const token of program.tokens) {
        if (token.type.keyword === undefined 
          && token.value 
          && (token.type.label === 'name' || token.type.label === 'string') 
          && token.value !== 'let' 
          && !uniqueOperands.find((elem) => elem[0] === token.value && elem[1] === token.type.label)) {
          uniqueOperands.push([token.value, token.type.label]);
        } 
      }
    }
    return { value: uniqueOperands.length };
  } 
}