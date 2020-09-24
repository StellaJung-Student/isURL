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
  const endData = [' ', ')', ']', '}'];
  const startIdx = data.indexOf('http');
  let endIdx = data.length - 1;
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
 */
const getCount = (url) => {
  return new Promise((resolve, reject) => {
    req(url, { timeout: 1500 }, function (_, res) {
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
 */
const getStatus = (url) => {
  return new Promise((resolve) => {
    req(url, { method: 'HEAD', timeout: 1500 }, function (_, res) {
      if (!res) {
        console.log(chalk.gray(`[???] ${url}`));
        return resolve();
      }

      const status = res.statusCode;
      if (status === 200) {
        console.log(chalk.green(`[200] ${url}`));
      } else if (status >= 400 || status <= 599) {
        console.log(chalk.red(`[${status}] ${url}`));
      } else {
        console.log(chalk.gray(`[${status}] ${url}`));
      }

      resolve();
    });
  });
};

/**
 *
 * @param {array} urls
 */
const getNormalCount = (urls) => {
  const promises = [];
  for (const url of urls) {
    promises.push(getCount(url));
  }
  return Promise.all(promises).then((res) => {
    res.forEach((num) => {
      count += num;
    });
    return count;
  });
};

const checkUrls = (urls) => Promise.all(urls.map(getStatus));

module.exports = function fileService() {
  return {
    readFiles,
    getNormalCount,
    checkUrls,
  };
};
