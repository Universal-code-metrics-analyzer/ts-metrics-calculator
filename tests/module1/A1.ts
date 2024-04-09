import { B } from "../module2/B";
import A from "./A";

export default class A1 extends A {
  prop1 = 'blabla'
  prop2 = new B();
}