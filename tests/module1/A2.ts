import { B } from "../module2/B";
import A1 from "./A1";

export default class A2 extends A1 {
  prop1 = 'blabla'
  prop2 = new B();
}