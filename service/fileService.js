const req = require("request");
const fs = require("fs");
const readline = require("readline");
const chalk = require("chalk");

/**
 *
 * @param {string} data
 */
const isURL = (data) => {
  const HTTP = ["http://", "https://"];
  return HTTP.some((e) => data.includes(e));
};

/**
 *
 * @param {string} data
 */
const retrieveUrl = (data) => {
  const endData = [" ", ")", "]", "}", '"', "'"];
  const startIdx = data.indexOf("http");
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
 * @param {string} fileIgnore
 *
 */
const readFiles = (filename, fileIgnore = null) => new Promise(async (resolve, reject) => {
    let urlsToIgnore = [];

    if (fileIgnore) {
      // @ts-ignore
      const ignoreStream = fs.createReadStream(fileIgnore);

      ignoreStream.on('error', () => console.log(`Could not find file: ${fileIgnore}`));
      
      const linesIgnore = readline.createInterface({
        input: ignoreStream,
        crlfDelay: Infinity
      });
   
      const regexIgnore = /^(https:\/\/|http:\/\/|#)([\w+\-&@`~#$%^*.=\/?: ]*)/;

      try {
        let validFile = 0
        for await (const line of linesIgnore) {
          validFile = regexIgnore.test(line) ? validFile : ++validFile;
          isURL(line) ? urlsToIgnore.push(line) : null; 
        }
        if(validFile != 0) throw "Invalid file to ignore URLs";
      } catch (error) {
        reject(error);
      }
    }

    let data = [];
    const fileStream = fs.createReadStream(filename);
    fileStream.on('error', () => console.log(`Could not find file: ${filename}`));
    const lines = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of lines) {
      if (isURL(line)) {
        const reg = /^(http(s)?:\/\/)?[\w-]+\.+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.%]+$/;
        const url = retrieveUrl(line);
        const ignore = urlsToIgnore.some((toIgnore) => url.includes(toIgnore));
        if (reg.test(url) && !ignore){
          data.push(url);
        }
      }
    }
    if (data.length !== 0) {
      data = Array.from(new Set(data));
      resolve(data);
    } else {
      reject("No http exists");
    }
  });

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
 * @param {boolean} isColor
 */
const getStatus = (url, timeout, filter, isColor) => {
  return new Promise((resolve) => {
    req(url, { method: "HEAD", timeout }, function (_, res) {
      if (!res) {
        if (filter === "all") {
          if (isColor) {
            console.log(chalk.gray(`[unknown] ${url}`));
          } else {
            console.log(`[unknown] ${url}`);
          }
        }
        return resolve();
      }

      const status = res.statusCode;
      if (status === 200 && (filter === "all" || filter === "good")) {
        if (isColor) {
          console.log(chalk.green(`[good] ${url}`));
        } else {
          console.log(`[good] ${url}`);
        }
      } else if (
        (status >= 400 || status <= 599) &&
        (filter === "all" || filter === "bad")
      ) {
        if (isColor) {
          console.log(chalk.red(`[bad] ${url}`));
        } else {
          console.log(`[bad] ${url}`);
        }
      } else if (filter === "all" || filter === "bad") {
        if (isColor) {
          console.log(chalk.gray(`[unknown] ${url}`));
        } else {
          console.log(`[unknown] ${url}`);
        }
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
  let count = 0;
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
 * @param {boolean} isColor
 */
const checkUrls = (urls, timeout, filter, isColor) => {
  return Promise.all(
    urls.map((url) => getStatus(url, timeout, filter, isColor))
  );
};

module.exports = {
  readFiles,
  getNormalCount,
  checkUrls,
};
