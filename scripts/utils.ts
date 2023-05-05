import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const ROOT_DIR = path.join(__dirname, "../");
const SCRIPTS_DIR = path.join(ROOT_DIR, "scripts", "bin");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const FS_DIR = path.join(ROOT_DIR, ".etchmory");

export function getRootDir() {
  return ROOT_DIR;
}

export function getDistDir() {
  return DIST_DIR;
}

export function getScriptsDir() {
  return SCRIPTS_DIR;
}

export function ensureDistExists() {
  if (!fs.existsSync(DIST_DIR)) {
    throw new Error(
      "dist directory does not exist. Please run `npm run package:build` first."
    );
  }
}

export function ensureFSDirExists() {
  if (!fs.existsSync(FS_DIR)) {
    fs.mkdirSync(FS_DIR);
  }
}

export function writeToFS(filepath: string, data: any) {
  ensureFSDirExists();
  fs.writeFileSync(path.join(FS_DIR, filepath), data, {
    encoding: "utf-8",
  });
}

export function readFromFS(filepath: string) {
  ensureFSDirExists();
  return fs.readFileSync(path.join(FS_DIR, filepath), {
    encoding: "utf-8",
  });
}

export function getLatestCommitSha() {
  const command = "git log -1 --format=%H";

  try {
    const output = execSync(command, {
      encoding: "utf-8",
    });
    return output.trim().substring(0, 8);
  } catch (error) {
    console.error(`Error executing command: ${command}`, error);
    return null;
  }
}
