#!/usr/bin/env node
const jsStyleFolder = "./src/js/Style/";

// file to build all from
const baseCss = "./src/css/tailwind.css";
//read these files and remove any css that isn't in here
const purgeFilter = ["./src/**/*.js", "**/*.html"];

//normal CSS:
const cssBuild = "./src/css/tailwind.build.css";
// where to place the js file for the lit-html to import
const jsBuild = jsStyleFolder + "tailwind.js";

import postcss from "postcss";
import fs from "fs";
import cssnano from "cssnano";
const nano = new cssnano({
  preset: [
    "default",
    {
      discardComments: {
        removeAll: true,
      },
    },
  ],
});
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
// eslint-disable-next-line no-undef
const prod = process.argv.slice(2)[0] === "prod";
const devPlugins = [tailwindcss, autoprefixer, nano];
import purgecss from "@fullhuman/postcss-purgecss";
const purge = filter =>
  purgecss({
    content: filter,
    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g),
  });

fs.readFile(baseCss, (err, css) => {
  if (err) throw err;
  function callbackWrite(err, file) {
    if (err) throw err;
    console.log(`Done writing file ${file}`);
  }

  const prodPlugins = [...devPlugins, purge(purgeFilter)];
  if (prod) console.log(`PROD MODE`);
  fs.unlink(jsBuild, err => {
    if (err && err.code == "ENOENT") {
      // file doens't exist
      console.info("File doesn't exist, won't remove it.");
    } else {
      console.log(`Removed ${jsBuild}`);
    }
  });

  const plugins = prod ? prodPlugins : devPlugins;
  postcss(plugins)
    .process(css, { from: baseCss, to: jsBuild })
    .then(result => {
      const css = result.css.replace(/\\/g, "");
      fs.writeFile(cssBuild, css, err => callbackWrite(err, cssBuild));
      const jsTemplate =
        `import { css } from "lit-element";` + `export default css\`${css}\`;`;
      fs.writeFile(jsBuild, jsTemplate, err => callbackWrite(err, jsBuild));
    });
});
