import { parse } from '@babel/parser';
import * as fs from 'fs';
import { findPathInFileTree, getAllBlobsFromTree } from './src/utils';
import { AbstractMetric, IBlob, IConfig, IFileTreeNode, IFinalMetricResult, IModule, ITreeMetricsResults } from './src/types';
import * as metrics from './src/metrics';
import { FunctionDeclaration, FunctionExpression, traverse } from '@babel/types';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';
import generate from "@babel/generator";

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
  console.error("Error: please, specify the path project JSON tree to analyze");
  process.exit(1);
}

const confIndex = process.argv.indexOf('--conf');

if (confIndex === -1) {
  console.error('Error: please, specify the path to configuration JSON file');
  process.exit(1);
}

const project: IModule = JSON.parse(fs.readFileSync(process.argv[projIndex + 1]).toString());
const config: IConfig = JSON.parse(fs.readFileSync(process.argv[confIndex + 1]).toString());

// -------------------------------

const metricsInstances: AbstractMetric<IModule | ParseResult<File>>[] = [];
for (const metric of config.metrics) {
  try {
    //@ts-expect-error ignore
    metricsInstances.push(new metrics[metric.name](metric.intervals));
  } catch (error) {
    console.error("Error when reading configuration file. Make sure that the file has proper formatting and all specified metrics have the right name");
    process.exit(1);
  }
}

// -------------------------------

const rootDir = findPathInFileTree(config.rootDir, project) as IModule;

console.log('Started to calculate metrics...');

// create the object for results
const result: ITreeMetricsResults = {} as ITreeMetricsResults;

// translate input tree to output tree
function inputTreeToOutputTree(inputTree: IModule): ITreeMetricsResults {
  return {
    type: inputTree.type,
    name: inputTree.path,
    path: inputTree.path,
    metricResults: [],
    trees: inputTree.trees.map(elem => inputTreeToOutputTree(elem)),
    blobs: inputTree.blobs.map(elem => {
      return {
        type: elem.type,
        name: elem.name,
        path: elem.path,
        metricResults: []
      }
    })
  };
}

const outputTree = inputTreeToOutputTree(rootDir);

// calculate all metrics with scope == module

// calculate all metrics with scope == class
// TODO: procedure to get all classes with paths

// calculate all metrics with scope == function
// TODO: procedure to get all functions with paths
const blobs = getAllBlobsFromTree(rootDir, config.extentions);

console.log(blobs.length);


const metricResultsScopeFunction: IFinalMetricResult[] = [];

function countFunctionMetrics(node: FunctionDeclaration | FunctionExpression) {
  for (const metric of metricsInstances) {
    if (metric.scope === 'function') {
      // const output = generate(node.body);
      // const functionAst = parse(output.code, { 
      //   plugins: ['jsx', 'typescript', 'estree'], sourceType: 'module', tokens: true
      // });

      const result = metric.run({
        type: 'File',
        program: {
          type: 'Program',
          body: node.body.body,
          sourceType: 'script',
          directives: []
        },
        errors: []
      });

      metricResultsScopeFunction.push({
        metricName: metric.name,
        resultScope: metric.scope,
        subjectPath: node.id?.name as string,
        value: result.value,
        description: result.description
      });
    }
  }
}

for (const blob of blobs) {
  const ast = parse(blob.content, { 
    plugins: ['jsx', 'typescript', 'estree'], sourceType: 'module' 
  });
  
  traverse(ast, { 
    enter(node) {
      if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {   
        countFunctionMetrics(node);
      }

      // if (node.type === 'ClassBody') {   
      //   for (const item of node.body) {
      //     //@ts-expect-error ignore
      //     if (item.type === 'MethodDefinition') {
      //       //@ts-expect-error ignore
      //       countFunctionMetrics(item.value.body);
      //     }
      //   }
      // }
  }});  
}

console.log(metricResultsScopeFunction);

  
// calculate all 

// create resulting file and write results


//console.log(new NumberOfChild().run(findPathInFileTree('tests', project) as IModule, 'tests/module1/A.ts'));



