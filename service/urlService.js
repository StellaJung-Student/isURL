const req = require('request');
const chalk = require('chalk');
const fs = require('fs');

/**
 *
 * @param {string} data
 */
const isURL = (data) => {
  const HTTP = ['http://', 'https://'];
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
 * @param {string} url
 * @param {number} timeout
 */
const getCount = (url, timeout) => {
  return new Promise((resolve, reject) => {
    req(url, { timeout }, (_, res) => {
      // console.log(res && res.statusCode);
      if (res && res.statusCode === 200) {
        return resolve(1);
      }
      return resolve(0);
    });
  });
};

/**
 *
 * @param {string} url
 * @param {number} timeout
 * @param {string} filter
 * @param {boolean} isColor
 */
const getStatus = (url, timeout, filter, isColor) => {
  return new Promise((resolve, reject) => {
    req(url, { method: 'HEAD', timeout }, (_, res) => {
      let message;
      if (!res) {
        if (filter === 'all') {
          message = `[unknown] ${url}`;
          if (isColor) {
            console.log(chalk.gray(`[unknown] ${url}`));
          } else {
            console.log(`[unknown] ${url}`);
          }
        }
        return resolve();
      }

      const status = res.statusCode;
      if (status === 200 && (filter === 'all' || filter === 'good')) {
        message = `[good] ${url}`;
        if (isColor) {
          console.log(chalk.green(`[good] ${url}`));
        } else {
          console.log(`[good] ${url}`);
        }
      } else if (status >= 400 && status <= 599 && (filter === 'all' || filter === 'bad')) {
        message = `[bad] ${url}`;
        if (isColor) {
          console.log(chalk.red(`[bad] ${url}`));
        } else {
          console.log(`[bad] ${url}`);
        }
      } else if (filter === 'all' || filter === 'bad') {
        message = `[unknown] ${url}`;
        if (isColor) {
          console.log(chalk.gray(`[unknown] ${url}`));
        } else {
          console.log(`[unknown] ${url}`);
        }
      }
      return resolve(message);
    });
  });
};

/**
 *
 * @param {array} urls
 * @param {number} timeout
 */
const getNormalCount = (urls, timeout) => {
  let count = 0;
  const promises = [];
  try {
    for (const url of urls) {
      promises.push(getCount(url, timeout));
    }
    return Promise.all(promises).then((res) => {
      res.forEach((num) => {
        count += num;
      });
      if (count === 0) {
        throw new Error('No urls');
      }
      return count;
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

/**
 *
 * @param {array} urls
 * @param {number} timeout
 * @param {string} filter
 * @param {boolean} isColor
 */
const processToParseUrls = (urls, timeout, filter, isColor) => {
  return Promise.all(urls.map((url) => getStatus(url, timeout, filter, isColor)));
};

const getContentFromLocalServer = (url, timeout, filter, isColor) => {
  console.log(url, timeout, filter, isColor);
  return new Promise((resolve, reject) => {
    // for localhost:3000
    req(url, { timeout }, (_, res) => {
      if (!res) {
        if (filter === 'all') {
          if (isColor) {
            console.log(chalk.gray(`[unknown] ${url}`));
          } else {
            console.log(`[unknown] ${url}`);
          }
        }
        return reject(new Error('no response'));
      }
      const result = JSON.parse(res.body).map((post) => `${url}/${post.id}`);
      if (result.length === 0) {
        reject(new Error('no response'));
      }
      try {
        fs.writeFile(`posts.txt`, result.join('\n'), (err) => {
          if (err) throw err;
          return resolve();
        });
      } catch (err) {
        return reject(err);
      }
      return reject(new Error('no response'));
    });
  });
};

module.exports = {
  isURL,
  retrieveUrl,
  getStatus,
  getNormalCount,
  processToParseUrls,
  getContentFromLocalServer,
};
