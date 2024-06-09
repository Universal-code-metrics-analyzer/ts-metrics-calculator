import { parse } from "@babel/parser";
import { PotentialProgramVolume } from "../src/metrics";


test('Potential volume of a separate function', () => {
  const separateFunction = `
    let foo = 5;
    foo = foo + 3;
  `;

  const ast = parse(separateFunction, { 
    plugins: ['typescript', 'estree'], sourceType: 'module', tokens: true 
  });
  
  expect(new PotentialProgramVolume([]).run(ast).value).toBe(2);
});

test('Potential volume of a class method', () => {
  const classMethod = `
    let foo = 5;
    foo = foo + this.foo - this.getFoo() + 3;
  `;

  const ast = parse(classMethod, { 
    plugins: ['typescript', 'estree'], sourceType: 'module', tokens: true
  });

  expect(new PotentialProgramVolume([]).run(ast).value).toBe(2);
});