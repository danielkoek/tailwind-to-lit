#!/usr/bin/env node
import { minify } from "terser";
import fs from "fs";
import { minifyHTMLLiterals } from "minify-html-literals";
const build = "./build/";
const allFilles = getAllFiles(build);

const terserSettings = {
  toplevel: true,
  compress: {
    passes: 2,
  },
  nameCache: {},
};

allFilles.forEach(async file => {
  if (file.endsWith(".js") || file.endsWith(".css") || file.endsWith(".html")) {
    if (file.endsWith(".js")) {
      try {
        let htmlMini = minifyHTMLLiterals(fs.readFileSync(file, "utf8"), {
          fileName: file,
        });
        if (htmlMini) fs.writeFileSync(file, htmlMini.code);
      } catch (e) {
        //console.log(e);
      }

      let result = await minify(fs.readFileSync(file, "utf8"), terserSettings);
      fs.writeFileSync(file, result.code);
    }
  }
});
console.log("Done minifying");

function getAllFiles(dir, allFiles) {
  allFiles = allFiles || [];
  let files = fs.readdirSync(dir);
  // makes a list of all files
  files.forEach(function (file) {
    var fileOrFolder = dir + file;
    if (fs.statSync(fileOrFolder).isDirectory()) {
      var folder = fileOrFolder + "/";
      allFiles = getAllFiles(folder, allFiles);
    } else {
      allFiles.push(fileOrFolder);
    }
  });
  // return it for the next getAllFiles
  return allFiles;
}
