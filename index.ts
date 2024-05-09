import { parse } from '@babel/parser';
import * as fs from 'fs';
import { findPathInFileTree, getAllBlobsFromTree } from './src/utils';
import { AbstractMetric, IBlob, IBlobMetricsResults, IConfig, IFileTreeNode, IFinalMetricResult, IModule, ITreeMetricsResults } from './src/types';
import * as metrics from './src/metrics';
import { FunctionDeclaration, FunctionExpression, traverse } from '@babel/types';
import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

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

// get metrics instances
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

// calculate all metrics with scope == function and scope == class
const blobs = getAllBlobsFromTree(rootDir, config.extentions);

const metricResultsScopeFunction: IFinalMetricResult[] = [];

function countFunctionMetrics(node: FunctionDeclaration | FunctionExpression | any, fullAst: ParseResult<File>, blob: IBlob) {
  for (const metric of metricsInstances) {
    if (metric.scope === 'function' && ((node.type !== 'MethodDefinition' && node.body) || (node.type === 'MethodDefinition' && node.value.body))) {
      const tokenStartIndex = fullAst.tokens?.findIndex(elem => elem.loc.start.line === node.loc?.start.line);
      const tokenEndIndex = fullAst.tokens?.findIndex(elem => elem.loc.end.line === node.loc?.end.line);
      const result = metric.run({
        type: 'File',
        program: {
          type: 'Program',
          body: node.type === 'MethodDefinition' ? node.value.body.body : node.body.body,
          sourceType: 'script',
          directives: [],
          loc: node.loc
        },
        tokens: fullAst.tokens?.slice(tokenStartIndex, tokenEndIndex),
        loc: node.loc,
        errors: []
      });

      metricResultsScopeFunction.push({
        metricName: metric.name,
        resultScope: metric.scope,
        subjectPath: node.type === 'MethodDefinition' ? blob.name + '/' + node.key.name : node.id?.name as string,
        value: result.value,
        description: result.description
      });
    }
  }
}

for (const blob of blobs) {
  const ast = parse(blob.content, { 
    plugins: ['typescript', 'estree'], sourceType: 'module', tokens: true
  });
  
  traverse(ast, { 
    enter(node) {
      if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {   
        countFunctionMetrics(node, ast, blob);
      }

      if (node.type === 'ClassDeclaration') {  
        
        //type ArgumentTypes = Parameters<typeof exampleFunction>;
        
        for (const item of node.body.body) {
          //@ts-expect-error ignore
          if (item.type === 'MethodDefinition' && item.kind !== 'constructor') {
            countFunctionMetrics(item, ast, blob);
          }
        }
      }
  }});  
}

console.log(metricResultsScopeFunction);


// write results
fs.writeFileSync('result.json', JSON.stringify(outputTree, null, '  '));



