const chalk = require('chalk');
const fileService = require('./service/fileService');

try {
  const { argv } = process;
  // console.log(argv);
  if (argv.length !== 3) {
    throw new Error('Please provide a filename');
  }
  const service = fileService();
  service
    .readFiles(argv[2])
    .then((urls) => {
      service
        .checkUrls(urls)
        .then((res) =>
          res.forEach((e) => {
            if (e.color === 'red') {
              console.log(chalk.red(`${e.url} - ${e.status}`));
            } else if (e.color === 'green') {
              console.log(chalk.green(`${e.url} - ${e.status}`));
            } else {
              console.log(chalk.gray(`${e.url} - ${e.status}`));
            }
          })
        )
        .catch((err) => console.log(err));
    })
    .catch((err) => console.error(err));
} catch (err) {
  console.error(err.message);
}
