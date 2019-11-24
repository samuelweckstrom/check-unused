const test = require('ava')
const path = require('path')
const { getDependencies, checkUnusedDependency } = require('../')

test('should return dependencies from passed .json file path', async (t: any) => {
  const jsonPath: string = path.resolve(__dirname, '../../mock/test.json')
  const actual = await getDependencies(jsonPath);
  const expected = ['test-import-dependency', 'test-require-dependency', 'test-unused-dependency']
  t.deepEqual(actual, expected);
});

test('should return unused dependencies in given path', async (t: any) => {
  const dependencies = ['test-import-dependency', 'test-require-dependency', 'test-unused-dependency']
  const pathArg = path.resolve(__dirname, '../../mock/index.js')
  const actual = await checkUnusedDependency(dependencies, pathArg);
  const expected = ['test-unused-dependency']
  t.deepEqual(actual, expected);
});

