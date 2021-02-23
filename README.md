# tailwind-to-lit

Super basic Tailwind to Lit

## Installation

```bash
npm install -d tailwind-to-lit
```

in the package.json add the following:

```json
"scripts": { 
    "build-dev": "tailwind-to-lit",
    "build": "tailwind-to-lit prod",
    "minify":"minify-lit",
  },
```

```bash
npm run build-dev
```

Will produce a full fledged js file (make sure you created the folder structure first)

```bash
npm run build
```

Will create a build version, it will check all your js files and html files in the src folder and purge any css class names that are not used in the final tailwind.js file

Last but not least:

```bash
npm run minify
```

Will look at the `./build/` folder and will minify any js,css or html file.

## How to use

Create the following files:

- src/css/tailwind.css
- src/js/Style/tailwind.js <- this one will be overridden
- tailwind.config.js
  
## tailwind.css

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
  purge: [],
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

### Things to understand

The reason the minifier will look in the `./build/` is because you need to build the code, with building it is nothing more then node resolving, with something like Snowpack or similar tool. Snowpack is the tool of chose that I usually use for dev and build, if you want to use this too the only thing you have to change is to change the package.json

```json
"scripts": { 
   "start": "tailwind-to-lit && snowpack dev",
    "build": "tailwind-to-lit prod && snowpack build && minify-lit",
}
```

And mount the `src` folder in the snowpack config. This will work exceptional well on modern browsers since they can fetch multiple resource concurrently, and makes your code super easy to debug, even in production (though the minify might change some of the variable names).
