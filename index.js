#!/usr/bin/env node
const chalk = require('chalk');
const yargs = require('yargs');
const { version } = require('./package.json');
const fileService = require('./service/fileService');
const urlService = require('./service/urlService');
require('dotenv').config();

async function main() {
  try {
    const { argv } = yargs
      .scriptName('http-parser')
      .usage('Usage: $0 [option]')
      .option('f', {
        alias: 'file',
        describe: 'Please provide a filename',
        type: 'string',
        // demandOption: true
      })
      .option('i', {
        alias: 'ignore',
        describe: 'Please provide a file with URLs to ignore.',
        type: 'string',
      })
      .option('t', {
        alias: 'time',
        describe: 'Provide ms for waiting for a request',
        type: 'number',
      })
      .option('l', {
        alias: 'local',
        describe: 'Provide a response from a local server',
      })
      .option('a', {
        alias: 'all',
      })
      .option('g', {
        alias: 'good',
      })
      .option('b', {
        alias: 'bad',
      })
      .alias('h', 'help')
      .help('h', 'Show usage information & exit')
      .alias('v', 'version')
      .version('version', chalk.green(`http-parser's version is ${version}`));

    const { good, bad, local } = argv;
    let filter = 'all';
    if (good) {
      filter = 'good';
    } else if (bad) {
      filter = 'bad';
    }
    /** @type {any} */
    const timeout = argv.time || 120000;
    const isColor = (process.env.CLICOLOR !== 'false' && process.env.CLICOLOR !== '0') || false;
    let file;
    if (local) {
      await urlService.getContentFromLocalServer(
        'http://localhost:3000/posts',
        timeout,
        filter,
        isColor
      );
      file = ['posts.txt'];
    } else {
      file = typeof argv.file === 'object' ? [...argv.file] : [argv.file];
    }
    const ignore = argv.i ? [argv.i] : false;
    if (!file || !file[0]) {
      console.log(chalk.red('Please provide a filename'));
      process.exit(1);
    }

    for (let i = 0; i < file.length; i++) {
      fileService
        .readFiles(file[i], ignore[0])
        .then((urls) => {
          return urlService.processToParseUrls(urls, timeout, filter, isColor);
        })
        .catch((err) => console.error(err));
    }
  } catch (err) {
    console.error(err.message);
  }
}

main();
