import { parse } from "@babel/parser";
import { NumberOfInputOutputParameters } from "../src/metrics";


test('Only input params', () => {
  const separateFunction = `
    function func(param1, param2, param3) {
      let foo = 5;
      param1 = foo + 3;
    }
  `;

  const ast = parse(separateFunction, { 
    plugins: ['typescript', 'estree'], sourceType: 'module', tokens: true 
  });
  
  expect(new NumberOfInputOutputParameters([]).run(ast).value).toBe(3);
});

test('Input and output params', () => {
  const classMethod = `
    function func(param1, param2, param3) {
      let foo = 5;
      param1 = foo + 3;
      return param1;
    }
  `;

  const ast = parse(classMethod, { 
    plugins: ['typescript', 'estree'], sourceType: 'module', tokens: true
  });

  expect(new NumberOfInputOutputParameters([]).run(ast).value).toBe(4);
});