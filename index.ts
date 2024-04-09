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

console.log(new DepthOfInheritanceTree().run(findPathInFileTree('tests', project) as IModule, 'tests/module1/A2.ts'));


// console.log('Starting...');

// const text = `
// class A {
//   prop1 = 1
  
//   method1() {
//     const foo = 'bla';
//     if (confIndex === -1) {
//       console.error('Error: please, specify the path to configuration JSON file');
//       for(const i = 0; i < 20; i++) {
//         if (i % 2 == 0) return 2;
//         else {
//           for(const i = 0; i < 20; i++) {
//             if (i % 2 == 0) return 2;
//             else return 1;
//           }
//         }
//       }
//       process.exit(1);
//     } else if (gigi_gaga > 0) {
//       for(const i = 0; i < 20; i++) {
//         if (i % 2 == 0) return 2;
//         else return 1;
//       }
//     }
//   }

//   method2() {
//     const a = 3;
//     var c;
//     const b = 4;
//     if (a > b) {
//       c = a
//     } else {
//       c = b
//     }
//     console.log(c);
//   }

//   method3() {
//     var jsonData;

//     var ext = path.extname(cmd.argumentDatasource.filename).toLowerCase();
//     var rawData  = fs.readFileSync(cmd.argumentDatasource.filename).toString();
//     switch(ext) {
//         case ".config":
//             jsonData = xml.parseString(rawData);
//             break;
//         case ".xml":
//             jsonData = xml.parseString(rawData);
//             break;
//         case ".json":
//             jsonData = JSON.parse(cmd.argumentDatasource.filename);
//             break;
//         case ".js":
//             jsonData = require(cmd.argumentDatasource.filename);
//             break;
//         default:
//             var msg = colors.bgRed.white(cmd.argumentDatasource.filename + " not supported as data storage");
//             console.log(msg);
//     }
//     return jsonData;
//   }
// }
// `;

// const program = parser.parse(text, {
//   tokens: true,
//   plugins: [
//     'jsx', 'typescript', 'estree'
//   ]
// });

// //const programFlow = Styx.parse(program.program);

// console.log(new DepthOfInheritanceTree().run(program, ));

// // console.log(new HansonMetric().run(program, programFlow));
// // console.log(new MaintainabilityIndex().run(program, programFlow));
