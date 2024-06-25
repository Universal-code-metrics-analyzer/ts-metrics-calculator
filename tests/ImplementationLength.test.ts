import { parse } from "@babel/parser";
import { ImplementationLength } from "../src/metrics";


test('Operators of a separate function', () => {
  const separateFunction = `
    let foo = 5;
    foo = foo + 3;
  `;

  const ast = parse(separateFunction, { 
    plugins: ['typescript', 'estree', 'decorators'], sourceType: 'module', tokens: true 
  });
  
  expect(new ImplementationLength([]).run(ast).value).toBe(12);
});

test('Operators of a class method', () => {
  const classMethod = `
    let foo = 5;
    foo = foo + this.foo - this.getFoo() + 3;
  `;

  const ast = parse(classMethod, { 
    plugins: ['typescript', 'estree', 'decorators'], sourceType: 'module', tokens: true
  });

  expect(new ImplementationLength([]).run(ast).value).toBe(22);
});