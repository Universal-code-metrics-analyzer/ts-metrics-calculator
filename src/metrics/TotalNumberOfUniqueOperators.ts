import { IMetric } from "../types";
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class TotalNumberOfUniqueOperators implements IMetric {
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

  public run(program: ParseResult<File>) {
    const uniqueOperators: string[][] = [];
    if (program.tokens) {
      for (const token of program.tokens) {
        if (((token.type.keyword 
          || token.type.binop)
          || (token.type.label !== 'name' && token.type.label !== 'string')
          || token.value === 'let') 
          && !uniqueOperators.find((elem) => elem[0] === token.value && elem[1] === token.type.label)) {
          uniqueOperators.push([token.value, token.type.label]);
        } 
      }
    }
    return { value: uniqueOperators.length };
  } 
}