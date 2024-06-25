import { parse } from "@babel/parser";
import { ProgramDictionary } from "../src/metrics";


test('Dictionary of a separate function', () => {
  const separateFunction = `
    let foo = 5;
    foo = foo + 3;
  `;

  const ast = parse(separateFunction, { 
    plugins: ['typescript', 'estree', 'decorators'], sourceType: 'module', tokens: true 
  });
  
  expect(new ProgramDictionary([]).run(ast).value).toBe(8);
});

test('Dictionary of a class method', () => {
  const classMethod = `
    let foo = 5;
    foo = foo + this.foo - this.getFoo() + 3;
  `;

  const ast = parse(classMethod, { 
    plugins: ['typescript', 'estree', 'decorators'], sourceType: 'module', tokens: true
  });

  expect(new ProgramDictionary([]).run(ast).value).toBe(14);
});