import { IMetric } from "../types";
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export default class EfferentCoupling implements IMetric {
  private _name = 'Efferent coupling';
  private _info = 'Efferent coupling';
  private _scope = 'module';

  public get name() {
    return this._name;
  }

  public get info() {
    return this._info;
  }

  public get scope() {
    return this._scope as any;
  }

  public run(program: ParseResult<File>, className: string) {
    
    
    return { value: 0 };
  } 
}