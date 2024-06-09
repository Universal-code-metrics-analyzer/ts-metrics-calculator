import { Instability } from "../src/metrics";
import * as fs from 'fs';

const project = JSON.parse(fs.readFileSync(__dirname + '/repo.json').toString());

test('Stable module', () => {
  expect(new Instability([]).run(project, 'tests/module3').value).toBe(0.25);
});

test('Instable module', () => {
  expect(new Instability([]).run(project, 'tests').value).toBe(1);
});
