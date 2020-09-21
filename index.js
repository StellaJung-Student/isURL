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
        .catch((err) => console.log(err));
    })
    .catch((err) => console.error(err));
} catch (err) {
  console.error(err.message);
}
