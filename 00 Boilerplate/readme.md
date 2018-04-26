# 00 Boilerplate

In this sample we are going to set up the basic plumbing to "build" our project and launch it in a dev server.

We will set up an initial npm project, give support to typescript and install react.

Then, we will create some of the files that we will need later and show a basic "hello world".

Summary steps:

- Prerequisites: Install Node.js
- Initialize package.json (npm init)
- Install:
    - Webpack and webpack-dev-server.
    - Typescript.
	- Bootstrap.
- Set up webpack.config.js
- Create a simple HTML file.
- Create some .ts and .tsx files.

# Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) if they are not already installed on your computer.

> Verify that you are running at least node v6.x.x and npm 5.x.x by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps to build it

- Navigate to the folder where you are going to create the empty project.

- Execute `npm init`, you will be prompted to answer some information requests about the project (once you have successfully fulfilled them a **package.json** file will be generated).

````
npm init
````

- Install **webpack** locally, as a development dependency (the reason to install it locally and not globally is to be easy to set up, e.g. can be launched on a clean machine without having to install anything globally but nodejs).

````
npm install webpack webpack-cli --save-dev
````
- Install **webpack-dev-server** locally, as a development dependency (the reason to install it locally and not globally is to be easy to set up, e.g. can be launched on a clean machine without having to install anything globally but nodejs).

````
npm install webpack-dev-server --save-dev
````

- Let's install locally typescript (version 2.0 or newer):

```
npm install typescript --save-dev
```

- Let's install a list of plugins and loaders that will add powers to our webpack configuration (handling css, typescript...).

```
npm install css-loader style-loader file-loader url-loader html-webpack-plugin awesome-typescript-loader mini-css-extract-plugin --save-dev
```

- We also need to create a _tsconfig.json_ file in the root folder of our project:

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "es6",
    "moduleResolution": "node",
    "declaration": false,
    "noImplicitAny": false,
    "sourceMap": true,
    "jsx": "react",
    "noLib": false,
    "suppressImplicitAnyIndexErrors": true
  },
  "compileOnSave": false,
  "exclude": [
    "node_modules"
  ]
}
```

- Let's install bootstrap:

```
npm install bootstrap --save
```

- Cause we are working with `es6`, we are going to install `babel` to transpile to `es5`:

```
npm install babel-core babel-preset-env --save-dev
```

- And add config file _.babelrc_:

```javascript
{
  "presets": [
    [
      "env",
      {
        "modules": false
      }
    ]
  ]
}
```
 
- Let's install react and react-dom libraries as project dependencies.

```
npm install react react-dom --save
```

- Install also the typescript definitions for `react` and `react-dom` but as dev dependencies.

```
npm install @types/react @types/react-dom --save-dev
``` 
 
- Now, our **package.json** file should looks something like:

```json
{
  "name": "formreacttoredux",
  "version": "1.0.0",
  "description": "In this sample we are going to set up the basic plumbing to \"build\" our project and launch it in a dev server.",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/react": "^16.3.12",
    "@types/react-dom": "^16.0.5",
    "awesome-typescript-loader": "^5.0.0",
    "babel-core": "^6.26.0",
    "babel-preset-env": "^1.6.1",
    "css-loader": "^0.28.11",
    "file-loader": "^1.1.11",
    "html-webpack-plugin": "^3.2.0",
    "mini-css-extract-plugin": "^0.4.0",
    "style-loader": "^0.21.0",
    "typescript": "^2.8.3",
    "url-loader": "^1.0.1",
    "webpack": "^4.6.0",
    "webpack-cli": "^2.0.15",
    "webpack-dev-server": "^3.1.3"
  },
  "dependencies": {
    "bootstrap": "^4.1.0",
    "react": "^16.3.2",
    "react-dom": "^16.3.2"
  }
}
```

- Let's add a script to run webpack-dev-server

_./package.json_

```diff
"scripts": {
+  "start": "webpack-dev-server  --mode development --inline --hot --open",
  "test": "echo \"Error: no test specified\" && exit 1"    
},
```

- Now it's time to create a basic _webpack.config.js_ file, this configuration will include plumbing for:

 - Launching a web dev server.
 - Transpiling from typescript to javascript.
 - Setup twitter bootstrap (including, fonts etc...).

Create a file named `webpack.config.js` in the root directory with the following content:

```javascript
let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let webpack = require('webpack');

let basePath = __dirname;

module.exports = {
  context: path.join(basePath, "src"),
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  entry: [
    './main.ts',
    '../node_modules/bootstrap/dist/css/bootstrap.css'
  ],
  output: {
    path: path.join(basePath, 'dist'),
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './dist', // Content base
    inline: true, // Enable watch and live reload
    host: 'localhost',
    port: 8080,
    stats: 'errors-only'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'awesome-typescript-loader',
        options: {
          useBabel: true,
        },
      },
      {
        test: /\.css$/,        
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/img/[name].[ext]?[hash]'
        }
      },
    ],
  },
  plugins: [
    //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html', //Name of file in ./dist/
      template: 'index.html', //Name of template in ./src
      hash: true,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
  ],
};
```

- Let's create a subfolder called _src_.

- Let's create _main.tsx_ file (under src folder):

- Let's create a basic _index.html_ file (under src folder):

_./src/index.html_

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <h1>Sample app</h1>
    <div id="root">
    </div>
  </body>
</html>
```

- Now, we will create a new folder named _pages_ and, under it, a new folder named _members_.

- Under _members_ folder, we will create four new files: _index.ts_, _viewModel.ts_, _container.tsx_ and _page.tsx_.

- At this point, _src_ folder structure should be like below:

```
.
└── src/
    └── pages/
		     └── members/
				       ├── index.ts
				       ├── viewModel.ts
				       ├── container.tsx
				       └── page.tsx
	└── index.html
	└── main.tsx
```

- Let's add a basic "hello world" to our project. In _page.tsx_, add the following code:

_./src/pages/members/page.tsx_

```javascript
import * as React from 'react';

export const MemberListPage = () => (
  <h1>Hello from member list page</h1>
);
```

- Then, let's add our page to our container. To do so, _container.tsx_ should have:

_./src/pages/members/container.tsx_

```javascript
import * as React from 'react';
import { MemberListPage } from './page';

export class MemberListContainer extends React.Component<{}, {}> {
  render() {
    return (
      <MemberListPage/>
    );
  }
}
```

- We want to use barrel, so let's export our component in _index.ts_:

_./src/pages/members/index.ts_

```javascript
export { MemberListContainer } from './container';
```

- Finally, we will wire up our component in _main.tsx_ by using react-dom:

_./src/main.tsx_

```javascript
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { MemberListContainer } from './pages/members'; 

ReactDOM.render(
  <MemberListContainer />,
  document.getElementById('root')
);
```

Now you should be able to execute `npm start` and go to `http://localhost:8080/` and see the page working.
 
# About Lemoncode

We are a team of long-term experienced freelance developers, established as a group in 2010.
We specialize in Front End technologies and .NET. [Click here](http://lemoncode.net/services/en/#en-home) to get more info about us. 
