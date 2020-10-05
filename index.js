#!/usr/bin/env node

const chalk = require("chalk");
const version = require("./package.json").version;
const fileService = require("./service/fileService")();
const utilService = require("./service/utilService")();

try {
  const { argv } = process;
  if (argv.length < 3) {
    throw new Error("Please provide a filename");
  }
  else {
    if (utilService.isVersion(argv.slice(1))) {
      console.log(chalk.green(`************************`));
      console.log(chalk.green(`*        ${version}         *`));
      console.log(chalk.green(`************************`));
      process.exit(0);
    }
    for (let i = 2; i < argv.length; i++) {
      const timeout = +argv[i + 1] || 120000;
      fileService
        .readFiles(argv[i])
        .then((urls) => {
          fileService.checkUrls(urls, timeout).catch((err) => console.log(err));
        })
        .catch((err) => console.error(err));
    }
  }
} catch (err) {
  console.error(err.message);
}
