# Mamba SDK Docs

## Running

```
git clone https://github.com/stone-payments/pos-mamba-sdk-docs.git
cd pos-mamba-sdk-docs
yarn # Install dependencies 
yarn run dev # Run development
```
## Production mode and deployment

**To start a production version** of your app, run `npm run build && npm start`. This will disable hot module replacement, and activate the appropriate webpack plugins.

**To deploy** the Mamba SDK Documentation we use [Zeit.co Now](zeit.co/now), so just run:

```bash
yarn global add now
yarn run deploy
```

## Requirements

Make sure all dependencies have been installed before moving on:

* [Node.js](http://nodejs.org/) >= 6.9.x
* [Yarn](https://yarnpkg.com/en/docs/install)
* We recommend running in a Unix environment

### Relevant commands

* `yarn run dev`   - Start the project's dev website;
* `yarn run build` - Build application at `build` folder;
* `yarn run start` - Start production version at `build` folder;
* `yarn run postinstall` - Install missing/required packages;