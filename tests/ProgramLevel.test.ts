import { parse } from "@babel/parser";
import { ProgramLevel } from "../src/metrics";


test('Level of a separate function', () => {
  const separateFunction = `
    let foo = 5;
    foo = foo + 3;
  `;

  const ast = parse(separateFunction, { 
    plugins: ['typescript', 'estree'], sourceType: 'module', tokens: true 
  });
  
  expect(new ProgramLevel([]).run(ast).value).toBeLessThanOrEqual(0.06);
});

test('Level of a class method', () => {
  const classMethod = `
    let foo = 5;
    foo = foo + this.foo - this.getFoo() + 3;
  `;

  const ast = parse(classMethod, { 
    plugins: ['typescript', 'estree'], sourceType: 'module', tokens: true
  });

  expect(new ProgramLevel([]).run(ast).value).toBeLessThanOrEqual(0.05);
});