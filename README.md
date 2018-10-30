# wallet-front-app v0.9.0

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Compiles and minifies for development
```
npm run build:dev
```

### Compiles and minifies for test-production
```
npm run build:test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Run your e2e tests
```
npm run test:e2e
```

## Compile api.js (API for use app as a widget) 

Note that for api.js compile, environment variable VUE_APP_PATH should be set.
For example, you can create .env.development file, set VUE_APP_PATH there and use this file in a build script in package.json
i.e
```
webpack --env=development --config webpack.api.config.js
```

or build api.js with .env.local environment
```
npm run build:apilocal
```


## Element Custom theme

Used: CLI theme tool, babel-plugin-component. Check out the [guide](http://element.eleme.io/#/en-US/component/custom-theme).

``` bash
# install the theme generator globally (or use 'node_modules/.bin/et' instead of 'et')
npm i element-theme -g

# then run the theme generator with hot reload and have fun with element-variables.scss
npm run theme:watch
```
