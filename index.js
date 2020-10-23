#!/usr/bin/env node
require("dotenv").config();
const chalk = require("chalk");
const { version } = require("./package.json");
const yargs = require("yargs");
const fileService = require("./service/fileService");

function main() {
  try {
    const argv = yargs
      .scriptName("http-parser")
      .usage("Usage: $0 [option]")
      .option("f", {
        alias: "file",
        describe: "Please provide a filename",
        type: "string",
        demandOption: true
      })
      .option('i', {
        alias: 'ignore',
        describe: 'Please provide a file with URLs to ignore.',
        type: 'string'
      }).
      option('t', {
        alias: 'time',
        describe: 'Provide ms for waiting for a request',
        type: 'number'
      }).
      option("a", {
        alias: 'all',
      }).
      option("g", {
        alias: 'good',
      }).
      option("b", {
        alias: 'bad',
      })
      .alias("h", "help")
      .help("h", "Show usage information & exit")
      .alias("v", "version")
      .version('version', chalk.green(`http-parser's version is ${version}`))
      .argv;
  
    const file = typeof argv.file === "object" ? [...argv.file] : [argv.file];
    const ignore = argv.i ? [argv.i] : false;
    const { good, bad } = argv;
    let filter = "all";
    if (good) {
      filter = "good";
    } else if (bad) {
      filter = "bad";
    }
    
    const isColor = (process.env.CLICOLOR !== "false" && process.env.CLICOLOR !== "0") || false;
  
    for (let i = 0; i < file.length; i++) {
      /** @type {any} */
      const timeout = argv.time || 120000;
      fileService
        .readFiles(file[i], ignore[0])
        .then((urls) => {
          fileService.checkUrls(urls, timeout, filter, isColor);
        })
        .catch((err) => console.error(err));
    }
  } catch (err) {
    console.error(err.message);
  }  
}

main();
