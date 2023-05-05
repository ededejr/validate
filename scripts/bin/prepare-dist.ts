import * as fs from "fs";
import * as path from "path";
import type { Script } from "../runner";
import { getDistDir, getRootDir } from "../utils";

type PackageJson = Record<string, unknown>;

function parsePackageJson(): PackageJson {
  const packageJson = fs.readFileSync(
    path.join(getRootDir(), "./package.json"),
    "utf8"
  );
  return JSON.parse(packageJson);
}

function writePackageJson(packageJson: PackageJson) {
  fs.writeFileSync(
    path.join(getDistDir(), "./package.json"),
    JSON.stringify(packageJson, null, 2)
  );
}

function copyReadme() {
  fs.copyFileSync(
    path.join(getRootDir(), "./README.md"),
    path.join(getDistDir(), "./README.md")
  );
}

function copyLicense() {
  fs.copyFileSync(
    path.join(getRootDir(), "./LICENSE"),
    path.join(getDistDir(), "./LICENSE")
  );
}

const PreparePackageDistScript: Script = {
  name: "prepare-dist",
  run: async () => {
    const pkg = parsePackageJson();
    delete pkg.scripts;
    delete pkg.devDependencies;
    delete pkg.tsup;

    writePackageJson(pkg);
    copyReadme();
    copyLicense();
  },
};

export default PreparePackageDistScript;
