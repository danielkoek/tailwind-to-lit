# tailwind-to-lit

Super basic Tailwind to Lit using snowpack plugin

## Installation

```bash
npm install -D tailwindcss snowpack postcss cssnano autoprefixer tailwind-to-lit
npm install lit
```

in the package.json add the following:

```json
"scripts": { 
    "start": "snowpack dev",
    "build": "snowpack build"
  },
```

```bash
npm start
```

Will start a dev server with everthing you need

```bash
npm run build
```

Will create a build version

## How to use

Create the following files:

- src/css/tailwind.tail
- tailwind.config.js
- snowpack.config.js
- postcss.config.js
  
## tailwind.tail

Can be left like the tutorial EG:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## tailwind.config.js

Since the separator of tailwinds, which is `:`  is not valid css, we have to change this manually, this will also need to take place for the spacing utility which uses `/` we will replace them with `_` and `-` keep this in mind when following tutorials, below is the config you can use

```js
module.exports = {
  separator: "_",
  purge: ["./src/**/*.js", "**/*.html"],
  theme: {
    extend: {
      spacing: {
        "1-2": "50%",
        "1-3": "33.333333%",
        "2-3": "66.666667%",
        "1-4": "25%",
        "2-4": "50%",
        "3-4": "75%",
        "1-5": "20%",
        "2-5": "40%",
        "3-5": "60%",
        "4-5": "80%",
        "1-6": "16.666667%",
        "2-6": "33.333333%",
        "3-6": "50%",
        "4-6": "66.666667%",
        "5-6": "83.333333%",
        "1-12": "8.333333%",
        "2-12": "16.666667%",
        "3-12": "25%",
        "4-12": "33.333333%",
        "5-12": "41.666667%",
        "6-12": "50%",
        "7-12": "58.333333%",
        "8-12": "66.666667%",
        "9-12": "75%",
        "10-12": "83.333333%",
        "11-12": "91.666667%",
      },
    }
  }
}
```

## snowpack.config.js

```js
module.exports = {
  mount: { src: "/" },
  routes: [{ match: "routes", src: ".*", dest: "/index.html" }],
  devOptions: { port: 443, secure: true },
  plugins: ["tailwind-to-lit"],
};

```

## postcss.config.js

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    cssnano: {
      preset: [
        "default",
        {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    },
  },
};
```
