"use strict";
const fs = require("fs").promises;
const workerpool = require("workerpool");

const cssResultModule = (cssText) =>
  `import { css } from "lit-element";` +
  `export default css\`${cssText.replace(/\\/g, "")}\`;`;

let worker, pool;
module.exports = (snowpackConfig, pluginOptions) => {
  return {
    name: "tailwind-to-lit",
    resolve: { input: [".css"], output: [".js", ".css"] },
    async load({ filePath, isDev }) {
      pool = pool || workerpool.pool(require.resolve("./worker.js"));
      worker = worker || (await pool.proxy());
      const content = await fs.readFile(filePath, "utf-8");

      if (content) {
        const encodedResult = await worker.transformAsync(content);
        const { css } = JSON.parse(encodedResult);
        return {
          ".js": cssResultModule(css),
          ".css": css,
        };
      }
    },
  };
};
