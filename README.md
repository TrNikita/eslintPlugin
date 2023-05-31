# eslint-plugin-trn-plugin

## The plugin contains the following rules:
1) path-checker - prohibits absolute imports within one module
2) layer-imports - checks if layers are used correctly from [Feature-Sliced Design](https://feature-sliced.design/) point of view (e.g. widgets cannot be used in features and entities)
3) public-api-imports - allows import from other modules only from public api. **Has auto fix**

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-trn-plugin`:

```sh
npm install eslint-plugin-trn-plugin --save-dev
```

## Usage

Add `trn-plugin` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```js
{
    "plugins": [
        "trn-plugin"
    ]
}
```


Then configure the rules you want to use under the rules section.

```js
{
    "rules": {
      "trn-plugin/path-checker": [
        "error",
        {
          alias: "@",
        },
      ],
      
      "trn-plugin/layer-imports": [
        "error",
        {
          alias: "@", ignoreImportPatterns: ["**/StoreProvider", "**/testing"],
        },
      ],
      
      "trn-plugin/public-api-imports": [
        "error",
        {
          alias: "@",
          testFilesPatterns: ["**/*.test.*", "**/*.story.*", "**/StoreDecorator.tsx"],
        },
      ],      
    }
}
```
