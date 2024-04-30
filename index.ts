import parser from '@babel/parser';
import * as fs from 'fs';
import { findPathInFileTree, getAllBlobsFromTree } from './src/utils';
import { IBlob, IModule } from './src/types';
import * as metrics from './src/metrics';

const helpIndex = process.argv.indexOf('--help');
if (helpIndex !== -1) {
  console.log('Hello!\nThis tool is made to calculate code metrics for Javascript and Typescript projects.\n');
  console.log('Usage: [--help] [--proj] [--conf]');
  console.log('\nHere are the supported metrics:\n');
  for (const metric in metrics) console.log(metric);
  process.exit();
}

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
console.log('Started to calculate metrics...');

// create the object for results
const result = {
  
};

// calculate all metrics with scope == module

// calculate all metrics with scope == class
// TODO: procedure to get all classes with paths

// calculate all metrics with scope == function
// TODO: procedure to get all functions with paths

// calculate all 

// create resulting file and write results


//console.log(new NumberOfChild().run(findPathInFileTree('tests', project) as IModule, 'tests/module1/A.ts'));



