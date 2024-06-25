import { parse } from "@babel/parser";
import { TotalNumberOfUniqueOperands } from "../src/metrics";


test('Operands of a separate function', () => {
  const separateFunction = `
    let foo = 5;
    foo = foo + 3;
  `;

  const ast = parse(separateFunction, { 
    plugins: ['typescript', 'estree', 'decorators'], sourceType: 'module', tokens: true 
  });
  
  expect(new TotalNumberOfUniqueOperands([]).run(ast).value).toBe(3);
});

test('Operands of a class method', () => {
  const classMethod = `
    let foo = 5;
    foo = foo + this.foo - this.getFoo() + 3;
  `;

  const ast = parse(classMethod, { 
    plugins: ['typescript', 'estree', 'decorators'], sourceType: 'module', tokens: true
  });

  expect(new TotalNumberOfUniqueOperands([]).run(ast).value).toBe(4);
});