import { NormalizedDistanceFromMainSequence } from "../src/metrics";
import * as fs from 'fs';

const project = JSON.parse(fs.readFileSync(__dirname + '/repo.json').toString());

test('Close to 1', () => {
  expect(new NormalizedDistanceFromMainSequence([]).run(project, 'tests/module3').value).toBe(0.75);
});

test('Close to 0', () => {
  expect(new NormalizedDistanceFromMainSequence([]).run(project, 'tests').value).toBeLessThan(0.04);
});
