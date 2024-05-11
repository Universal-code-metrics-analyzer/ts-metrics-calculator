import { parse } from '@babel/parser';
import * as fs from 'fs';
import { findPathInFileTree, getAllBlobsFromTree, getAllModulesFromTree, getParamNames, inputTreeToOutputTree } from './src/utils';
import { AbstractMetric, IBlob, IBlobMetricsResults, IConfig, IFinalMetricResult, IModule, ITreeMetricsResults } from './src/types';
import * as metrics from './src/metrics';
import { ClassDeclaration, FunctionDeclaration, FunctionExpression, traverse } from '@babel/types';
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

// translate input tree to output tree
const outputTree = inputTreeToOutputTree(rootDir);

const metricResultsFile: IBlobMetricsResults[] = [];
const metricResultsScopeModule: ITreeMetricsResults[] = [];

function countFunctionMetrics(node: FunctionDeclaration | FunctionExpression | any, fullAst: ParseResult<File>, blob: IBlob, output: IFinalMetricResult[]) {
  for (const metric of metricsInstances) {
    if (metric.scope === 'function' && ((node.type !== 'MethodDefinition' && node.body) || (node.type === 'MethodDefinition' && node.value.body))) {
      const tokenStartIndex = fullAst.tokens?.findIndex(elem => elem.loc.start.line === node.loc?.start.line);
      const tokenEndIndex = fullAst.tokens?.findIndex(elem => elem.loc.end.line === node.loc?.end.line);
      const _result = metric.run({
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

      output.push({
        metricName: metric.name,
        resultScope: metric.scope,
        subjectPath: blob.name + '/' + (node.type === 'MethodDefinition' ? node.key.name : node.id?.name as string),
        value: _result.value,
        description: _result.description
      });
    }
  }
}

function countClassMetrics(node: ClassDeclaration, fullAst: ParseResult<File>, blob: IBlob, root: IModule, output: IFinalMetricResult[]) {
  for (const metric of metricsInstances) {
    if (metric.scope === 'class') {
      let _result;
      const params = getParamNames(metric.run);
      if (params[1] && params[1] === 'targetClassPath') {
        _result = metric.run(root, blob.path);
      } else {
        _result = metric.run(fullAst);
      }

      output.push({
        metricName: metric.name,
        resultScope: metric.scope,
        subjectPath: blob.name + '/' + node.id?.name as string,
        value: _result.value,
        description: _result.description
      });
    }
  }
}

function countModuleMetrics(root: IModule) {
  const modules = getAllModulesFromTree(rootDir);

  for (const module of modules) {
    const moduleMetrics: IFinalMetricResult[] = [];
    for (const metric of metricsInstances) {
      if (metric.scope === 'module') {
        let _result;
        const params = getParamNames(metric.run);
        if (params[1] && params[1] === 'targetModulePath') {
          _result = metric.run(root, module.path);
          
          moduleMetrics.push({
            metricName: metric.name,
            resultScope: metric.scope,
            subjectPath: module.name,
            value: _result.value,
            description: _result.description
          });
        }
      }
    }
  
    metricResultsScopeModule.push({
      name: module.name,
      path: module.path,
      type: module.type,
      metricResults: moduleMetrics,
      trees: [],
      blobs: []
    });
  }
}

const blobs = getAllBlobsFromTree(rootDir, config.extentions);

for (const blob of blobs) {
  const resultsFile: IBlobMetricsResults = {
    name: blob.name,
    path: blob.path,
    type: blob.type,
    metricResults: []
  };

  const ast = parse(blob.content, { 
    plugins: ['typescript', 'estree'], sourceType: 'module', tokens: true
  });
  
  traverse(ast, { 
    enter(node) {
      if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {   
        countFunctionMetrics(node, ast, blob, resultsFile.metricResults);
      }

      if (node.type === 'ClassDeclaration') {
        // calculate metrics for class
        countClassMetrics(node, ast, blob, rootDir, resultsFile.metricResults);
        
        // calculate metrics for class methods
        for (const item of node.body.body) {
          //@ts-expect-error ignore
          if (item.type === 'MethodDefinition' && item.kind !== 'constructor') {
            countFunctionMetrics(item, ast, blob, resultsFile.metricResults);
          }
        }
      }
  }});  

  metricResultsFile.push(resultsFile);
}

// calculate metrics for modules
countModuleMetrics(rootDir);

function combineResultsToOutputTree(outputTree: ITreeMetricsResults, _metricResultsFile: IBlobMetricsResults[], _metricResultsScopeModule: ITreeMetricsResults[]) {
  const resultsForThisTree = _metricResultsScopeModule.find(el => el.path === outputTree.path);
  if (resultsForThisTree) {
    outputTree.metricResults = resultsForThisTree.metricResults;
  }
  
  for (let i = 0; i < outputTree.blobs.length; i++) {
    const resultsForThisBlob = _metricResultsFile.find(el => el.path === outputTree.blobs[i].path);
    if (resultsForThisBlob) {
      outputTree.blobs[i].metricResults = resultsForThisBlob.metricResults;
    }
  }

  for (const tree of outputTree.trees) {
    combineResultsToOutputTree(tree, _metricResultsFile, _metricResultsScopeModule);
  }
}

combineResultsToOutputTree(outputTree, metricResultsFile, metricResultsScopeModule);

// write results
fs.writeFileSync('result.json', JSON.stringify(outputTree, null, '  '));

console.log('Success! Results are saved to result.json');

