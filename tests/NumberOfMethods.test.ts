import { parse } from "@babel/parser";
import { NumberOfMethods } from "../src/metrics";

test('No methods', () => {
  const text = `
  class A {
    prop1 = 1;
  }
  `;

  const ast = parse(text, { 
    plugins: ['typescript', 'estree'], sourceType: 'module' 
  });
  
  expect(new NumberOfMethods([]).run(ast).value).toBe(0);
});


test('One method', () => {
  const text = `
  class A {
    prop1 = 1
    
    method1() {
      var jsonData;
      return jsonData;
    }
  }
  `;

  const ast = parse(text, { 
    plugins: ['typescript', 'estree'], sourceType: 'module' 
  });
  
  expect(new NumberOfMethods([]).run(ast).value).toBe(1);
});

test('Couple of methods', () => {
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

  expect(new NumberOfMethods([]).run(ast).value).toBe(6);
});