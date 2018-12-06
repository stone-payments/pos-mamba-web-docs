# Mamba SDK Docs

## Running

```
git clone https://github.com/stone-payments/pos-mamba-sdk-docs.git
cd pos-mamba-sdk-docs
npm i # Install dependencies 
npm run dev # Run development
```
## Production mode and deployment

**To start a production version** of your app, run `npm run build && npm start`. This will disable hot module replacement, and activate the appropriate webpack plugins.

**To deploy** the Mamba SDK Documentation we use [Zeit.co Now](zeit.co/now), so just run:

```bash
npm i -g now
npm run deploy
```

## Requirements

Make sure all dependencies have been installed before moving on:

* [Node.js](http://nodejs.org/) >= 6.9.x
* [Yarn](https://yarnpkg.com/en/docs/install)
* We recommend running in a Unix environment

### Relevant commands

* `npm run dev`   - Start the project's dev website;
* `npm run build` - Build application at `build` folder;
* `npm run start` - Start production version at `build` folder;
* `npm run postinstall` - Install missing/required packages;


## Development Certificates

To run development https server, you will need generate a Self-Signed, Trusted Certificates for Node.js.

### Create a key and certificate
First we’ll need to generate a key and corresponding certificate. Open up Terminal and use the following commands to do this.

```shell
openssl genrsa -out localhost.key 2048
openssl req -new -x509 -key localhost.key -out localhost.cert -days 3650 -subj /CN=localhost
```

If you want to use a host other than localhost then replace every reference to “localhost” above witb your custom domain.

### Accept the certificate on your host machine

In order to make the self-signed certificate trusted we need to accept it as a valid certificate on our machine. Doing this will replace red warning (“Unsecured”) notices with a green lock, fully replicating a https/SSL website on localhost for testing.


#### MAC OS X
1. Open the “Keychain Access” application, in Finder > Applications > Utilities
2. Drag and drop the cert file into the application window
3. Select “Always Trust” in the dialog box which appears, or alternatively double click on the certificate with the name localhost under the “Certificates” category
4. Restart your browser and open up https://localhost to see your trusted, SSL localhost setup in action
