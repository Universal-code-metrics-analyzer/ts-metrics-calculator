import { parse } from '@babel/parser';
import * as fs from 'fs';
import { findPathInFileTree, getAllBlobsFromTree, getAllModulesFromTree, getParamNames } from './src/utils';
import { AbstractMetric, IBlob, IBlobMetricsResults, IConfig, IFileTreeNode, IFinalMetricResult, IModule, ITreeMetricsResults } from './src/types';
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

const blobs = getAllBlobsFromTree(rootDir, config.extentions);

const metricResultsScopeFunction: IFinalMetricResult[] = [];
const metricResultsScopeClass: IFinalMetricResult[] = [];
const metricResultsScopeModule: ITreeMetricsResults[] = [];

function countFunctionMetrics(node: FunctionDeclaration | FunctionExpression | any, fullAst: ParseResult<File>, blob: IBlob) {
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

      metricResultsScopeFunction.push({
        metricName: metric.name,
        resultScope: metric.scope,
        subjectPath: blob.name + '/' + (node.type === 'MethodDefinition' ? node.key.name : node.id?.name as string),
        value: _result.value,
        description: _result.description
      });
    }
  }
}

function countClassMetrics(node: ClassDeclaration, fullAst: ParseResult<File>, blob: IBlob) {
  for (const metric of metricsInstances) {
    if (metric.scope === 'class') {
      let _result;
      const params = getParamNames(metric.run);
      if (params[1] && params[1] === 'targetClassPath') {
        _result = metric.run(rootDir, blob.path);
      } else {
        _result = metric.run(fullAst);
      }

      metricResultsScopeClass.push({
        metricName: metric.name,
        resultScope: metric.scope,
        subjectPath: blob.name + '/' + node.id?.name as string,
        value: _result.value,
        description: _result.description
      });
    }
  }
}

function countModuleMetrics(module: IModule) {
  const moduleMetrics: IFinalMetricResult[] = [];
  for (const metric of metricsInstances) {
    if (metric.scope === 'module') {
      let _result;
      const params = getParamNames(metric.run);
      if (params[1] && params[1] === 'targetModulePath') {
        _result = metric.run(rootDir, module.path);
        
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
        // calculate metrics for class
        countClassMetrics(node, ast, blob);
        
        // calculate metrics for class methods
        for (const item of node.body.body) {
          //@ts-expect-error ignore
          if (item.type === 'MethodDefinition' && item.kind !== 'constructor') {
            countFunctionMetrics(item, ast, blob);
          }
        }
      }
  }});  
}

// calculate metrics for modules
const modules = getAllModulesFromTree(rootDir);

for (const module of modules) {
  countModuleMetrics(module);
}

console.log(metricResultsScopeModule);
//console.log(metricResultsScopeFunction);
//console.log(metricResultsScopeClass);


// write results
fs.writeFileSync('result.json', JSON.stringify(outputTree, null, '  '));



