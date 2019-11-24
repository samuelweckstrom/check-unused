#!/usr/bin/env node

const fs = require('fs');
const childProcess = require('child_process');
const path = require('path')

const CONSOLE_FORMAT = {
  BLUE: '\x1b[34m',
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  BOLD: '\x1b[1m',
};

async function getDependencies(path: string): Promise<string[] | any> {
  let dependencies;
  await new Promise((resolve, reject) => {
    fs.readFile(path, (err: object, data: string) => {
      if (err) {
        reject(new Error('Could not find package.json in current folder!'));
        return;
      }
      const parsed = JSON.parse(data);
      dependencies = parsed.dependencies && Object.keys(parsed.dependencies);
      if (!dependencies) {
        reject(new Error('No dependencies defined in package.json!'));
        return;
      }
      resolve();
    });
  });
  return dependencies;
}

async function checkUnusedDependency(dependencies: string[], pathArg: string = '.') {
  if (!dependencies || !dependencies.length) return;
  const unused: string[] = [];
  await Promise.all(
    dependencies.map(async dependency => {
      const command = `grep '(loader|require|from).*${dependency}' -R  -E --exclude-dir='node_modules' ${pathArg}`;
      await new Promise((resolve, reject) => {
        childProcess.exec(command, (err: string, stdout: string, stderr: string) => {
          if (stderr.length) {
            reject(new Error(stderr));
            return;
          }
          if (err) {
            unused.push(dependency);
            resolve();
            return;
          }
          if (stdout) {
            resolve();
          }
        });
      });
    })
  );
  return unused;
}

async function run() {
  const jsonPath = path.resolve(process.cwd(), 'package.json')
  const pathArg = process.argv[2];
  try {
    let unusedDependencies: string[] | undefined = []
    const dependencies = await getDependencies(jsonPath);
    if (dependencies.length) unusedDependencies = await checkUnusedDependency(dependencies, pathArg);
    if (unusedDependencies && unusedDependencies.length) {
      unusedDependencies.forEach(item =>
        console.log(
          `${CONSOLE_FORMAT.BOLD}${CONSOLE_FORMAT.BLUE}`,
          'Unused dependency: \t',
          `${CONSOLE_FORMAT.RED}`,
          item
        )
      );
      return;
    }
    console.log(
      `${CONSOLE_FORMAT.BOLD}${CONSOLE_FORMAT.GREEN}`,
      'No unused dependencies!'
    );
  } catch (error) {
    console.log(`${CONSOLE_FORMAT.BOLD}${CONSOLE_FORMAT.RED}`, error.message);
  }
}

module.exports = run();
