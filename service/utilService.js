const versions = ["-v", "/v", "--v"];

/**
 *
 * @param {array} argv
 */
const isVersion = (argv) => {
  return argv.some((arg) =>
    versions.some((keyword) => arg.startsWith(keyword))
  );
};

module.exports = {
  isVersion,
};
