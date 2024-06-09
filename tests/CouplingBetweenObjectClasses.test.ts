import { parse } from "@babel/parser";
import { CouplingBetweenObjectClasses } from "../src/metrics";


test('High coupling', () => {
  const text = `
  import { B } from "../module2/B";
  import { C } from "../module3/C";

  export class A {
    prop1 = 'blabla'
    prop2 = new B();
    prop3 = 123;
    prop4 = 456;

    func1(param: C) {
      return param.prop1.concat(this.prop1);
    }

    func2() {
      let foo = this.prop1 + this.prop2;
    }

    func3() {
      this.prop3 = this.prop3 + this.prop4;
    }

    func4() {
      let foo = this.prop1 + this.prop4;
    }

    func5() {
      let foo = this.prop2 + this.prop3;
    }

    func6() {
      return this.prop1 + this.prop2;
    }
  }
  `;

  const ast = parse(text, { 
    plugins: ['typescript', 'estree'], sourceType: 'module' 
  });
  
  expect(new CouplingBetweenObjectClasses([]).run(ast).value).toBe(2);
});

test('No coupling', () => {
  const text = `
  class A {
    prop1 = 1
    
    method1() {
      var jsonData;
      return jsonData;
    }
  
    method2() {
      var jsonData;
      return jsonData;
    }
  
    method3() {
      var jsonData;
      return jsonData;
    }

    method4() {
      var jsonData;
      return jsonData;
    }

    method5() {
      var jsonData;
      return jsonData;
    }

    method6() {
      var jsonData;
      return jsonData;
    }
  }
  `;

  const ast = parse(text, { 
    plugins: ['typescript', 'estree'], sourceType: 'module' 
  });

  expect(new CouplingBetweenObjectClasses([]).run(ast).value).toBe(0);
});
