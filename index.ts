import ProgramEffort from './src/metrics/ProgramEffort';

import parser from '@babel/parser';
import TotalNumberOfOperands from './src/metrics/TotalNumberOfOperands';
import TotalNumberOfOperators from './src/metrics/TotalNumberOfOperators';
import TotalNumberOfUniqueOperands from './src/metrics/TotalNumberOfUniqueOperands';
import TotalNumberOfUniqueOperators from './src/metrics/TotalNumberOfUniqueOperators';
import NumberOfInputOutputParameters from './src/metrics/NumberOfInputOutputParameters';

console.log('Starting...');

// const text = `
// let foo = 'bar';
// foo = foo + ' puk puk';
// const dammit = (chpok) => {
//   if (chpok.length > 5) {
//     chpok + ' dfjidfj';
//   } 
//   return chpok;
// }
// console.log(dammit(foo));
// `;

const text = `
class A {
  var1 = 1
  var2 = 'bla'

  constructor(param) {

  }

  func1(param) {

  }

  func2(param) {
    return this.var1
  }
}

class B {

}

class C {

}

class D {

}
`;

class A {
  var1 = 1
  var2 = 'bla'
  var3 = new C(this.var1)
  var4 = new D(this.var2)

  constructor() {

  }

  func(param: D) {
    return this.var1 * param.func()
  }
}

class B {
  var1 = 1
  var2 = 'bla'

  constructor(param) {

  }

  func(param: A) {
    return this.var1 * param.func()
  }
}

class C {
  var1 = 1
  var2 = 'bla'

  constructor(param) {

  }

  func(param) {
    return this.var1 * param.func()
  }
}

class D {
  var1 = 1
  var2 = 'bla'

  constructor(param) {

  }

  func() {
    return this.var1 + this.
  }
}

const program = parser.parse(text, {
  tokens: true,
  plugins: [
    'jsx', 'typescript', 'estree'
  ]
});

const totalNumberOfOperands = new NumberOfInputOutputParameters().run(program);
console.log(totalNumberOfOperands.value);
