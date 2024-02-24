import HalsteadTotalNumberOfUniqueOperators from './src/metrics/HalsteadTotalNumberOfUniqueOperators';
import HalsteadTotalNumberOfOperators from './src/metrics/HalsteadTotalNumberOfOperators';
import esprima from 'esprima';

console.log('Starting...');

const text = `
let foo = 'bar';
foo = foo + ' puk puk';
const dammit = (chpok) => {
  if (chpok.length > 5) {
    chpock + ' dfjidfj';
  } 
  return chpok;
}
console.log(dammit(foo));
`;

const ast = esprima.parseModule(text, { jsx: true, tokens: true });
console.log(JSON.stringify(ast, null, 2));
const totalNumberOfOperators = new HalsteadTotalNumberOfUniqueOperators().run(ast);
console.log(totalNumberOfOperators.value);
