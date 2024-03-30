import { B } from "../module2/B";
import { C } from "../module3/C";

export default class A {
  prop1 = 'blabla'
  prop2 = new B();

  func(param: C) {
    return param.prop1 + this.prop1;
  }
}