const fs = require("fs");
const readline = require("readline");
const { isURL, retrieveUrl } = require("./urlService");

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
   
      const regexIgnore = /^(http(s):\/\/|#)([\w+\-&@`~#$%^*.=\/?: ]*)/;

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
        const reg = /^(http(s)?:\/\/)?[\w-]+(\.|:3000)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.%]+$/;
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


module.exports = {
  readFiles
};
