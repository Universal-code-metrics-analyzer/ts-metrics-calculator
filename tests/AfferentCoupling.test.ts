import { AfferentCoupling } from "../src/metrics";
import * as fs from 'fs';
import { IModule } from "../src/types";
import { findPathInFileTree } from "../src/utils";

const project = JSON.parse(fs.readFileSync(__dirname + '/repo.json').toString());
const testDir = findPathInFileTree('tests', project) as IModule;

test('No coupling', () => {
  expect(new AfferentCoupling([]).run(project, 'tests').value).toBe(0);
});

test('Weak coupling', () => {
  expect(new AfferentCoupling([]).run(testDir, 'tests/module3').value).toBe(2);
});

test('Strong coupling', () => {
  expect(new AfferentCoupling([]).run(testDir, 'tests/module1').value).toBe(6);
});