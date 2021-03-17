"use strict";
const workerpool = require("workerpool");

const postcss = require("postcss");
const postcssrc = require("postcss-load-config");

let process = null;

async function transformAsync(content) {
  if (!process) {
    const { plugins, rcOptions } = await postcssrc({});
    const processor = postcss(plugins);
    process = (css, from) =>
      processor.process(css, { ...rcOptions, from: from });
  }
  const result = await process(content, filePath);
  return JSON.stringify({ css: result.css });
}
// create a worker and register public functions
workerpool.worker({
  transformAsync,
});
