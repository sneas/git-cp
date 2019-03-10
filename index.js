#!/usr/bin/env node

const colors = require("colors");
const path = require("path");
const fs = require("fs-extra");

const url = process.argv[2];

if (url === undefined) {
  console.log(colors.red(`Git URL is not specified.`));
  process.exit(1);
}

copyGitUrl(url, process.cwd());

async function copyGitUrl(url, folder) {
  await askAboutFolder(url, folder);
  const tmpFolder = path.resolve(folder, `tmp${new Date().getTime()}`);
  await cloneRepo(url, tmpFolder);
  fs.removeSync(path.resolve(tmpFolder, ".git"));
  fs.copySync(tmpFolder, folder);
  fs.removeSync(tmpFolder);
  process.exit(0);
}

function askAboutFolder(url, folder) {
  return new Promise(resolve => {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log(
      `The contents of ${colors.bold(url)} will be copied into ${colors.bold(
        folder
      )}.`
    );
    readline.question(
      `Some content might be overridden. Are you sure? (${colors.bold("Y")}/n)`,
      answer => {
        if (answer.toUpperCase() === "Y" || answer === "") {
          resolve();
          return;
        }

        process.exit(0);
      }
    );
  });
}

function cloneRepo(url, folder) {
  const childProcess = require("child_process");
  childProcess.execSync(`git clone ${url} ${folder}`, { stdio: [0, 1, 2] });
}
