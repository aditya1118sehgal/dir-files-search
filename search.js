const fs = require ('fs');

/**
 * @param {string} path directory path
 * @return {Promise} resolves with files in the directory, rejects on error
 */
const getAllFiles = path => {
  return new Promise ((res, rej) => {
    fs.readdir (path, (err, files) => {
      if (err) {
        rej (err);
      }
      else {
        res (files);
      }
    });
  });
};

/**
 * @param {string} file path to the file
 * @param {string} query text to search in the file
 * @return {Promise} resolves with map of line number to matched text, rejects on error
 */
const matchQueryInFile = (file, query) => {
  return new Promise (async (resolve, reject) => {
    fs.lstat(file, (err, stats) => {
      if (!stats.isDirectory()) {
        fs.readFile (file, {encoding: 'utf-8'}, (err, content) => {
          if (err) {
            reject (err);
          } else {
            const matchesByLine = {};
            if (typeof content === 'string') {
              const lines = content.split ('\n');
              lines.forEach ((line, i) => {
                if (line.includes (query)) {
                  matchesByLine[i+1] = line;
                }
              });
            }
            resolve (matchesByLine);
          }
        });
      } else {
        reject ();
      }
    });
  });
};

/**
 * Entry point
 */
const main = async () => {
  if (process.argv.length < 4) {
    console.log ('no args');
    return;
  }
  const args = process.argv.slice(2);
  const query = args[0];
  const path = args[1];

  allFiles = await getAllFiles (path);
  console.log (allFiles);
  const filesMap = {};
  for (let i = 0; i < allFiles.length; i ++) {
    const currFile = allFiles[i];
    try {
      const matches = await matchQueryInFile (path + '/' + currFile, query);
      filesMap[currFile] = matches;
    } catch (ex) {

    }
  }


  for (let fileName in filesMap) {
    for (lineNum in filesMap[fileName]) {
      console.log (fileName+':'+lineNum +'\t'+filesMap[fileName][lineNum]);
    }
  }

};

main ();
