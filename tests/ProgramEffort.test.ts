import { parse } from "@babel/parser";
import { ProgramEffort } from "../src/metrics";


test('Effort of a separate function', () => {
  const separateFunction = `
    let foo = 5;
    foo = foo + 3;
  `;

  const ast = parse(separateFunction, { 
    plugins: ['typescript', 'estree', 'decorators'], sourceType: 'module', tokens: true 
  });
  
  expect(new ProgramEffort([]).run(ast).value).toBeLessThanOrEqual(36);
});

test('Effort of a class method', () => {
  const classMethod = `
    let foo = 5;
    foo = foo + this.foo - this.getFoo() + 3;
  `;

  const ast = parse(classMethod, { 
    plugins: ['typescript', 'estree', 'decorators'], sourceType: 'module', tokens: true
  });

  expect(new ProgramEffort([]).run(ast).value).toBeLessThanOrEqual(84);
});