class ScriptLogger {
  constructor(private name: string) {}

  private format(str: string) {
    return `[${this.name}] ${str}`;
  }

  log(message: string) {
    console.log(this.format(message));
  }

  error(message: string) {
    console.error(this.format(message));
  }

  warn(message: string) {
    console.warn(this.format(message));
  }

  table(data: any) {
    console.table(data);
  }
}

interface Services {
  logger: ScriptLogger;
}

export interface Script {
  name: string;
  run: (services: Services) => Promise<void>;
}

export async function runScript(script: Script) {
  console.log(`[runner] Running script: ${script.name}`);

  const logger = new ScriptLogger(script.name);
  try {
    await script.run({ logger });
  } catch (e: any) {
    logger.error(`Error: ${e.message}`);
    logger.error(e.stack);
  }

  console.log(`[runner] Finished script: ${script.name}`);
}
