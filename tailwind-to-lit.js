"use strict";
const fs = require("fs").promises;
const fsSync = require("fs");
const workerpool = require("workerpool");
const glob = require("glob");
const proxyImportResolver = (source) => {
  return source.replace(/(?:import)\s*['"].*\.\w+\.css\.js['"];/g, "");
};
const cssResultModule = (cssText) =>
  `import { css } from "lit-element";` +
  `export default css\`${cssText.replace(/\\/g, "")}\`;`;
let tailwindFiles = [];
let worker, pool;
module.exports = (snowpackConfig, pluginOptions) => {
  return {
    name: "tailwind-to-lit",
    resolve: { input: [".tail"], output: [".js", ".css"] },
    onChange({ filePath }) {
      tailwindFiles.forEach((x) => this.markChanged(x));
    },
    async load({ filePath }) {
      pool = pool || workerpool.pool(require.resolve("./worker.js"));
      worker = worker || (await pool.proxy());
      tailwindFiles.push(filePath);
      const content = await fs.readFile(filePath, "utf-8");
      if (content) {
        const encodedResult = await worker.transformAsync(content, filePath);
        const { css } = JSON.parse(encodedResult);
        return {
          ".js": cssResultModule(css),
          ".css": css,
        };
      }
    },
    async optimize({ buildDirectory }) {
      glob.sync(buildDirectory + "/**/*.js").forEach((file) => {
        const content = fsSync.readFileSync(file, "utf8");
        const resolvedImports = proxyImportResolver(content);
        fsSync.writeFileSync(file, resolvedImports, "utf8");
      });
    },
  };
};
