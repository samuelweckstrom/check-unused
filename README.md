# Check unused dependencies 🔍

[![Build Status](https://travis-ci.org/samuelweckstrom/check-unused.svg?branch=master)](https://travis-ci.org/samuelweckstrom/check-unused.svg?branch=master) [![TypeScript](https://badges.frapsoft.com/typescript/version/typescript-next.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

CLI tool to check package.json and scan project directory for unused dependencies.

## Usage

Run tool in the same folder where `package.json` is located.

Install globally:

```
npm i -g check-unused
```

Or run once with NPX:

```
npx check-unused
```

Will by default recursively scan from current directory. Pass another location if you want to scan a specific folder, ie:

```
npx check-unused ./src
```
