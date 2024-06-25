import { parse } from "@babel/parser";
import { ProgramVolume } from "../src/metrics";


test('Volume of a separate function', () => {
  const separateFunction = `
    let foo = 5;
    foo = foo + 3;
  `;

  const ast = parse(separateFunction, { 
    plugins: ['typescript', 'estree', 'decorators'], sourceType: 'module', tokens: true 
  });
  
  expect(new ProgramVolume([]).run(ast).value).toBe(36);
});

test('Volume of a class method', () => {
  const classMethod = `
    let foo = 5;
    foo = foo + this.foo - this.getFoo() + 3;
  `;

  const ast = parse(classMethod, { 
    plugins: ['typescript', 'estree', 'decorators'], sourceType: 'module', tokens: true
  });

  expect(Math.round(new ProgramVolume([]).run(ast).value)).toBe(84);
});