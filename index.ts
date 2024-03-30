import parser from '@babel/parser';
import * as fs from 'fs';
import { findPathInFileTree, getAllBlobsFromTree } from './src/utils';
import { IBlob, IModule } from './src/types';
import { Identifier, traverse } from '@babel/types';
import AfferentCoupling from './src/metrics/AfferentCoupling';

const projIndex = process.argv.indexOf('--proj');

if (projIndex === -1) {
  console.error('Error: please, specify the path project JSON tree to analyze');
  process.exit(1);
}

const confIndex = process.argv.indexOf('--conf');

if (confIndex === -1) {
  console.error('Error: please, specify the path to configuration JSON file');
  process.exit(1);
}

const project: IModule = JSON.parse(fs.readFileSync(process.argv[projIndex + 1]).toString());

console.log(new AfferentCoupling().run(findPathInFileTree('tests', project) as IModule, 'tests/module1'));


console.log('Starting...');

const text = `
let foo = 'bar';
foo = foo + ' puk puk';
const dammit = (chpok) => {
  if (chpok.length > 5) {
    chpok + ' dfjidfj';
  } 
  return chpok;
}
console.log(dammit(foo));
`;

const program = parser.parse(text, {
  tokens: true,
  plugins: [
    'jsx', 'typescript', 'estree'
  ]
});

// const programFlow = Styx.parse(program.program);

// console.log(new HansonMetric().run(program, programFlow));
// console.log(new MaintainabilityIndex().run(program, programFlow));
