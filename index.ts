import parser from '@babel/parser';
import * as fs from 'fs';
import { findPathInFileTree, getAllBlobsFromTree } from './src/utils';
import { IBlob, IModule } from './src/types';
import * as metrics from './src/metrics';

// const projIndex = process.argv.indexOf('--proj');

// if (projIndex === -1) {
//   console.error('Error: please, specify the path project JSON tree to analyze');
//   process.exit(1);
// }

// const confIndex = process.argv.indexOf('--conf');

// if (confIndex === -1) {
//   console.error('Error: please, specify the path to configuration JSON file');
//   process.exit(1);
// }

// const project: IModule = JSON.parse(fs.readFileSync(process.argv[projIndex + 1]).toString());

//console.log(new NumberOfChild().run(findPathInFileTree('tests', project) as IModule, 'tests/module1/A.ts'));


console.log('Starting...');

console.log(Object.keys(metrics));

