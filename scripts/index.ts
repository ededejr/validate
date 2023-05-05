import * as path from "path";
import { runScript } from "./runner";
import { getScriptsDir } from "./utils";

async function main() {
  const args = process.argv.slice(2);
  const scriptPath = args[0];
  const script = require(path.join(getScriptsDir(), `${scriptPath}.ts`));

  if ("default" in script) {
    await runScript(script.default);
  } else {
    console.error('Malformed script: missing "default" export');
  }
}

main();
