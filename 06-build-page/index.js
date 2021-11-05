const path = require('path');
const fs = require('fs');
const { copyFile, mkdir, readdir } = require('fs/promises');


const assetsPath = path.join(__dirname, 'assets');
const destinationPath = path.join(__dirname, 'project-dist');
mkdir(destinationPath, {recursive: true});
mkdir(path.join(destinationPath, 'assets'), {recursive: true});

function removeFiles(dir) {
  try {
    const files = readdir(dir, {
      withFileTypes: true
    });
    files.then(function (files) {
      for (const file of files) {
        if (!file.isFile()) {
          let dirPath = path.join(dir, file.name);
          removeFiles(dirPath);
        } else {
          fs.unlink(path.join(dir, file.name), (err) => {
            if (err) throw err;
          });
        }
      }
    });
  } catch (err) {
    console.error(err);
  }
}

function copyDir(src, dest) {
  try {
    const files = readdir(src, {
      withFileTypes: true
    });
    files.then(function (files) {
      for (const file of files) {
        if (!file.isFile()) {
          let dirDestination = path.join(dest, file.name);
          let dirSource = path.join(src, file.name);
          mkdir(dirDestination, {recursive: true});
          copyDir(dirSource, dirDestination);
        } else {
          let source = path.join(src, file.name);
          let destination = path.join(dest, file.name);
          copyFile(source, destination);
        }
      }
    });
  } catch (err) {
    console.error(err);
  }
}

removeFiles(destinationPath);
copyDir(assetsPath, path.join(destinationPath, 'assets'));