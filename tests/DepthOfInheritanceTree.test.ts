import { DepthOfInheritanceTree } from "../src/metrics";
import * as fs from 'fs';
import { IModule } from "../src/types";
import { findPathInFileTree } from "../src/utils";

const project = JSON.parse(fs.readFileSync(__dirname + '/repo.json').toString());
const rootDir = findPathInFileTree('tests', project) as IModule;

test('No ancestors', () => {
  expect(new DepthOfInheritanceTree([]).run(rootDir, 'tests/module1/A.ts').value).toBe(0);
});

test('Few ancestors', () => {
  expect(new DepthOfInheritanceTree([]).run(rootDir, 'tests/module1/A2.ts').value).toBe(2);
});