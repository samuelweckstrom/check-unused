#!/usr/bin/env node

import fs from 'fs'
import childProcess from 'child_process'
import readline from 'readline'
import path from 'path'

class Loader {
  constructor(text: string) {
    this.text = text
  }
  text: string
  timer: NodeJS.Timer | any
  spin() {
    process.stdout.write('\x1B[?25l')
    const animation = ['.  ', '.. ', '...', '   '];
    const interval = 400
    let index = 0
    this.timer = setInterval(() => {
      process.stdout.write(this.text + ' ' + animation[index++] + '\r');
      index &= 3;
    }, interval);
  }
  stop() {
    process.stdout.write('\u001B[?25h')
    clearInterval(this.timer)
  }
}

const CONSOLE_FORMAT = {
  BLUE: '\x1b[34m',
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  BOLD: '\x1b[1m',
};

type Dependencies = { dependencies: string[] }

async function getDependencies(jsonPath: string): Promise<string[] | void> {
  let dependencies;
  await new Promise((resolve, reject) => {
    fs.readFile(jsonPath, (err: NodeJS.ErrnoException | null, data: Buffer | any): void => {
      if (err) {
        reject(new Error('Could not find package.json in current folder!'));
        return;
      }
      const parsed: Dependencies = JSON.parse(data);
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
  const command = `grep '(loader|require|from).*${dependencies.length > 1 ? `(${dependencies.join('|')})` : dependencies}' -R -E --exclude-dir={node_modules,.cache,dist} --exclude='*.log' ${pathArg}`
  const unused: string[] = await new Promise((resolve, reject) => {
    childProcess.exec(command, { maxBuffer: 1024 * 500 }, (error: childProcess.ExecException | null, stdout: string | Buffer, stderr: string): void => {
      if (stderr.length) {
        reject(new Error('No such file or directory'));
        return;
      }
      if (error) {
        resolve(dependencies.filter(dep => error.cmd && error.cmd.includes(dep)));
        return;
      }
      if (stdout) {
        resolve(dependencies.filter(dep => !stdout.includes(dep)));
        return;
      }
    });
  })
  return unused;
}

async function run() {
  const jsonPath: string = path.resolve(process.cwd(), 'package.json')
  const pathArg: string = process.argv[2];
  const loader = new Loader(pathArg ? `Scanning ${pathArg}` : 'Scanning project')
  loader.spin()
  try {
    let unusedDependencies: string[] | undefined = []
    const dependencies = await getDependencies(jsonPath);
    if (dependencies && dependencies.length) unusedDependencies = await checkUnusedDependency(dependencies, pathArg);
    readline.clearLine(process.stdout, 0)
    if (unusedDependencies && unusedDependencies.length) {
      unusedDependencies.forEach(item =>
        process.stdout.write(
          `${CONSOLE_FORMAT.BOLD}${CONSOLE_FORMAT.BLUE}` +
          'Unused dependency: \t' +
          `${CONSOLE_FORMAT.RED}` +
          item +
          '\n'
        )
      );
    } else {
      process.stdout.write(
        `${CONSOLE_FORMAT.BOLD}${CONSOLE_FORMAT.GREEN}` +
        'No unused dependencies!' +
        '\n'
      )
    }
  } catch (error) {
    process.stdout.write('\n')
    process.stdout.write(`${CONSOLE_FORMAT.BOLD}${CONSOLE_FORMAT.RED}` + error.message + '\n');
  }
  loader.stop()
}

run()

export { getDependencies, checkUnusedDependency }
