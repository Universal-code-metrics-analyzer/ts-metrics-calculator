import { Abstractness } from "../src/metrics";
import * as fs from 'fs';
import { IModule } from "../src/types";
import { findPathInFileTree } from "../src/utils";

const project = JSON.parse(fs.readFileSync(__dirname + '/repo.json').toString());
const testDir = findPathInFileTree('tests', project) as IModule;

test('Has abstract classes', () => {
  expect(new Abstractness([]).run(project, 'src').value).toBeGreaterThan(0.03);
});

test('No abstract classes', () => {
  expect(new Abstractness([]).run(testDir, 'tests/module3').value).toBe(0);
});
