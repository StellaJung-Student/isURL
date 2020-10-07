const req = require('request');
const fs = require('fs');
const readline = require('readline');
const chalk = require('chalk');

const HTTP = ['http://', 'https://'];

let count = 0;

/**
 *
 * @param {string} data
 */
const isURL = (data) => {
  return HTTP.some((e) => data.includes(e));
};

/**
 *
 * @param {string} data
 */
const retrieveUrl = (data) => {
  const endData = [' ', ')', ']', '}', '"', "'"];
  const startIdx = data.indexOf('http');
  let endIdx = data.length;
  for (let i = 0; i < endData.length; i++) {
    const idx = data.slice(startIdx).indexOf(endData[i]);
    if (idx !== -1) {
      endIdx = endIdx > idx ? idx : endIdx;
    }
  }
  return data.slice(startIdx, startIdx + endIdx);
};

/**
 *
 * @param {string} filename
 */
const readFiles = (filename) => {
  console.log("ff", filename)
  return new Promise(async (resolve, reject) => {
    let data = [];
    const fileStream = fs.createReadStream(filename);

    const lines = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of lines) {
      if (isURL(line)) {
        const reg = /^(http(s)?:\/\/)?[\w-]+\.+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.%]+$/;
        const url = retrieveUrl(line);
        if (reg.test(url)) {
          data.push(url);
        }
      }
    }
    if (data.length !== 0) {
      data = Array.from(new Set(data));
      resolve(data);
    } else {
      reject('No http exists');
    }
  });
};

/**
 *
 * @param {string} url
 * @param {number} timeout
 */
const getCount = (url, timeout) => {
  return new Promise((resolve, reject) => {
    req(url, { timeout }, function (_, res) {
      // console.log(res && res.statusCode);
      if (res && res.statusCode === 200) {
        resolve(1);
      } else {
        resolve(0);
      }
    });
  });
};

/**
 *
 * @param {string} url
 * @param {number} timeout
 * @param {string} filter
 */
const getStatus = (url, timeout, filter) => {
  return new Promise((resolve) => {
    req(url, { method: 'HEAD', timeout }, function (_, res) {
      if (!res) {
        if (filter === "all") {
          console.log(chalk.gray(`[unknown] ${url}`));
        }
        return resolve();
      }
      const status = res.statusCode;
      if (status === 200 && (filter === "all" || filter === "good")) {
        console.log(chalk.green(`[good] ${url}`));
      } else if ((status >= 400 || status <= 599) && (filter === "all" || filter === "bad")) {
        console.log(chalk.red(`[bad] ${url}`));
      } else if (filter === "all" || filter === "bad") {
        console.log(chalk.gray(`[unknown] ${url}`));
      }

      resolve();
    });
  });
};

/**
 *
 * @param {array} urls
 * @param {number} timeout
 */
const getNormalCount = (urls, timeout) => {
  const promises = [];
  for (const url of urls) {
    promises.push(getCount(url, timeout));
  }
  return Promise.all(promises).then((res) => {
    res.forEach((num) => {
      count += num;
    });
    return count;
  });
};

/**
 *
 * @param {array} urls
 * @param {number} timeout
 * @param {string} filter
 */
const checkUrls = (urls, timeout, filter) => {
  return Promise.all(urls.map((url) => getStatus(url, timeout, filter)));
};

module.exports = function fileService() {
  return {
    readFiles,
    getNormalCount,
    checkUrls,
  };
};
