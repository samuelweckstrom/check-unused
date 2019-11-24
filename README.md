# Check unused dependencies

CLI tool to check package.json and scan project directory for unused dependencies.

## Usage

Run tool in the same folder where `package.json` is located.

Install globally: `npm i -g check-unused` \
Run once with NPX: `npx check-unused`

Will by default recursively scan from current directory. Pass another location if you want to scan a specific folder, ie:\
`npx check-unused ./src`
