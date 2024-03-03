import esprima from 'esprima';
import ProgramEffort from './src/metrics/ProgramEffort';

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
//console.log(JSON.stringify(ast, null, 2));
const programEffort = new ProgramEffort().run(ast);
console.log(programEffort.value);
