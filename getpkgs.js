const rp = require('request-promise');
const cheerio = require('cheerio')
const fs = require('fs');

const crawlerComponents = {
  uri: 'https://github.com/stone-payments/pos-mamba-sdk/tree/develop/packages/components',
  transform: (body) => cheerio.load(body),
}

rp(crawlerComponents)
  .then(($) => {
    
    const components = Array.from($('.js-navigation-item .content .js-navigation-open'))

    const componentsList = components.map((item) => item.attribs.title)

    componentsList.forEach((item) => {
  
      fs.writeFile(
        `docs/content/components/${item}.md`,
        `[filename](https://raw.githubusercontent.com/stone-payments/pos-mamba-sdk/develop/packages/components/${item}/README.md ':include')`,
        (err) => err != null ? console.log('erro do fs', err) : '');

      console.log(`Capturado ${item}`);

    })

  })
  .catch((err) => console.log(err));