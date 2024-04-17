import parser from '@babel/parser';
import * as fs from 'fs';
import { findPathInFileTree, getAllBlobsFromTree } from './src/utils';
import { IBlob, IModule } from './src/types';
import { Identifier, traverse } from '@babel/types';
import AfferentCoupling from './src/metrics/AfferentCoupling';
import EfferentCoupling from './src/metrics/EfferentCoupling';
import Abstractness from './src/metrics/Abstractness';
import WeightedMethodsPerClass from './src/metrics/WeightedMethodsPerClass';
// @ts-ignore
import * as Styx from 'styx';
import DepthOfInheritanceTree from './src/metrics/DepthOfInheritanceTree';
import NumberOfChild from './src/metrics/NumberOfChild';
import CouplingBetweenObjectClasses from './src/metrics/CouplingBetweenObjectClasses';
import LackOfCohesionOfMethods from './src/metrics/LackOfCohesionOfMethods';

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

// console.log(new NumberOfChild().run(findPathInFileTree('tests', project) as IModule, 'tests/module1/A.ts'));


console.log('Starting...');

const text = `
import { B } from "../module2/B";
import { C } from "../module3/C";

export class A {
  prop1 = 'blabla'
  prop2 = new B();
  prop3 = 123;
  prop4 = 456;

  func1(param: C) {
    return param.prop1.concat(this.prop1);
  }

  func2() {
    let foo = this.prop1 + this.prop2;
  }

  func3() {
    this.prop3 = this.prop3 + this.prop4;
  }

  func4() {
    let foo = this.prop1 + this.prop4;
  }

  func5() {
    let foo = this.prop2 + this.prop3;
  }

  func6() {
    return this.prop1 + this.prop2;
  }
}
`;

const program = parser.parse(text, {
  tokens: true, 
  sourceType: 'module',
  plugins: [
    'jsx', 'typescript', 'estree'
  ]
});

// //const programFlow = Styx.parse(program.program);

console.log(new LackOfCohesionOfMethods().run(program));

// // console.log(new HansonMetric().run(program, programFlow));
// // console.log(new MaintainabilityIndex().run(program, programFlow));
