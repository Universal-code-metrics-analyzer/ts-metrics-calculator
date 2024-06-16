# Javascript/Typescript metrics calculator

Metrics calculator is used to calculate source code metrics for a given files tree.

## Installation

```npm install```

## Usage
To run calculation, you need two JSON files:
- files tree of your project (you can find the format of such tree in `src/types.ts/IModule`)
- configuration file that specifies root dir that should be analyzed, file extensions, and metrics that should be analyzed. See `config.example.json` to understand how it looks like 

You can pass JSON file repository's code tree in stdin:
```bash
cat <your config file> | node --no-warnings=ExperimentalWarning --loader ts-node/esm index.ts --conf <path to config file>
```
Then the result is passed to stdout.

Or pass it with `--proj` flag
```bash
node --no-warnings=ExperimentalWarning --loader ts-node/esm index.ts --proj <path to your project tree> --conf <path to config file>
```
Then the result is passed to result.json in the same directory.