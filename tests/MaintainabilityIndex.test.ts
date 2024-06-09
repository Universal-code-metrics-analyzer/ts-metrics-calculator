import { parse } from "@babel/parser";
import { MaintainabilityIndex } from "../src/metrics";


test('Simple procedure without cycles and conditions', () => {
  const separateFunction = `
    let foo = 5;
    foo = foo + 3;
  `;

  const ast = parse(separateFunction, { 
    plugins: ['typescript', 'estree'], sourceType: 'module', tokens: true
  });
  
  expect(new MaintainabilityIndex([]).run(ast).value).toBeCloseTo(78.56, 2);
});

test('Simple procedure with cycle', () => {
  const classMethod = `
    for (let i = 0; i < 5; i++) {
      let foo = 5;
      foo = foo + this.foo - this.getFoo() + 3;
    }
  `;

  const ast = parse(classMethod, { 
    plugins: ['typescript', 'estree'], sourceType: 'module', tokens: true
  });

  expect(new MaintainabilityIndex([]).run(ast).value).toBeCloseTo(68.97, 2);
});

test('Simple procedure with condition', () => {
  const classMethod = `
    let i = 4;
    if (i === 4 || i === 2) {
      let foo = 5;
      foo = foo + this.foo + 3;
    }
  `;

  const ast = parse(classMethod, { 
    plugins: ['typescript', 'estree'], sourceType: 'module', tokens: true
  });

  expect(new MaintainabilityIndex([]).run(ast).value).toBeCloseTo(67.67, 2);
});

test('Medium procedure', () => {
  const classMethod = `
    let i = 4;
    if (i === 4 || i === 2) {
      let foo = 5;
      foo = foo + this.foo + 3;
      if (i === 2) {
        foo = 4;
      } else if (i === 0) {
        foo = 0;
      } else {
        foo = 1;
        if (foo === 0) {
          i = 9;
        }
      }
    }
  `;

  const ast = parse(classMethod, { 
    plugins: ['typescript', 'estree'], sourceType: 'module', tokens: true
  });

  expect(new MaintainabilityIndex([]).run(ast).value).toBeCloseTo(55.26, 2);
});

test('Difficult procedure', () => {
  const classMethod = `
    let i = 4;
    if (i === 4 || i === 2) {
      let foo = 5;
      foo = foo + this.foo + 3;
      if (i === 2) {
        foo = 4;
      } else if (i === 0) {
        if (foo === 0) {
          i = 9;
          if (foo === 0) {
            i = 9;
          }
        }
        foo = 0;
      } else {
        foo = 1;
        if (foo === 0) {
          i = 9;
          if (foo === 0) {
            i = 9;
            if (foo === 0) {
              i = 9;
              if (foo === 0) {
                i = 9;
              }
            }
          }
        }
      }
    }
  `;

  const ast = parse(classMethod, { 
    plugins: ['typescript', 'estree'], sourceType: 'module', tokens: true 
  });

  expect(new MaintainabilityIndex([]).run(ast).value).toBeCloseTo(46.57, 2);
});