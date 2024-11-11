# 🌄 subbo-api

## Development
First install the dependencies using

```
npm install
```

Then create your own `wrangler.toml` file by copying `wrangler.toml.example` and filling in the necessary details.
To run it locally you don't have to make any changes other than adding your DeepL API Key.

To build and preview using Miniflare, use
```
npm run miniflare
```

To serve using Miniflare, watch changes and build as you make changes, use 
```
npm run watch
```

To make a production build use
```
npm run build
```

### Testing

The tests are run using Jest. Use `npm test` to run your tests after building the project using `npm run build`.

This is the recommended way to develop most of your app. Write tests for core functionality instead of relying on Miniflare or `wrangler dev`.

### Publishing
To publish, first make a build using `npm run build` and then use the Wrangler CLI tool.
